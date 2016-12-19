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
    const vistaIcmCommandLeftGarage = process.env.VISTA_ICM_COMMAND_LEFT_GARAGE;
    const vistaIcmCommandRightGarage = process.env.VISTA_ICM_COMMAND_RIGHT_GARAGE;

    var assistantRequest = new AssistantRequest(event);
    var assistantResponse = new AssistantResponse();

    var commandUrl = vistaIcmAddress + "/execute?command=";

    function mainIntent(assistant) {
        assistant.tell("You can say something like tell tiger to arm the alarm or tell tiger to open the left garage door.");
        returnLambdaResponse(assistantResponse, context);
    }

    function alarmIntent(assistant) {

        var status = assistant.getArgument("alarm-status");
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

    function garageIntent(assistant) {

        var side = assistant.getArgument("garage-side");
        var tellSpeech = null;

        if (side == "left") {
            commandUrl = commandUrl + vistaIcmCommandLeftGarage;
            tellSpeech = "Left door engaged.";
        } else if (status == "right") {
            commandUrl = commandUrl + vistaIcmCommandRightGarage;
            tellSpeech = "Right door engaged.";
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
    var actionMap = new Map();
    
    actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
    actionMap.set("ALARM", alarmIntent);
    actionMap.set("GARAGE", garageIntent);

    assistant.handleRequest(actionMap);
};