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

# Deploy the AWS Lambda function code
cd lambda-function
echo "Installing Lambda function dependencies..."
npm install
echo "Zipping up Lambda function assets..."
zip -r lambda.zip . -x lambda.zip
rm -f ../dist/lambda.zip
mv lambda.zip ../dist/
echo "Deploying AWS Lambda function..."
aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --zip-file fileb://../dist/lambda.zip

# Update environment variables on the AWS Lambda function
echo "Updating environment variables for the Lambda function..."
aws lambda update-function-configuration --function-name $LAMBDA_FUNCTION_NAME --environment "Variables={\
    VISTA_ICM_ADDRESS=$VISTA_ICM_ADDRESS,\
    VISTA_ICM_COMMAND_ARM=$VISTA_ICM_COMMAND_ARM,\
    VISTA_ICM_COMMAND_DISARM=$VISTA_ICM_COMMAND_DISARM,\
    VISTA_ICM_COMMAND_PANIC=$VISTA_ICM_COMMAND_PANIC,\
    VISTA_ICM_COMMAND_LEFT_GARAGE=$VISTA_ICM_COMMAND_LEFT_GARAGE,\
    VISTA_ICM_COMMAND_RIGHT_GARAGE=$VISTA_ICM_COMMAND_RIGHT_GARAGE}"

echo "Deploy successful!"