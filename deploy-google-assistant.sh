#!/bin/bash

# Setup
source ./config
mkdir -p dist

# Create dist/action.json with httpExecution.url set from config
echo "Setting httpExecution.url and generating action.json..."
rm -f dist/action.json
node -e "var action = require('./action.json'); for(var a of action.actions) { a.httpExecution.url = '$HTTP_EXECUTION_URL'; } require('fs').writeFileSync('./dist/action.json', JSON.stringify(action));"

# Deploy the Google Assistant Action
echo "Deploying action package to Google Assistant..."
gactions preview --action_package dist/action.json --invocation_name $INVOCATION_NAME --preview_mins 999999