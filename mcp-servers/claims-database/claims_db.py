"""
MongoDB database for insurance claims with automatic rotation.
Stores only the essential information for the frontend.
"""
from pymongo import MongoClient, DESCENDING
import uuid
import logging
import sys
import os
from datetime import datetime
from typing import List, Dict

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Reduce noise from internal modules
logging.getLogger('docket').setLevel(logging.WARNING)
logging.getLogger('fakeredis').setLevel(logging.WARNING)
logging.getLogger('mcp').setLevel(logging.INFO)
logging.getLogger('pymongo').setLevel(logging.ERROR)
logging.getLogger('pymongo.serverSelection').setLevel(logging.ERROR)
logging.getLogger('pymongo.connection').setLevel(logging.ERROR)
logging.getLogger('pymongo.command').setLevel(logging.ERROR)
logging.getLogger('pymongo.topology').setLevel(logging.ERROR)

logger = logging.getLogger(__name__)

# MongoDB configuration from environment variables
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "claims")
MAX_CLAIMS = 10  # Keep only the last 10 claims

logger.info(f"Claims DB module loaded. MongoDB URL: {MONGODB_URL}, Database: {MONGODB_DATABASE}, MAX_CLAIMS: {MAX_CLAIMS}")

# Initialize MongoDB client with shorter timeouts for MCP server
try:
    mongo_client = MongoClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=5000,
        # Disable server monitoring to prevent background thread issues with STDIO
        serverMonitoringMode='poll'
    )
    db = mongo_client[MONGODB_DATABASE]
    claims_collection = db["claims"]
    logger.info("✓ MongoDB client initialized")
except Exception as e:
    logger.error(f"✗ Failed to initialize MongoDB client: {e}", exc_info=True)
    raise


def init_database():
    """Create indexes and check connection."""
    logger.info("=" * 80)
    logger.info("Initializing database...")
    logger.info(f"MongoDB URL: {MONGODB_URL}")
    logger.info(f"Database: {MONGODB_DATABASE}")

    try:
        # Test connection
        mongo_client.admin.command('ping')
        logger.info("✓ MongoDB connection successful")

        # Create indexes for better performance
        claims_collection.create_index("claim_id", unique=True)
        claims_collection.create_index([("created_at", DESCENDING)])
        logger.debug("✓ Indexes created/verified")

        # Check current claim count
        count = claims_collection.count_documents({})
        logger.info(f"✓ Database initialized successfully. Current claims count: {count}")

    except Exception as e:
        logger.error(f"✗ Failed to initialize database: {e}", exc_info=True)
        raise


def rotate_claims():
    """Delete old claims, keep only the last MAX_CLAIMS."""
    logger.debug(f"Rotating claims (keeping last {MAX_CLAIMS})...")
    try:
        # Count total claims
        total = claims_collection.count_documents({})

        if total <= MAX_CLAIMS:
            logger.debug(f"No rotation needed ({total} <= {MAX_CLAIMS})")
            return

        # Find the cutoff date - get the MAX_CLAIMS-th newest claim's created_at
        skip_count = MAX_CLAIMS - 1
        cutoff_claim = claims_collection.find_one(
            {},
            sort=[("created_at", DESCENDING)],
            skip=skip_count
        )

        if cutoff_claim and "created_at" in cutoff_claim:
            cutoff_date = cutoff_claim["created_at"]

            # Delete all claims older than the cutoff
            result = claims_collection.delete_many({
                "created_at": {"$lt": cutoff_date}
            })

            deleted = result.deleted_count
            if deleted > 0:
                logger.info(f"Rotated: Deleted {deleted} old claims")
        else:
            logger.warning("Could not determine cutoff date for rotation")

    except Exception as e:
        logger.error(f"Error during rotation: {e}", exc_info=True)


def insert_claim(claim_data: Dict) -> Dict:
    """
    Insert new claim and rotate old ones.

    Args:
        claim_data: Dictionary with all claim fields

    Returns:
        Dictionary with saved claim including ID
    """
    claim_id = str(uuid.uuid4())
    logger.info(f"Inserting new claim with ID: {claim_id}")
    logger.debug(f"Claim data: {claim_data}")

    try:
        # Prepare document - nur die wesentlichen Felder
        document = {
            "claim_id": claim_id,
            "customer_name": claim_data.get("customer_name"),
            "license_plate": claim_data.get("license_plate"),
            "driver_name": claim_data.get("driver_name"),
            "incident_date": claim_data.get("incident_date"),  # Datum
            "incident_time": claim_data.get("incident_time"),  # Uhrzeit
            "location": claim_data.get("location"),
            "description": claim_data.get("description"),  # Unfallhergang
            "damage_description": claim_data.get("damage_description"),  # Schadensbeschreibung
            "injury_count": claim_data.get("injury_count", 0),  # Anzahl Personenschäden
            "status": claim_data.get("status", "submitted"),  # Status des Claims (default: submitted)
            "created_at": datetime.utcnow(),
        }

        # Insert into MongoDB
        result = claims_collection.insert_one(document)
        logger.info(f"✓ Claim inserted with MongoDB _id: {result.inserted_id}")

        # Rotate old claims
        rotate_claims()

        # Return the claim with its ID
        document["_id"] = str(result.inserted_id)
        logger.debug(f"Returning claim: {document}")
        return document

    except Exception as e:
        logger.error(f"✗ Failed to insert claim: {e}", exc_info=True)
        raise


# Initialize database on module load
init_database()
