#!/bin/bash
# Cultural Landmarks Cloud Run Deployment Script

# Variables
SERVICE_NAME="gcp-chatbot-workshop"
REGION="global"

# Check if project ID is set
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "Please set your Google Cloud project using 'gcloud config set project [PROJECT_ID]'"
    exit 1
fi

echo "Deploying to Cloud Run in project: $PROJECT_ID..."

# Build and push using Cloud Build
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=true,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION,NODE_ENV=production"
