#!/bin/bash
# Script to launch the ADK built-in Web UI for testing

# Load environment variables if .env exists
if [ -f base/.env ]; then
  export $(cat base/.env | grep -v '#' | xargs)
fi

echo "--- Launching ADK Web UI ---"
echo "Ensure you have authenticated with Google Cloud (gcloud auth application-default login)"
echo "Opening UI at http://localhost:8000"

# Navigate to the base directory and run the ADK web command
cd base && npx adk web agents
