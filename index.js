'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SKILL_NAME = 'NagARam"';
var recipes = require('./recipes');
var http = require('http');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what\'s the' +
            ' recipe for a chest? ... Now, what can I help you with.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'GetAnagram': function() {

        //Words coming in?
        // function httpGetAsync(theUrl, callback) { 
        //     var xmlHttp = new XMLHttpRequest();
        //     xmlHttp.onreadystatechange = function() { 
        //         if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText); 
        //     } 
        //     xmlHttp.open("GET", theUrl, true);
        // }
        

        var receivedWord = this.event.request.intent.slots.word.value;
       
        var cardTitle = "NagARam";
        var recipe = "Where does this show up?";


        http.get("http://www.anagramica.com/best/:" + receivedWord, function(res) { 
            console.log("Got response: " + res.statusCode); 

            //Alexa Talking 
            this.attributes['speechOutput'] = "You said " + receivedWord;
            this.attributes['repromptSpeech'] = 'Try saying repeat.';
            this.emit(':askWithCard', recipe, this.attributes['repromptSpeech'], cardTitle, recipe);

        }).on('error', function(e) { 
            console.log("Got error: " + e.message); context.done(null, 'FAILURE'); 
            this.attributes['speechOutput'] = "Error on function Get Anagram";
        }); 
        
        //Word being used is person
        




    },
    // 'RecipeIntent': function () {
    //     var itemSlot = this.event.request.intent.slots.Item;
    //     var itemName;
    //     if (itemSlot && itemSlot.value) {
    //         itemName = itemSlot.value.toLowerCase();
    //     }

    //     var cardTitle = SKILL_NAME + ' - Recipe for ' + itemName;
    //     var recipe = recipes[itemName];

    //     if (recipe) {
    //         this.attributes['speechOutput'] = recipe;
    //         this.attributes['repromptSpeech'] = 'Try saying repeat.';
    //         this.emit(':askWithCard', recipe, this.attributes['repromptSpeech'], cardTitle, recipe);
    //     } else {
    //         var speechOutput = 'I\'m sorry, I currently do not know ';
    //         var repromptSpeech = 'What else can I help with?';
    //         if (itemName) {
    //             speechOutput = 'the recipe for ' + itemName + '. ';
    //         } else {
    //             speechOutput = 'that recipe. ';
    //         }
    //         speechOutput += repromptSpeech;

    //         this.attributes['speechOutput'] = speechOutput;
    //         this.attributes['repromptSpeech'] = repromptSpeech;

    //         this.emit(':ask', speechOutput, repromptSpeech);
    //     }
    // },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask questions such as, what\'s the recipe, or, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, what\'s the recipe, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Goodbye!');
    }
};