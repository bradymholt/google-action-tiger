#!/bin/bash

# Setup
source ./config
mkdir -p dist

./deploy-google-assistant.sh
./deploy-lambda.sh

echo "Deploy successful!"