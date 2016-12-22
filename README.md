# google-action-tiger

A Google Assistant Action (with an invocation name of "tiger") which controls a Honeywell VISTA-20P alarm panel and opens/closes garage doors

## Initial Setup

### Dependencies

1. [Amazon Web Services](https://aws.amazon.com) account
2. Google account
3. Download and install [gactions CLI](https://developers.google.com/actions/tools/gactions-cli)
4. Download and install [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
5. zip (`brew install zip`)
6. A working and Internet accessible installation of [vistaicm-server](https://github.com/bradyholt/vistaicm-server)

### Lambda function

Follow these steps on the AWS Management Console to create an AWS Lambda function and corresponding API Gateway endpoint to handle requests for this Action from the Google Assistant service.

1. Go to the [Lambda AWS Management Console](https://console.aws.amazon.com/lambda/)
2. Create Lambda function
3. Choose "Blank Function" blueprint
4. On "Configure Triggers" step:
   1. Select "API Gateway"
   2. Use "google-action-tiger" as name
   3. Select "Open" for security
5. On "Configure function" step
   - Name: "google-action-tiger"
   - Runtime: Node.js 4.3
   - Handler: index.Handler
   - Role: Choose an existing Role
   - Existing role: lambda_basic_execution
7. Proceed to review and then click "Create function"
8. On the "Triggers" tab, note the API Gateway URL which will looks like this: https://0000ABC123.execute-api.us-east-1.amazonaws.com/prod/google-action-tiger

Although I would like to script the intial creation of the AWS Lambda function and corresponding API Gateway trigger, doing so through the AWS CLI is non-trival.  There is a [guide here](https://ig.nore.me/2016/03/setting-up-lambda-and-a-gateway-through-the-cli/) which walks through the process and would be a good reference for future enhancement.

### Config

Rename the `config.example` file to `config` and update the config values

- INVOCATION_NAME - The word used to initiate a conversation with the Google Action
- HTTP_EXECUTION_URL - The AWS API Gateway URL that points to the AWS Lambda function
- LAMBDA_FUNCTION_NAME - Name of the AWS Lambda function
- VISTA_ICM_ADDRESS - The URL for the vistaicm-server server
- VISTA_ICM_COMMAND_ARM - The vistaicm-server command to arm the alarm
- VISTA_ICM_COMMAND_DISARM - The vistaicm-server command to disarm the alarm (this is the security code)
- VISTA_ICM_COMMAND_PANIC - The vistaicm-server command to initiate the panic status
- VISTA_ICM_COMMAND_LEFT_GARAGE - The vistaicm-server command to trigger the left garage door to open/close
- VISTA_ICM_COMMAND_RIGHT_GARAGE - The vistaicm-server command to trigger the left garage door to open/close

## Deploy

This action is for private use only and is not published to the public Google Actions directory.  To use it on a single Google account, run the following command.

`./deploy.sh`

## api.ai

This action was originally created as an api.ai Agent and exported.  The primary reason for this was because the Google Actions integration in api.ai only sets up the Action preview for 30 minutes and there is no way to control the `preview_mins` option sent to the Google Assistant API.

Although not required, the Agent can be imported back into api.ai to allow for easy updates to the action.json file.

### Import

To import this action into api.ai for easier management you can do the following:

1. Login to api.ai
2. Create a new Agent called "tiger"
3. Go to "Export and Import"
4. Choose "Restore"
5. Specify agent-api.ai.zip
7. Go to Domains and turn off "Small Talk"

### Export and update action.json

After changes have been made in api.ai you can export the action by doing the following:

1. Go to Integrations
2. Turn on "Actions on Google" integration
3. Enter "tiger" for invocation name
4. Click Authorize
5. Open dev console (Network tab) and then click "Preview"
6. Copy the response from the XHR request to https://console.api.ai/api/agent/googleassistant/preview
7. Replace contents of action.json in this repo
