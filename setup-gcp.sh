#!/bin/bash
# Helper script to set up Google Cloud credentials for the workshop

PROJECT_ID=$1

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Please provide your Google Cloud Project ID."
  echo "Usage: ./setup-gcp.sh <your-gcp-project-id>"
  exit 1
fi

echo "1. Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "2. Enabling required APIs (Vertex AI)..."
gcloud services enable aiplatform.googleapis.com

echo "3. Authenticating for Vertex AI (Application Default Credentials)..."
echo "A browser window will open. Please log in with your Google Cloud account."
gcloud auth application-default login

echo ""
echo "=========================================================="
echo "Setup Complete! Creating base/.env file..."
echo "=========================================================="

cat <<EOF > base/.env
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=$PROJECT_ID
GOOGLE_CLOUD_LOCATION=global
PORT=3001
EOF

echo "Successfully created base/.env with your configuration."
echo "=========================================================="
echo ""
echo "Note: Vertex AI will use your Application Default Credentials."
