FROM python:3.13-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml ./

# Install dependencies
RUN uv sync --frozen --no-dev || uv pip install --system fastmcp

# Copy application code
COPY . .

# Create data directory for SQLite with proper permissions
RUN mkdir -p /data && chmod 777 /data

# Expose MCP server port
EXPOSE 8000

# Run the MCP server
CMD ["uv", "run", "python", "main.py"]

