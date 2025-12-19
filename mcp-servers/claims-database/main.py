#!/usr/bin/env python3
"""
Claims Database MCP Server

FastMCP server providing persistent storage for insurance claims.
Stores the last 10 claims in MongoDB with automatic rotation.
"""

import logging
import sys
from typing import Dict, Any
from fastmcp import FastMCP

from claims_db import (
    insert_claim,
)

# Configure verbose logging for our code only
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Reduce noise from FastMCP internal modules
logging.getLogger('docket').setLevel(logging.WARNING)
logging.getLogger('fakeredis').setLevel(logging.WARNING)
logging.getLogger('mcp').setLevel(logging.INFO)
logging.getLogger('asyncio').setLevel(logging.WARNING)
logging.getLogger('uvicorn').setLevel(logging.INFO)
logging.getLogger('uvicorn.access').setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

# Create the FastMCP server instance
logger.info("=" * 80)
logger.info("Creating FastMCP server instance")
mcp = FastMCP("Claims Database")


@mcp.tool()
def submit_claim(
    customer_name: str,
    license_plate: str,
    driver_name: str,
    incident_date: str,
    incident_time: str,
    location: str,
    description: str,
    damage_description: str,
    injury_count: int = 0,
    status: str = "submitted"
) -> Dict[str, Any]:
    """
    Submit a new insurance claim to the database.

    This tool persists the claim data and automatically manages rotation
    (keeps only the last 10 claims).

    Args:
        customer_name: Full name of the customer
        license_plate: license plate of the car (i.e. "M AB 1234")
        driver_name: name of the driver at the time of the incident
        incident_date: date of the incident (format: YYYY-MM-DD, i.e. "2025-12-18")
        incident_time: time of the incident (format: HH:MM, i.e. "14:30")
        location: location of the incident (i.e. "Hauptstraße 123, München")
        description: detailed description of the incident
        damage_description: description of the damages to the vehicle
        injury_count: number of injuries reported (default: 0)
        status: status of the claim (default: "submitted")

    Returns:
        Dictionary with claim_id and confirmation message
    """
    logger.info(f"Submitting claim for customer: {customer_name}")

    claim_data = {
        "customer_name": customer_name,
        "license_plate": license_plate,
        "driver_name": driver_name,
        "incident_date": incident_date,
        "incident_time": incident_time,
        "location": location,
        "description": description,
        "damage_description": damage_description,
        "injury_count": injury_count,
        "status": status,
    }

    try:
        result = insert_claim(claim_data)
        claim_id = result.get("claim_id")

        logger.info(f"✓ Claim successfully saved with ID: {claim_id}")

        return {
            "success": True,
            "claim_id": claim_id,
            "message": f"Schadensmeldung erfolgreich gespeichert mit ID: {claim_id}"
        }

    except Exception as e:
        logger.error(f"✗ Failed to save claim: {e}", exc_info=True)
        return {
            "success": False,
            "error": str(e),
            "message": "Fehler beim Speichern der Schadensmeldung"
        }


# Entry point for running the MCP server
if __name__ == "__main__":
    logger.info("Starting Claims Database MCP Server...")
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8000)
