# Insurance Claims Showcase

A showcase project demonstrating agent communication for insurance claims intake.
Includes a voice-enabled insurance claims intake system built with Google's Gemini Live API, Agent Development Kit (ADK), and Model Context Protocol (MCP) servers.
This system provides real-time voice interaction for handling insurance claims intake conversations through specialized AI agents.

----

## Table of Contents

- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Gemini Model Selection](#gemini-model-selection-as-of-2025-09-29)
- [Current Limitations](#current-limitations)

----

## Key Features

- **Real-time Voice Conversation**: WebSocket-based bidirectional streaming for low-latency voice interaction
- **Claims Data Collection**: Agent processes and collects insurance claim information through natural conversation
- **Mock Customer Database**: MCP server provides simulated customer data for demonstration purposes
- **Native Voice Model**: Uses Google's native audio models for natural-sounding speech synthesis
- **ADK Integration**: Built on Agent Development Kit with bidirectional streaming via Gemini Live API
- **Production Deployment**: Deployed to development cluster with Google SSO-secured access

----

## Prerequisites

The following tools and dependencies are required to run this project:

- **Python 3.13+**: Required for agent components and MCP servers
- **Node.js 22+**: For frontend development and build
- **Google Cloud SDK**: For ADK and Gemini API integration
- **uv 0.5.0+**: Python package manager for dependency management
- **Tilt**: Kubernetes development environment orchestration
- **Docker**: For containerization and local Kubernetes
- **Google Gemini API Key**: For Live API access

----

## Getting Started

### 1. Install Dependencies

```bash
# Install system dependencies via Homebrew
brew bundle
```
```bash
# Install Python dependencies for agents and MCP servers
uv sync --all-packages
```

### 2. Authentication Setup

```bash
# Authenticate with Google Cloud for AI model access
gcloud auth application-default login
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```dotenv
# Google Cloud Configuration
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=<your-api-key-here>
```

### 4. Start the Application

Launch all services using Tilt:

```bash
# Start all agents and frontend
tilt up
```
```bash
# View real-time logs
tilt logs
```

**Expected Results:**
- Frontend available at http://localhost:8080

## Development

### Developer Setup
For detailed contributing guidelines, refer to the [global contributing guide](https://github.com/agentic-layer/.github?tab=contributing-ov-file).

**Mandatory first step for contributors:**
```bash
# Activate pre-commit hooks
pre-commit install
```

### Code Quality Standards

**Code Style:**
- **Linting**: Ruff with 120 character line limit
- **Type Checking**: mypy for static type analysis
- **Security**: Bandit for security vulnerability detection
- **Import Organization**: import-linter for dependency management

**Development Commands:**
```bash
# Run all quality checks
uv run poe check

# Individual checks
uv run poe mypy          # Type checking
uv run poe ruff          # Linting and formatting
uv run poe bandit        # Security analysis
uv run poe lint-imports  # Import dependency validation
uv run poe test          # Execute test suite

# Auto-formatting
uv run poe format        # Code formatting
uv run poe lint          # Auto-fix linting issues
```

## Gemini Model Selection (as of 2025-09-29)

The agent supports multiple Gemini Live API models with different characteristics:

**Non-Native Audio Models** (Fast, robotic voice):
- `gemini-2.0-flash-exp`
- `gemini-2.0-flash-live-001`
- `gemini-live-2.5-flash-preview`
- `gemini-2.5-flash-live-preview`

**Native Audio Models** (Natural voice, slower):
- `gemini-2.5-flash-preview-native-audio-dialog`
- `gemini-2.5-flash-exp-native-audio-thinking-dialog` (too high latency for real-time conversations)
- `gemini-2.5-flash-native-audio-latest`
- `gemini-2.5-flash-native-audio-preview-09-2025`

**Note**: Native audio models sometimes have short pauses in the TTS output.

## Current Limitations

- **No Data Forwarding**: Claims data is not forwarded to other systems or agents for further processing
- **No LiteLLM Support**: LiteLLM cannot be used as the ADK does not support LiteLLM's Gemini Live API implementation for real-time streaming
- **Limited Observability**: ADK with Gemini Live API does not support plugins/callbacks, preventing use of the observability dashboard. 
- **No Traces**: They would only show WebSocket data with information about audio chunks sent/received
- **Claims Processing**: The agent collects claims data during the intake conversation but does not persist claims beyond the conversation session