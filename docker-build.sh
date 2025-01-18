#!/bin/bash

# Set project ID and repository name
PROJECT_ID="telkomsel-retail-intelligence"
REPOSITORY_NAME="devoteam" 


# Set the image name
IMAGE_NAME=$1

# Check if an image name was provided
if [ -z "$IMAGE_NAME" ]; then
  echo "Error: Please provide an image name as an argument."
  echo "Usage: $0 <image_name>"
  exit 1
fi

#Set the dockerfile name
DOCKER_FILE="${IMAGE_NAME}-dockerfile"

# Set the region for your Artifact Registry repository
REGION="asia-southeast2"  # Example: Change to your actual region

# Build the Docker image
docker build -t $IMAGE_NAME -f $DOCKER_FILE .

# Tag the image with the full Artifact Registry path
docker tag $IMAGE_NAME \
  ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:latest

# Push the image to Artifact Registry
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:latest