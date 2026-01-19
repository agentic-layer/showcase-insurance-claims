.PHONY: install run dev clean docker-build docker-run

install:
	uv pip install -e .

run:
	uvicorn main:app --host 0.0.0.0 --port 8000

dev:
	uvicorn main:app --host 0.0.0.0 --port 8000 --reload

clean:
	rm -rf __pycache__ .pytest_cache .mypy_cache

docker-build:
	docker build -t claims-api:latest .

docker-run:
	docker run -p 8000:8000 -v /data:/data claims-api:latest

