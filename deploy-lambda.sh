#!/bin/bash

# Setup
source ./config
mkdir -p dist

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