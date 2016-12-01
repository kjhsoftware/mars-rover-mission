/* jshint esversion: 6, node: true */
"use strict";

require('./polyfill')
var Alexa = require('alexa-sdk');
var Data = require("./data");

var states = {
    NONE: '',
    INFOMODE: '_INFOMODE',
    BRIEFINGMODE: '_BRIEFINGMODE',
    WAYPOINTMODE: '_WAYPOINTMODE' 
};

function getSlotValue(intent, slot) {
    var hasValue = intent && intent.slots && intent.slots[slot] && intent.slots[slot].value;
    return (hasValue ? intent.slots[slot].value : null);
}

function martianDuration(startTime, endTime) {
    let SOL_MIN = ((24 * 60) + 40); // a Martian day (or sol) is about 24h 40m long
    let durationInMinutes = Math.floor((endTime - startTime) / (60 * 1000));
    
    var duration = {};
    duration.days = Math.floor(durationInMinutes / SOL_MIN);
    durationInMinutes -= (duration.days * SOL_MIN);
    duration.hours = Math.floor(durationInMinutes / 60);
    duration.minutes = durationInMinutes - (duration.hours * 60);
    
    return duration;
}

var newSessionHandlers = {

    'NewSession': function() {
        if (Object.keys(this.attributes).length === 0) {
            // first time the skill has been invoked?
            this.attributes['currentWaypoint'] = 'Alpha';
        }
        var p = Data.phrases;
        var message = `${p.INTRO_SOUND} ${p.WELCOME_PRE} ${p.WELCOME} ${p.WELCOME_PROMPT}`;
        var cardTitle = "Welcome";
        var cardContent = Data.phrases.WELCOME;

        var imageObj = {
            smallImageUrl: 'https://s3.amazonaws.com/kjhsoftware-alexa-skills/mars-rover-mission/images/mer-card-small.jpg',
            largeImageUrl: 'https://s3.amazonaws.com/kjhsoftware-alexa-skills/mars-rover-mission/images/mer-card-large.jpg'
        };

        this.emit(':askWithCard', message, Data.phrases.WELCOME_REPROMPT, cardTitle, cardContent, imageObj);
    },
    'AMAZON.RepeatIntent': function () {
        var p = Data.phrases;
        var message = `${p.WELCOME_PRE} ${p.WELCOME} ${p.WELCOME_PROMPT}`;
        this.emit(':ask', message, Data.phrases.WELCOME_REPROMPT);
    },
    'AMAZON.YesIntent': function () {
        this.handler.state = states.BRIEFINGMODE;
        this.emitWithState('NewMission');
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', Data.phrases.INTRO_SOUND + Data.phrases.GOODBYE);
    },
    'AMAZON.StopIntent': function () {
        this.emit('AMAZON.NoIntent');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.NoIntent');
    },
    'Unhandled': function () {
        this.emit('AMAZON.NoIntent');
    },
    'AMAZON.HelpIntent': function () {
        var message = Data.phrases.HELP;
        this.emit(':ask', message, message);
    }
};

// setup user with background information
var briefingModeHandlers = Alexa.CreateStateHandler(states.BRIEFINGMODE, {

    // user declined mission and launched skill again
    'LaunchRequest': function() {
        // TODO check if more that N days since first launch, then send back to NewSession
        var message = Data.phrases.MISSION_RECONSIDER;
        this.emit(':ask', message, Data.phrases.MISSION_REPROMPT);
    },

    'NewMission': function() {
        var message = Data.phrases.MISSION;
        this.emit(':ask', message, Data.phrases.MISSION_REPROMPT);
    },
    
    'AMAZON.YesIntent': function() {
        this.attributes['startTime'] = this.attributes['lastTime'] = Date.now();
        var message = Data.phrases.MISSION_ACCEPT;
        this.emit(':ask', message, Data.phrases.MISSION_ACCEPT_REPROMPT);
    },

    'AMAZON.NoIntent': function() {
        var message = Data.phrases.MISSION_DECLINE;
        this.emit(':tell', message);
    },

    'AMAZON.StopIntent': function () {
        this.emit('AMAZON.StopIntent');
    },

    'StatusIntent': function() {
        this.handler.state = states.WAYPOINTMODE;
        this.emitWithState('StatusIntent');
    }

});

var waypointModeHandlers = Alexa.CreateStateHandler(states.WAYPOINTMODE, {

    'LaunchRequest': function() {
        // if launching to this mode
        this.emitWithState('StatusIntent');
    },

    'StatusIntent': function() {
        var current = this.attributes['currentWaypoint'];
        var target = this.attributes['targetWaypoint'];

        var missionDuration = martianDuration(this.attributes['startTime'], Date.now());
        var turnDuration = martianDuration(this.attributes['lastTime'], Date.now());

        // check elpased duration
        if (target && turnDuration.days > 0) {
            current = this.attributes['currentWaypoint'] = target;
            target = null;
            delete this.attributes['targetWaypoint'];
        }

        if (target) {
            var message = Data.phrasebuilder.EN_ROUTE(current, target) +
                Data.phrasebuilder.LAST_TURN(turnDuration);

            var cardTitle = `Mission Status (Sol ${missionDuration.days+1} ${missionDuration.hours}h ${missionDuration.minutes}m)`;
            this.emit(':askWithCard', message, Data.phrases.MISSION_ACCEPT_REPROMPT, cardTitle, message);
        } else {

            var loc = Data.waypoints[current];
            var message = Data.phrasebuilder.AT_WAYPOINT(current);
            for (let key of Object.keys(loc.options)) {
                var option = loc.options[key];
                message = message + ' ' + Data.phrasebuilder.SEE_WAYPOINT(option.direction, option.qualifier, Data.waypoints[key].label, key);
            }
            var prompt = Data.phrasebuilder.WAYPOINT_PROMPT(loc.options);
            message = message + '\n ' + Data.phrasebuilder.WAYPOINT_PROMPT(loc.options);

            var cardTitle = `Mission Status (Sol ${missionDuration.days+1} ${missionDuration.hours}h ${missionDuration.minutes}m)`;
            this.emit(':askWithCard', message, prompt, cardTitle, message);
        }
    },

    'WaypointIntent': function() {
        var intent = this.event.request.intent;
        var current = this.attributes['currentWaypoint'];
        var loc = Data.waypoints[current];
        var target = getSlotValue(intent, 'Waypoint');
        var keys = Object.keys(loc.options);
        if (target) {
            // make proper case
            target = target.charAt(0).toUpperCase() + target.slice(1); 
        }
        console.log(`looking for waypoint ${target} in ${keys}`)
        if (keys.includes(target)) {
            this.attributes['lastTime'] = Date.now();
            this.attributes['targetWaypoint'] = target;
            this.emit(':saveState', true);
            var message = Data.phrasebuilder.EN_ROUTE(current, target) +
                Data.phrases.BEEP_SOUND;
            this.emit(':ask', message, message);
        } else {
            this.emitWithState('Unhandled');
        }
    },

    'OverrideWaypointIntent': function() {
        var intent = this.event.request.intent;
        var target = getSlotValue(intent, 'Waypoint');
        if (target) {
            // make proper case
            target = target.charAt(0).toUpperCase() + target.slice(1); 
        }
        if (Object.keys(Data.waypoints).includes(target)) {
            this.attributes['currentWaypoint'] = target;
            delete this.attributes['targetWaypoint'];
        }
        this.emitWithState('StatusIntent');
    },

    'OverrideTimeIntent': function () {
        this.attributes['startTime'] -= 88800000;
        this.attributes['lastTime'] -= 88800000;
        
        this.emitWithState('StatusIntent');
    },
    
    'AMAZON.StopIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.CancelIntent');
    },
    'Unhandled': function() {
        var current = this.attributes['currentWaypoint'];
        var message = Data.phrasebuilder.WAYPOINT_PROMPT(Data.waypoints[current].options);
        this.emit(':ask', message, message);
    }
});

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.3ef12585-21e5-4396-a55b-40f0fc900b84";
    alexa.dynamoDBTableName = 'mars-rover-mission-table';
    alexa.registerHandlers(newSessionHandlers, briefingModeHandlers, waypointModeHandlers);
    alexa.execute();
};