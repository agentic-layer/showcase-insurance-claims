# Insurance Claims Showcase

A showcase demonstrating the [Agentic Layer](https://docs.agentic-layer.ai/) platform for building and orchestrating AI
agent systems. This project illustrates multi-agent workflows, agent-to-agent communication via Model Context Protocol (
MCP), and multiple interaction patterns for insurance claims processing.

**Key Technologies:**

- **Agentic Layer**: Agent orchestration platform with runtime, gateways, and observability
- **Agents**: Text-based claims analysis agent (Google ADK) and voice-enabled claims intake agent (Gemini Live API)
- **MCP Servers**: Model Context Protocol servers providing customer database tools
- **Integration Options**: REST API, A2A protocol, LibreChat UI, n8n workflows

For detailed documentation on Agentic Layer components, see [docs.agentic-layer.ai](https://docs.agentic-layer.ai/).

----

## Table of Contents

- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Using the Showcase](#using-the-showcase)
    - [Testing Agents with curl](#testing-agents-with-curl)
    - [Using LibreChat](#using-librechat)
    - [n8n Workflow Integration](#n8n-workflow-integration)
- [Voice Agent Details](#voice-agent-details)
- [Architecture Overview](#architecture-overview)
- [Helm Chart](#helm-chart)
- [Development](#development)
- [Current Limitations](#current-limitations)

----

## Key Features

### Agentic Layer Platform

This showcase demonstrates the core capabilities of the Agentic Layer platform:

- **Agent Runtime**: Kubernetes-native agent orchestration using Custom Resource Definitions (Agent, ToolServer,
  AgenticWorkforce)
- **Agent Gateway**: OpenAI-compatible REST API for accessing agents, enabling standardized integration
- **AI Gateway**: Unified LLM access via LiteLLM, supporting multiple model providers (Gemini, OpenAI, etc.)
- **MCP Integration**: Agent capabilities extended through Model Context Protocol tool servers
- **Multi-Modal Access**: Agents accessible via REST API, A2A protocol, chat UI (LibreChat), and workflow automation (
  n8n)
- **Observability**: Full OTEL integration with LGTM stack (Loki, Grafana, Tempo, Mimir)

### Claims Processing Agents

**claims-analysis-agent** (Primary Demo):

- Text-based agent for analyzing insurance claim conversation transcripts
- Extracts structured JSON data (customer info, incident details, damage assessment)
- Accessible via multiple channels: Agent Gateway REST API, direct A2A protocol, LibreChat, n8n workflows
- Uses MCP customer database server for data lookup

**claims-voice-agent** (Specialized Capability):

- Real-time voice conversation for claims intake using Google's Gemini Live API
- Conducts structured interviews in German via WebSocket streaming
- See [Voice Agent Details](#voice-agent-details) for more information

----

## Prerequisites

The following tools and dependencies are required:

- **Python 3.13+**: For agents and MCP servers
- **Node.js 22+**: For frontend development
- **Google Cloud SDK**: For ADK and Gemini API integration
- **uv 0.5.0+**: Python package manager
- **Tilt**: Kubernetes development environment orchestration
- **Docker Desktop**: With Kubernetes enabled
- **Google Gemini API Key**: For AI model access

----

## Getting Started

### 1. Install Dependencies

```bash
# Install system dependencies via Homebrew
brew bundle
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```dotenv
# Required: Google Gemini API Key
GOOGLE_API_KEY=<your-api-key-here>

# Optional: OpenAI API for testing with other models
OPENAI_API_KEY=<your-openai-api-key>
```

### 3. Start All Services

Launch the complete environment using Tilt:

```bash
# Start all agents, MCP servers, gateways, and infrastructure
tilt up
```

**Service URLs:**

- **LibreChat**: http://localhost:12040
- **n8n**: http://localhost:12041
- **Grafana (Monitoring)**: http://localhost:12000
- **Observability Dashboard**: http://localhost:12004
- **Agent Gateway**: http://localhost:12002
- **AI Gateway (LiteLLM)**: http://localhost:12001
- **Frontend (Voice Agent)**: http://localhost:12030

----

## Using the Showcase

### Testing Agents with curl

The showcase includes a test script demonstrating both Agent Gateway protocols:

```bash
# Test both OpenAI-compatible API and A2A protocol
./scripts/test-claims-agent.sh

# Test only OpenAI-compatible API
./scripts/test-claims-agent.sh openai

# Test only A2A protocol
./scripts/test-claims-agent.sh a2a
```

### Using LibreChat

LibreChat provides a user-friendly chat interface for interacting with agents and LLMs.

**Access:** http://localhost:12040

**Configured Endpoints:**

1. **AI Gateway Endpoint**
    - Name: "AI Gateway"
    - Direct access to LLMs via LiteLLM

2. **Agent Gateway Endpoint**
    - Name: "Agent Gateway - claims-analysis-agent"
    - Chat directly with the claims-analysis-agent
    - Paste conversation transcripts for analysis

**Getting Started:**

1. Open http://localhost:12040
2. Create an account (stored locally in MongoDB)
3. Select "Agent Gateway - claims-analysis-agent" from the endpoint dropdown
4. Paste a claims conversation transcript or use the example from `scripts/example-transcript.txt`
5. The agent will analyze the conversation and return structured claims data

### n8n Workflow Integration

n8n provides workflow automation capabilities for integrating agents into business processes.

**Access:** http://localhost:12041

**Configuration:**
There is no configuration-as-code for n8n in this showcase. Use the web interface to:
1. Create an account
2. Install the A2A protocol node from the n8n community nodes
   1. Open http://localhost:12041/settings/community-nodes
   2. Install the following community node: `@agentic-layer/n8n-nodes-a2a`
3. Import example workflows from the `n8n-workflows/` directory
   1. Open http://localhost:12041/workflow/new
   2. Click "Import from File" and select a workflow JSON file (see below)
4. Configure any necessary credentials (e.g., Agent Gateway URL, API keys)
   1. For Agent Gateway, use `http://agent-gateway.agent-gateway:10000/claims-analysis-agent`
   2. For AI Gateway (LiteLLM), use `http://ai-gateway.ai-gateway:4000`

**Example Workflows:**
Three example workflows are included in [n8n-workflows](n8n-workflows):

1. **Claims Analysis with AI Gateway**: Uses LiteLLM with MCP tool integration
2. **Claims Analysis with Agent Gateway / A2A**: Direct agent-to-agent communication
3. **Claims Analysis with Agent Gateway / OpenAI API**: OpenAI-compatible API integration

**Common Pattern:**
All workflows follow a webhook → agent analysis → data extraction pattern.

----

## Voice Agent Details

### Real-Time Voice Conversation

The **claims-voice-agent** provides specialized real-time voice interaction capabilities for insurance claims intake.

**Features:**

- Native German language conversation via Gemini Live API
- Structured interview protocol (customer verification, incident details, damage assessment)
- WebSocket-based bidirectional audio streaming
- Real-time transcription of user input

**Access:**

- **Custom Frontend**: http://localhost:12030
- **WebSocket Endpoint**: `ws://localhost:12010/ws/{user_id}?is_audio=true`

### Gemini Model Selection

The voice agent supports multiple Gemini Live API models:

**Non-Native Audio Models** (Fast, robotic voice):

- `gemini-2.0-flash-exp`
- `gemini-2.0-flash-live-001`

**Native Audio Models** (Natural voice, potentially higher latency):

- `gemini-2.5-flash-native-audio-latest` (currently configured)
- `gemini-2.5-flash-preview-native-audio-dialog`

To change models, edit `agents/claims-voice-agent/agent.py` and uncomment the desired model.

### Voice Agent Limitations

**Agent Gateway Integration:**
The voice agent is NOT exposed via Agent Gateway because:

- Gemini Live API requires direct WebSocket connection for real-time bidirectional audio streaming
- ADK with Gemini Live API doesn't support LiteLLM proxy integration

**Observability:**

- ADK with Gemini Live API doesn't support plugins/callbacks for detailed tracing
- Observability dashboard shows only WebSocket metadata, not conversation details
- Use application logs for debugging voice agent interactions

**Development:**
Use the custom WebSocket frontend at http://localhost:12030 to interact with the voice agent.

----

## Architecture Overview

### Agentic Layer Components

- **Agent Runtime** (`agent-runtime`): Core Kubernetes operator managing Agent, ToolServer, and AgenticWorkforce
  CRDs
- **AI Gateway** (`ai-gateway`): Unified LLM access via LiteLLM supporting multiple
  providers
- **Agent Gateway** (`agent-gateway`): OpenAI-compatible REST API for accessing
  agents
- **Observability**: LGTM stack (Loki, Grafana, Tempo, Mimir) with OpenTelemetry
  integration

For detailed architecture documentation, see [docs.agentic-layer.ai](https://docs.agentic-layer.ai/).

### Showcase Components

- **claims-analysis-agent**: Text-based agent using Google ADK, exposed via Agent Gateway
- **claims-voice-agent**: Voice agent using Google ADK + Gemini Live API, accessed via WebSocket
- **customer-database**: MCP server providing customer lookup tools
- **Frontend**: React + WebSocket client for voice agent interaction
- **LibreChat**: Chat UI with configured endpoints for agents and LLM access
- **n8n**: Workflow automation platform with example agent integration workflows

### Port Reference

| Service                 | Port  | Description                  |
|-------------------------|-------|------------------------------|
| Grafana                 | 12000 | Metrics and monitoring       |
| AI Gateway              | 12001 | LiteLLM unified LLM access   |
| Agent Gateway           | 12002 | OpenAI-compatible agent API  |
| Observability Dashboard | 12004 | Agent observability UI       |
| claims-voice-agent      | 12010 | WebSocket streaming endpoint |
| claims-analysis-agent   | 12011 | Direct A2A protocol access   |
| customer-database       | 12020 | MCP server HTTP endpoint     |
| Frontend (Voice)        | 12030 | React WebSocket client       |
| LibreChat               | 12040 | Chat UI for agents/LLMs      |
| n8n                     | 12041 | Workflow automation          |

----

## Helm Chart

This project provides a Helm chart for deploying the showcase to Kubernetes clusters.

### Installing from OCI Registry

The Helm chart is published to GitHub Container Registry for each release tag.
You need to install the Agentic Layer components first, see https://docs.agentic-layer.ai.

```shell
# Install the latest release
helm install showcase-insurance-claims \
  oci://ghcr.io/agentic-layer/charts/showcase-insurance-claims \
  --version 0.6.0 \
  --namespace showcase-insurance-claims \
  --create-namespace
```

## Development

### Code Quality Standards

**Per-component commands** (run in `agents/*/` or `mcp-servers/*/`):

```bash
# Install/sync dependencies
uv sync

# Type checking
uv run mypy .

# Linting
uv run ruff check

# Auto-fix linting issues
uv run ruff check --fix

# Run all checks
make check
```

**Frontend (React + TypeScript):**

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Linting
npm run lint

# Tests
npm run test
npm run test:ui       # With UI
npm run test:coverage # With coverage

# Build
npm run build         # Production
npm run build:dev     # Development
```

----

## Current Limitations

- **Claims Data Persistence**: Claims data is collected during conversations but not persisted to a database or
  forwarded to downstream systems
- **Voice Agent Integration**: Voice agent uses direct Gemini Live API connection and cannot use LiteLLM or be exposed
  via Agent Gateway due to real-time streaming requirements
- **Observability for Voice**: ADK with Gemini Live API doesn't support detailed tracing; only WebSocket metadata is
  captured
- **No Authentication**: Current setup has no authentication/authorization; suitable for development and demonstration
  only

For production deployments, consider implementing data persistence, authentication, and integration with existing claims
management systems.
