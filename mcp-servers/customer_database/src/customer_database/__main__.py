#!/usr/bin/env python3
"""
Claims Tools MCP Server

FastMCP server providing customer data and utility tools for insurance claims processing.
"""

import logging

from fastmcp import FastMCP

from . import mock_database

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create the FastMCP server instance
mcp = FastMCP("Claims Tools")


@mcp.tool()
def get_user_data(name: str) -> dict:
    """
    Retrieve customer data by name for insurance claims processing.

    This tool looks up customer information from the insurance database
    using the customer's name. It returns personal details, contact information,
    and policy information needed for claims verification.

    Args:
        name: The full name of the customer to look up (case insensitive)

    Returns:
        Dictionary containing customer information if found, or error if not found.

        Success response structure:
        {
            "status": "success",
            "customer": {
                "first_name": str,
                "last_name": str,
                "birth_date": str (YYYY-MM-DD format),
                "customer_id": str,
                "phone": str,
                "email": str,
                "address": dict,
                "policies": list
            }
        }

        Error response structure:
        {
            "status": "not_found",
            "message": str
        }
    """
    logging.info(f"Retrieving user data for: {name}")
    return mock_database.find_customer_by_name(name)


def main():
    """Main entry point for the Claims Tools MCP server."""
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8001)


if __name__ == "__main__":
    main()
