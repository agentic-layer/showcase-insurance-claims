"""
Callback handlers and plugins for monitoring agent events and tool executions.

This module provides OpenTelemetry tracing integration for ADK agents,
capturing tool calls, model interactions, and conversation events.
"""

import logging
from typing import Any, Dict, Optional

from google.adk.agents.callback_context import CallbackContext
from google.adk.agents.invocation_context import InvocationContext
from google.adk.events.event import Event
from google.adk.plugins.base_plugin import BasePlugin
from google.adk.tools import BaseTool, ToolContext
from opentelemetry import trace

logger = logging.getLogger(__name__)


def _flatten_dict(data: Any, parent_key: str = "", sep: str = ".") -> Dict[str, Any]:
    """Flatten nested dict/list structures for OpenTelemetry span attributes."""
    items: list[tuple[str, Any]] = []

    if isinstance(data, dict):
        for k, v in data.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            items.extend(_flatten_dict(v, new_key, sep=sep).items())
    elif isinstance(data, list):
        for i, v in enumerate(data):
            new_key = f"{parent_key}{sep}{i}"
            items.extend(_flatten_dict(v, new_key, sep=sep).items())
    elif data is not None:
        # Convert to span-compatible types
        if isinstance(data, (str, bool, int, float)):
            items.append((parent_key, data))
        else:
            items.append((parent_key, str(data)))

    return dict(items)

def _set_span_attributes_from_callback_context(span: Any, callback_context: CallbackContext) -> None:
    """Set span attributes from callback context including conversation and invocation IDs."""
    conversation_id = (
            callback_context.state.to_dict().get("conversation_id") or callback_context._invocation_context.session.id
    )
    span.set_attribute("agent_name", callback_context.agent_name)
    span.set_attribute("conversation_id", conversation_id)
    span.set_attribute("invocation_id", callback_context.invocation_id)
    span.set_attributes(callback_context.state.to_dict())

    if callback_context.user_content:
        span.set_attributes(_flatten_dict(callback_context.user_content.model_dump(), parent_key="user_content"))

def _set_span_attributes_for_tool(span: Any, tool: BaseTool, args: Dict[str, Any], tool_context: ToolContext) -> None:
    """Set span attributes for tool execution including tool name, arguments, and context."""
    _set_span_attributes_from_callback_context(span, tool_context)
    span.set_attributes(_flatten_dict(tool_context.actions.model_dump(), parent_key="tool_context.actions"))
    span.set_attribute("tool_name", tool.name)
    span.set_attributes(_flatten_dict(args, parent_key="args"))


def _set_base_span_attributes(span: Any, conversation_id: str, agent_name: str) -> None:
    """Set base span attributes common to all events."""
    span.set_attribute("conversation_id", conversation_id)
    span.set_attribute("agent_name", agent_name)
    span.set_attribute("invocation_id", conversation_id)

def _set_model_callback_attributes(span: Any, conversation_id: str, agent_name: str, text: Optional[str] = None) -> None:
    """Set attributes for after_model_callback span."""
    _set_base_span_attributes(span, conversation_id, agent_name)
    if text:
        span.set_attribute("llm_response.content.parts.0.text", text)

def _set_before_agent_attributes(span: Any, conversation_id: str, agent_name: str) -> None:
    """Set attributes for before_agent_callback span."""
    _set_base_span_attributes(span, conversation_id, agent_name)

def _set_before_model_attributes(span: Any, conversation_id: str, agent_name: str, user_text: str) -> None:
    """Set attributes for before_model_callback span with user input."""
    _set_base_span_attributes(span, conversation_id, agent_name)
    span.set_attribute("user_content.parts.0.text", user_text)
    span.set_attribute("user_content.role", "user")

def _set_after_agent_attributes(span: Any, conversation_id: str, agent_name: str,
                                turn_complete: bool = False, interrupted: bool = False) -> None:
    """Set attributes for after_agent_callback span."""
    _set_base_span_attributes(span, conversation_id, agent_name)
    if turn_complete:
        span.set_attribute("turn_complete", True)
    if interrupted:
        span.set_attribute("interrupted", True)

def _set_usage_metadata_attributes(span: Any, conversation_id: str, agent_name: str,
                                   total_tokens: int, prompt_tokens: int, response_tokens: int) -> None:
    """Set attributes for usage_metadata span."""
    _set_base_span_attributes(span, conversation_id, agent_name)
    span.set_attribute("llm_response.usage_metadata.total_token_count", total_tokens)
    span.set_attribute("llm_response.usage_metadata.prompt_token_count", prompt_tokens)
    span.set_attribute("llm_response.usage_metadata.candidates_token_count", response_tokens)


async def after_tool_callback(tool: BaseTool, args: Dict[str, Any], tool_context: ToolContext, tool_response: Dict)\
        -> Optional[dict]:
    """Handle post-tool execution tracing."""
    logger.info("Tool called")
    with trace.get_tracer(__name__).start_as_current_span("after_tool_callback") as span:
        _set_span_attributes_for_tool(span, tool, args, tool_context)
        if isinstance(tool_response, (dict, list)):
            span.set_attributes(_flatten_dict(tool_response, parent_key="tool_response"))
    return None

async def before_tool_callback(tool: BaseTool, args: Dict[str, Any], tool_context: ToolContext) -> \
        Optional[dict]:
    """Handle pre-tool execution tracing."""
    logger.info("Tool returned")
    with trace.get_tracer(__name__).start_as_current_span("before_tool_callback") as span:
        _set_span_attributes_for_tool(span, tool, args, tool_context)
    return None


class LiveEventMonitorPlugin(BasePlugin):
    """
    Monitors agent events and emits OpenTelemetry spans for observability.

    Captures and traces:
    - User speech transcriptions
    - Model responses (text and speech)
    - Turn completions and interruptions
    - Token usage metadata
    """

    def __init__(self):
        super().__init__(name="live_event_monitor")
        self.tracer = trace.get_tracer(__name__)

    async def on_event_callback(
        self, *, invocation_context: InvocationContext, event: Event
    ) -> Optional[Event]:
        """Process events and emit tracing spans."""
        conversation_id = invocation_context.session.id
        agent_name = invocation_context.agent.name

        # Model responses
        if not event.partial:
            has_text = event.content and event.content.parts and any(part.text for part in event.content.parts if part.text)
            has_speech = event.output_transcription and event.output_transcription.text

            if has_text or has_speech:
                text = event.output_transcription.text if (has_speech and event.output_transcription) else None
                with self.tracer.start_as_current_span("after_model_callback") as span:
                    _set_model_callback_attributes(span, conversation_id, agent_name, text)
                if has_speech and event.output_transcription:
                    logger.info(f"Agent speech output: {event.output_transcription.text}")

        # Model thoughts
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    logger.info(f"Model thoughts: {part.text}")

        # User speech transcriptions
        if event.input_transcription and event.input_transcription.text:
            with self.tracer.start_as_current_span("before_agent_callback") as span:
                _set_before_agent_attributes(span, conversation_id, agent_name)

            if not event.partial:
                with self.tracer.start_as_current_span("before_model_callback") as span:
                    _set_before_model_attributes(span, conversation_id, agent_name,
                                                event.input_transcription.text)

            status = "partial" if event.partial else "complete"
            logger.info(f"User speech ({status}): {event.input_transcription.text}")

        # Agent speech transcriptions
        if event.output_transcription:
            status = "partial" if event.partial else "complete"
            logger.info(f"Agent speech ({status}): {event.output_transcription.text}")

        # Turn completion
        if event.turn_complete:
            with self.tracer.start_as_current_span("after_agent_callback") as span:
                _set_after_agent_attributes(span, conversation_id, agent_name, turn_complete=True)
            logger.info("Turn complete")

        if event.interrupted:
            with self.tracer.start_as_current_span("after_agent_callback") as span:
                _set_after_agent_attributes(span, conversation_id, agent_name, interrupted=True)
            logger.info("Turn interrupted")

        # Usage metadata
        if event.usage_metadata:
            with self.tracer.start_as_current_span("usage_metadata") as span:
                _set_usage_metadata_attributes(
                    span, conversation_id, agent_name,
                    event.usage_metadata.total_token_count or 0,
                    event.usage_metadata.prompt_token_count or 0,
                    event.usage_metadata.candidates_token_count or 0
                )
            logger.info("Usage metadata: "
                        f"Prompt tokens={event.usage_metadata.prompt_token_count}, "
                        f"Response tokens={event.usage_metadata.candidates_token_count}, "
                        f"Total tokens={event.usage_metadata.total_token_count}")

        return None
