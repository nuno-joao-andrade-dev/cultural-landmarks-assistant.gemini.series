#!/bin/bash
# Local execution script

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

echo "Building React app..."
npm run build

echo "Starting server on port 3001..."
export NODE_ENV=production
npm run server
