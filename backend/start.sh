#!/bin/bash
set -e

echo "Installing emergentintegrations..."
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/

echo "Starting FastAPI server..."
uvicorn server:app --host 0.0.0.0 --port $PORT
