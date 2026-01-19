# Insurance Claims API

FastAPI backend that provides read-only REST API access to the MongoDB claims database.

## Features

- **GET /api/claims** - List all claims (with optional limit parameter)
- **GET /health** - Health check endpoint with database connection status
- CORS enabled for frontend access
- Connects to shared MongoDB instance
- Auto-refreshing data (frontend polls every 5 seconds)

## Architecture

This backend:
- Provides read-only access to claims stored in MongoDB
- Used by the React frontend to display submitted claims
- Shares MongoDB instance with `claims-database` MCP server (separate connections)
- No write operations (claims are written via MCP server by agents)

## API Endpoints

### GET /api/claims

List all claims, sorted by creation date (newest first).

**Query Parameters:**
- `limit` (optional, default: 10) - Maximum number of claims to return

**Response:**
```json
{
  "success": true,
  "count": 5,
  "claims": [
    {
      "_id": "mongodb-object-id",
      "claim_id": "uuid-v4-string",
      "customer_name": "Max Mustermann",
      "license_plate": "M AB 1234",
      "driver_name": "Max Mustermann",
      "incident_date": "2025-12-18",
      "incident_time": "14:30",
      "location": "A9, München",
      "description": "Rear-end collision on A9",
      "damage_description": "Front bumper damaged",
      "injury_count": 0,
      "status": "submitted",
      "created_at": "2025-12-18T14:30:00.000Z"
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "database_type": "MongoDB",
  "claims_count": 5
}
```

## Installation

### Prerequisites
- Python 3.13+
- MongoDB running (local or remote)

### Install Dependencies

```bash
# Using pip
pip install fastapi uvicorn pymongo python-dotenv

# Or using uv
uv pip install fastapi uvicorn pymongo python-dotenv
```

## Running Locally

```bash
# Set environment variables
export MONGODB_URL="mongodb://localhost:27017"
export MONGODB_DATABASE="claims"

# Run with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Or run directly
python main.py
```

The API will be available at:
- **API**: http://localhost:8000

## Running with Docker

```bash
# Build image
docker build -t claims-api:latest .

# Run container
docker run -p 8000:8000 \
  -e MONGODB_URL="mongodb://host.docker.internal:27017" \
  -e MONGODB_DATABASE="claims" \
  claims-api:latest
```

## Environment Variables

| Variable           | Description               | Default                     |
|--------------------|---------------------------|-----------------------------|
| `MONGODB_URL`      | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DATABASE` | Database name             | `claims`                    |

## Example Usage

```bash
# Get all claims
curl http://localhost:8000/api/claims

# Health check
curl http://localhost:8000/health
```

## Notes

- **Read-Only**: This API only provides read access. Claims are created by agents via the MCP server.
- **No Authentication**: Currently no authentication. Add authentication middleware for production use.
- **Auto-refresh**: The frontend polls this API every 5 seconds for real-time updates.
- **Shared Database**: Reads from the same MongoDB instance where the MCP server writes claims.