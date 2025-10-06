FROM python:3.13-slim

WORKDIR /app

# Install build dependencies and uv
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Accept AGENT_NAME as build arg (required)
ARG AGENT_NAME
RUN test -n "$AGENT_NAME" || (echo "AGENT_NAME build arg is required" && false)
ENV AGENT_NAME=${AGENT_NAME}

COPY agents/base ./agents/base
COPY uv.lock pyproject.toml ./

# Install dependencies in a separate layer for better caching
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=agents/${AGENT_NAME}/pyproject.toml,target=agents/${AGENT_NAME}/pyproject.toml \
    uv sync --frozen --package ${AGENT_NAME} --no-install-project --link-mode=copy

# Copy source code after dependency installation
COPY agents/${AGENT_NAME} ./agents/${AGENT_NAME}

# Install the project in a final layer
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --package ${AGENT_NAME} --link-mode=copy

# Expose port
EXPOSE 8000

# Run the specified agent
CMD uv run --package ${AGENT_NAME} ${AGENT_NAME}