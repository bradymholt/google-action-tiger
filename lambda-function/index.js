"use strict";
var http = require('http');
var AssistantRequest = require('assistantRequest');
var AssistantResponse = require('assistantResponse');

exports.handler = function (event, context, callback) {
    process.env.DEBUG = 'actions-on-google:*';

    const vistaIcmAddress = process.env.VISTA_ICM_ADDRESS;
    const vistaIcmCommandArm = process.env.VISTA_ICM_COMMAND_ARM;
    const vistaIcmCommandDisarm = process.env.VISTA_ICM_COMMAND_DISARM;
    const vistaIcmCommandPanic = process.env.VISTA_ICM_COMMAND_PANIC;

    var assistantRequest = new AssistantRequest(event);
    var assistantResponse = new AssistantResponse();

    function handleAssistantRequest(assistant) {

        var status = assistant.getArgument("status");
        var commandUrl = vistaIcmAddress + "/execute?command=";
        var tellSpeech = null;

        if (status == "arm") {
            commandUrl = commandUrl + vistaIcmCommandArm;
            tellSpeech = "All secure!";
        } else if (status == "disarm") {
            commandUrl = commandUrl + vistaIcmCommandDisarm;
            tellSpeech = "Disarmed!";
        } else if (status == "panic") {
            commandUrl = commandUrl + vistaIcmCommandPanic;
            tellSpeech = "Panic!";
        }

        console.log("GET " + commandUrl);
        http.get(commandUrl, (response) => {
            assistant.tell(tellSpeech);
            returnLambdaResponse(assistantResponse, context);
        }).on('error', (e) => {
            console.log(`Error: ${e.message}`);
            assistant.tell("Sorry, there was an error when trying to communicate with the house.");
            returnLambdaResponse(assistantResponse, context);
        });
    }

    function returnLambdaResponse(assistantResponse, context) {
        // lambda_response is the object to return that API Gateway understands

        var lambda_response = {
            "statusCode": assistantResponse.statusCode,
            "headers": {
                "Content-Type": "application/json",
                "Google-Assistant-API-Version": "v1"
            },
            "body": JSON.stringify(assistantResponse.body)
        };

        context.succeed(lambda_response);
    }

    var ActionsSdkAssistant = require('actions-on-google').ActionsSdkAssistant;
    var assistant = new ActionsSdkAssistant({ request: assistantRequest, response: assistantResponse });
    assistant.handleRequest(handleAssistantRequest);
};