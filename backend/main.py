#!/usr/bin/env python3
"""
FastAPI Backend for Insurance Claims
Provides REST API access to the MongoDB claims database.
"""

from pymongo import MongoClient
import logging
import sys
from typing import Dict
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import time
import os

# Configure verbose logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

logger.info("=" * 80)
logger.info("CLAIMS API BACKEND STARTING UP")
logger.info("=" * 80)

# MongoDB configuration from environment variables
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "claims")

logger.info(f"MongoDB URL: {MONGODB_URL}")
logger.info(f"MongoDB Database: {MONGODB_DATABASE}")

# Initialize MongoDB client
try:
    mongo_client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    db = mongo_client[MONGODB_DATABASE]
    claims_collection = db["claims"]
    logger.info("✓ MongoDB client initialized")
except Exception as e:
    logger.error(f"✗ Failed to initialize MongoDB client: {e}", exc_info=True)
    raise

# Initialize FastAPI app
app = FastAPI(
    title="Insurance Claims API",
    description="REST API for managing insurance claims",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("=" * 80)
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    logger.debug(f"Query params: {dict(request.query_params)}")

    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    logger.info(f"Response: {response.status_code} (took {duration:.3f}s)")
    return response


def serialize_claim(claim: Dict) -> Dict:
    """Convert MongoDB document to JSON-serializable dict."""
    if claim:
        # Convert ObjectId to string
        if "_id" in claim:
            claim["_id"] = str(claim["_id"])
        # Ensure dates are ISO format strings
        if "created_at" in claim and isinstance(claim["created_at"], datetime):
            claim["created_at"] = claim["created_at"].isoformat()
    return claim


@app.on_event("startup")
async def startup_event():
    """Check database connection on startup."""
    logger.info("=" * 80)
    logger.info("FastAPI application starting up...")
    try:
        # Test MongoDB connection
        mongo_client.admin.command('ping')
        logger.info("✓ MongoDB connection successful")

        # Count existing claims
        count = claims_collection.count_documents({})
        logger.info(f"✓ Current claims count: {count}")

        # Log some sample claim IDs if available
        sample_claims = list(claims_collection.find({}, {"claim_id": 1}).sort("created_at", -1).limit(5))
        claim_ids = [claim.get("claim_id") for claim in sample_claims if "claim_id" in claim]
        if claim_ids:
            logger.info(f"Recent claim IDs: {claim_ids}")
        else:
            logger.info("No claims in database yet")

        # Create indexes for better performance
        claims_collection.create_index("claim_id", unique=True)
        claims_collection.create_index("created_at")
        logger.info("✓ Indexes created/verified")

    except Exception as e:
        logger.error(f"✗ Startup database check failed: {e}", exc_info=True)
    logger.info("=" * 80)


@app.get("/health")
async def health():
    """Health check endpoint."""
    logger.debug("Health check called")
    try:
        # Ping MongoDB
        mongo_client.admin.command('ping')
        count = claims_collection.count_documents({})

        logger.debug(f"Health check successful - {count} claims in database")
        return {
            "status": "healthy",
            "database": "connected",
            "database_type": "MongoDB",
            "claims_count": count
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        raise HTTPException(status_code=503, detail="Database unavailable")


@app.get("/api/claims")
async def get_claims(limit: int = 10):
    """
    Get all claims, sorted by creation date (newest first).

    Args:
        limit: Maximum number of claims to return (default: 10)

    Returns:
        JSON response with success flag, count, and list of claims
    """
    logger.info(f"GET /api/claims called with limit={limit}")

    try:
        logger.debug("Executing MongoDB query...")
        claims_cursor = claims_collection.find({}).sort("created_at", -1).limit(limit)
        claims = [serialize_claim(claim) for claim in claims_cursor]

        logger.debug(f"Query returned {len(claims)} documents")
        for claim in claims:
            logger.debug(f"Claim: {claim.get('claim_id')} - {claim.get('customer_name')}")

        logger.info(f"✓ Successfully retrieved {len(claims)} claims")

        return {
            "success": True,
            "count": len(claims),
            "claims": claims
        }
    except Exception as e:
        logger.error(f"✗ Error fetching claims: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch claims: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting uvicorn server on 0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
