.PHONY: all
all: check

.PHONY: sync
sync:
	uv sync

.PHONY: check
check: sync
	uv run ruff check
	uv run mypy .
