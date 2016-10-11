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

    'LaunchRequest': function () {

        if(this.event.request.intent) {
            if(this.event.request.intent.slots.word.value) {
                this.emit('GetAnagram');
            }
        }

        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what\'s an' +
            ' anagram for dog?.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. Please try again.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },

    'GetAnagram': function() {

        var receivedWord = this.event.request.intent.slots.word.value;
        var repromptSpeech = "Try another word, or say exit."
        var cardTitle = "NagARam";

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
                    var bad_stuff = "I cannot find an anagram for " + receivedWord + ", try another word.";
                    self.attributes['speechOutput'] = bad_stuff;
                    self.emit(':askWithCard', bad_stuff, repromptSpeech, cardTitle, bad_stuff);

                }
                var good_stuff = "An anagram for " + receivedWord + " is " + result + ". Try another word, or say exit.";
                self.attributes['speechOutput'] = good_stuff;
                self.emit(':askWithCard', good_stuff, repromptSpeech, cardTitle, good_stuff);

            });

        }).on('error', function(e) {
            console.log("Got error: " + e.message); context.done(null, 'FAILURE');
            var unknown_stuff = "I don't know that word, try another word.";
            self.attributes['speechOutput'] = unknown_stuff;
            self.emit(':askWithCard', unknown_stuff, repromptSpeech, cardTitle, unknown_stuff);
        }).end();

    },

    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask questions such as, what is an anagram for stressed, or, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, tell me an anagram for glass, or you can say exit...' +
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
