FROM python:3.13-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Accept MCP_SERVER_NAME as build arg (required)
ARG MCP_SERVER_NAME
RUN test -n "$MCP_SERVER_NAME" || (echo "MCP_SERVER_NAME build arg is required" && false)
ENV MCP_SERVER_NAME_ENV=${MCP_SERVER_NAME}

COPY uv.lock pyproject.toml ./

# Install dependencies in a separate layer for better caching
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=mcp-servers/${MCP_SERVER_NAME}/pyproject.toml,target=mcp-servers/${MCP_SERVER_NAME}/pyproject.toml \
    uv sync --frozen --package ${MCP_SERVER_NAME} --no-install-project --link-mode=copy

# Copy source code after dependency installation
COPY mcp-servers/${MCP_SERVER_NAME_ENV} ./mcp-servers/${MCP_SERVER_NAME_ENV}

# Install the project in a final layer
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --package ${MCP_SERVER_NAME_ENV} --link-mode=copy

# Expose port
EXPOSE 8000

# Run the specified mcp server (using shell form for env var expansion)
CMD uv run --package ${MCP_SERVER_NAME_ENV} ${MCP_SERVER_NAME_ENV}