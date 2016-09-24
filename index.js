'use strict';

var Alexa = require('alexa-sdk');
var SKILL_NAME = 'Nag A Ram';
var APP_ID = undefined;
var http = require('http');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what\'s an' +
            ' anagram for dog?.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. Please try again.';
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

        var self = this;
        http.get("http://www.anagramica.com/best/:" + receivedWord, function(res) { 
            var string = '';
            res.on('data', function(chunk) {
                string += chunk;
            });

            res.on('end', function() {

                var array = JSON.parse(string).best;
                for(var i = 0; i < array.length; i++) {
                    if(array[i] != receivedWord) {
                        var result = array[i];
                        break;
                    }
                };
                if(!result) {
                    var bad_stuff = "I cannot find an anagram for " + receivedWord + ", try another word";
                    self.attributes['speechOutput'] = bad_stuff;
                    self.emit(':askWithCard', bad_stuff, self.attributes['repromptSpeech'], cardTitle, bad_stuff);
 
                }
                var good_stuff = "An anagram for " + receivedWord + " is " + result;
                self.attributes['speechOutput'] = good_stuff;
                self.emit(':askWithCard', good_stuff, self.attributes['repromptSpeech'], cardTitle, good_stuff);
 
            });

        }).on('error', function(e) { 
            console.log("Got error: " + e.message); context.done(null, 'FAILURE'); 
            var unknown_stuff = "I don't know that word";
            self.attributes['speechOutput'] = unknown_stuff;
            self.emit(':askWithCard', unknown_stuff, self.attributes['repromptSpeech'], cardTitle, unknown_stuff);
        }).end(); 
        
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