# Claims Database MCP Server

FastMCP server providing persistent storage for insurance claims using MongoDB.

## Features

- **Persistent Storage**: MongoDB database with automatic rotation
- **Automatic Rotation**: Keeps only the last 10 claims (configurable via MAX_CLAIMS)
- **MCP Tool**: For agent integration
  - `submit_claim()` - Save a new claim with automatic rotation

## Architecture

This MCP server:
- Connects to MongoDB for persistent claim storage
- Automatically rotates old claims (keeps last 10)
- Provides MCP tools for agent integration (not REST API)
- Used by `claims-analysis-agent` to persist extracted claim data

## Usage

### For Agents (MCP Tool)

The `submit_claim` tool accepts the following parameters:

```python
# Submit a new claim after analysis
submit_claim(
    customer_name="Max Mustermann",
    license_plate="M AB 1234",
    driver_name="Max Mustermann",
    incident_date="2025-12-18",
    incident_time="14:30",
    location="A9, München",
    description="Rear-end collision on A9 near Munich",
    damage_description="Front bumper damaged, headlight broken",
    injury_count=0,
    status="submitted"
)
```

### Response

```python
{
    "success": True,
    "claim_id": "abc-123-def-456",
    "message": "Schadensmeldung erfolgreich gespeichert mit ID: abc-123-def-456"
}
```

## Database

### Technology
- **MongoDB 7.0** with persistent volume
- **Collection**: `claims` in database `claims`
- **Automatic Rotation**: Deletes oldest claims when count exceeds MAX_CLAIMS (10)

### Document Schema

```javascript
{
  claim_id: "uuid-v4-string",
  customer_name: "string",
  license_plate: "string",
  driver_name: "string",
  incident_date: "YYYY-MM-DD",
  incident_time: "HH:MM",
  location: "string",
  description: "string",
  damage_description: "string",
  injury_count: 0,
  status: "submitted",
  created_at: ISODate("...")
}
```

### Indexes
- `claim_id` (unique)
- `created_at` (descending, for efficient rotation queries)

## Development

### Prerequisites
- Python 3.13+
- uv package manager
- MongoDB running (local or remote)

### Installation

```bash
# Install dependencies
uv sync
```

### Running Locally

```bash
# Set environment variables
export MONGODB_URL="mongodb://localhost:27017"
export MONGODB_DATABASE="claims"
export LOGLEVEL="INFO"

# Run the MCP server
uv run python main.py

# Server runs on http://localhost:8000 (MCP over HTTP)
```

### Environment Variables

| Variable           | Description                          | Default                     |
|--------------------|--------------------------------------|-----------------------------|
| `MONGODB_URL`      | MongoDB connection string            | `mongodb://localhost:27017` |
| `MONGODB_DATABASE` | Database name                        | `claims`                    |
| `LOGLEVEL`         | Logging level (DEBUG, INFO, WARNING) | `INFO`                      |

## Testing

The MCP server can be tested using MCP client tools or by connecting an agent that uses the `submit_claim` tool.

## Notes

- This MCP server does NOT provide REST API endpoints for claims retrieval
- For frontend access, use the separate `claims-api` backend service
- Claims are automatically rotated (oldest deleted when count > MAX_CLAIMS)
- The server uses FastMCP's streamable HTTP transport for MCP protocol