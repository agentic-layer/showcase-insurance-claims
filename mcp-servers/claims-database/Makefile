.PHONY: help install run test clean

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make run      - Run the MCP server locally"
	@echo "  make test     - Run tests"
	@echo "  make clean    - Clean up generated files"

install:
	uv sync

run:
	uv run python main.py

test:
	@echo "No tests configured yet"

clean:
	rm -rf __pycache__ .pytest_cache .coverage htmlcov
	rm -rf *.egg-info
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

