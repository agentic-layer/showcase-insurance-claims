# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an insurance claims processing showcase demonstrating the [Agentic Layer](https://docs.agentic-layer.ai/) platform. It includes multi-agent workflows, Model Context Protocol (MCP) integration, and multiple frontend options (LibreChat, n8n, custom React UI).

**Key Technologies:**
- **Python 3.13+** with `uv` package manager for agents and MCP servers
- **Node.js 22+** with Vite for React frontend
- **Tilt** + **Docker Desktop (Kubernetes)** for orchestrating local development environment
- **Google ADK** (Agent Development Kit) for building agents
- **Model Context Protocol (MCP)** for extending agent capabilities with tool servers

## Common Development Commands

### Starting the Environment

```bash
# Start all services (agents, gateways, frontends, monitoring)
tilt up

# Stop all services
tilt down
```

**Important Service URLs:**
- LibreChat: http://localhost:12040
- n8n: http://localhost:12041
- Agent Gateway: http://localhost:12002
- AI Gateway (LiteLLM): http://localhost:12001
- Voice Agent Frontend: http://localhost:12030
- Grafana: http://localhost:12000

### Testing

```bash
# Test claims-analysis-agent via Agent Gateway (both OpenAI API and A2A protocol)
./scripts/test-claims-agent.sh

# Test specific protocol only
./scripts/test-claims-agent.sh openai
./scripts/test-claims-agent.sh a2a
```

### Python Components (agents/* and mcp-servers/*)

Run these commands within each Python component directory:

```bash
# Install/sync dependencies
uv sync

# Type checking
uv run mypy .

# Linting
uv run ruff check

# Auto-fix linting issues
uv run ruff check --fix

# Run all checks (sync + ruff + mypy)
make check
```

### Frontend (React + TypeScript)

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
npm run test:ui          # With UI
npm run test:coverage    # With coverage

# Build
npm run build            # Production
npm run build:dev        # Development
```

## Architecture

### Agent Types

**1. claims-analysis-agent** (Template-based Agent)
- Defined purely as Kubernetes CRD in `deploy/base/claims-analysis-agent.yaml`
- Uses pre-built ADK image: `ghcr.io/agentic-layer/agent-template-adk`
- Text-based agent for analyzing insurance claim transcripts
- Exposed via Agent Gateway (OpenAI API + A2A protocol)
- Connected to customer-database MCP server for lookups
- No custom Python code - all logic is in the `instruction` field

**2. claims-voice-agent** (Custom Agent)
- Custom Python implementation in `agents/claims-voice-agent/`
- Real-time voice conversation using Gemini Live API
- WebSocket-based streaming (not exposed via Agent Gateway)
- Conducts structured interviews in German

**Key Difference**: claims-analysis-agent uses a generic ADK image with configuration-based instructions, while claims-voice-agent has custom Python code for handling WebSocket connections and real-time audio streaming.

### MCP Server

**customer-database** (`mcp-servers/customer-database/`)
- Provides customer lookup tools via Model Context Protocol
- Exposes mock customer data for demonstration
- Used by agents to retrieve customer_id and policy_id

### Agentic Layer Platform Components

The showcase integrates with Agentic Layer platform components:
- **Agent Runtime**: Kubernetes operator managing Agent, ToolServer, and AgenticWorkforce CRDs
- **AI Gateway (LiteLLM)**: Unified LLM access supporting multiple providers
- **Agent Gateway**: OpenAI-compatible REST API and A2A protocol for agents
- **Observability**: LGTM stack (Loki, Grafana, Tempo, Mimir) with OpenTelemetry

### Deployment Structure

- `deploy/base/`: Kubernetes CRDs for agents, MCP servers, and workforce
  - Agent definitions (YAML only for claims-analysis-agent)
  - ToolServer definitions for MCP servers
  - AgenticWorkforce definition
- `deploy/local/`: Local development overlays and configurations
  - LibreChat configuration
  - n8n setup
  - Observability dashboard
  - Agentic Layer component configurations
- `Tiltfile`: Orchestrates all services, Docker builds, and port forwarding

### AgenticWorkforce CRD

The `insurance-claims-workforce` (`deploy/base/insurance-claims-workforce.yaml`) groups agents together as a logical workforce with `claims-analysis-agent` as the entry point.

## Important Development Notes

### Modifying Agents

**For claims-analysis-agent:**
- Edit the CRD in `deploy/base/claims-analysis-agent.yaml`
- Modify the `instruction` field to change agent behavior
- Change the `model` field to use different LLMs (via AI Gateway)
- Update `tools` section to add/remove MCP server connections
- Tilt will automatically detect changes and redeploy

**For claims-voice-agent:**
- Edit Python code in `agents/claims-voice-agent/`
- Main entry point: `main.py`
- Agent logic: `agent.py`
- Run `make check` before committing
- Tilt rebuilds Docker image and redeploys on file changes

### Modifying MCP Servers

- Edit Python code in `mcp-servers/customer-database/`
- Main entry point: `main.py`
- Mock data: `mock_database.py`
- Run `make check` before committing
- Update ToolServer CRD in `deploy/base/customer-database.yaml` if changing exposed tools

### Pre-commit Hooks

The repository uses pre-commit hooks (`.pre-commit-config.yaml`):
- YAML validation
- Python AST validation
- JSON/TOML validation
- Private key detection
- File formatting (trailing whitespace, end-of-file fixer)

### GitHub Actions

**check.yml**: Runs on PRs and pushes to main/renovate branches
- Validates Python components with `make check`
- Does not build/push Docker images

**test-e2e.yml**: End-to-end testing
- Creates Kind cluster
- Runs `tilt ci` to deploy full stack
- Executes `./scripts/test-claims-agent.sh` for integration testing

## Environment Variables

Required in `.env` file:
- `GOOGLE_API_KEY`: Google Gemini API key (required)
- `OPENAI_API_KEY`: OpenAI API key (optional, for testing other models)

These are loaded by Tilt and injected as Kubernetes secrets.

## Limitations & Gotchas

- **No Tests**: There are no unit tests for Python components; only linting and type checking via `make check`
- **Voice Agent Isolation**: claims-voice-agent cannot use Agent Gateway due to WebSocket streaming requirements
- **Template Agent Pattern**: claims-analysis-agent uses a pre-built image; changes require only YAML edits
- **Local Development Only**: Current setup assumes Docker Desktop with Kubernetes enabled and Tilt for orchestration
- **No Authentication**: Services have no authentication; suitable for development/demo only
