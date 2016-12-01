/* jshint esversion: 6, node: true */
"use strict";

module.exports.phrases = {
    SKILL_NAME: "Mars Rover Mission",
    INTRO_SOUND: "<audio src=\"https://s3.amazonaws.com/kjhsoftware-alexa-skills/mars-rover-mission/sounds/intro.mp3\" /> ",
    BEEP_SOUND: "<audio src=\"https://s3.amazonaws.com/kjhsoftware-alexa-skills/mars-rover-mission/sounds/beep.mp3\" /> ",
    WELCOME_PRE : "Welcome to Mars Rover Mission.",
    WELCOME : "A slow paced adventure game where you manage a Mars rover one day at a time - literally. ",
    WELCOME_PROMPT: 'Would you like to play a game?',
    WELCOME_REPROMPT: "Say yes to start the game or no to quit.",
    HELP : "Mars Rover Mission is a adventure game where you manage a Mars rover.  It is slow paced in that you can only take one turn per day.",
    GOODBYE : "Good Bye",
    MISSION: "I have exciting news. We have re-established contact with the Mars Exploration Rover Spirit. " +
        "NASA last communicated with Spirit on March 22, 2010. They ended attempts to regain contact on May 24, 2011. " +
        "We have restored limited control and would like to continue exploration of the Mars surface. " +
        "We need you to be the Spirit mission manager.  Can I count on you?",
    MISSION_REPROMPT: "Can I count on you to be the Spirit mission manager?",
    MISSION_ACCEPT: "That's great to hear.  Let me fill you in on some more mission details. " +
        "A solar day on Mars (often called a sol) is about 24 hours and 39 minutes long. " +
        "Due to communications delay and rover speed, you can only instruct the rover once per Martian day. " +
        "Say mission status to continue or stop to quit",
    MISSION_ACCEPT_REPROMPT: "Say mission status to continue or stop to quit",
    MISSION_DECLINE: "I'm sorry to hear that.  If you reconsider, please let me know.  Good Bye.",
    MISSION_RECONSIDER: "Have you reconsidered being the Spirit mission manager? "
};

module.exports.phrasebuilder = {
    AT_WAYPOINT : function(waypoint) {
        return `Spirit is currently located at waypoint ${waypoint}. `;
    },
    SEE_WAYPOINT : function(direction, qualifier, label, waypoint) {
        return `To the ${direction} is ${qualifier} to ${label} designated as waypoint ${waypoint}. `;
    },
    WAYPOINT_PROMPT : function(options) {
        var total = Object.keys(options).length;
        var current = 1;
        var msg = "Do you want to go to ";
        for (let key of Object.keys(options)) {
            if (current == total) {
                // end question
                msg += "waypoint " + key + "?";
            } else if (current == (total - 1)) {
                // next to last, add 'or'
                msg += "waypoint " + key + ", or ";
            } else {
                msg += "waypoint " + key + ", ";
            }
            current++;
        }
        return  msg;
    },
    EN_ROUTE : function(prevWaypoint, nextWaypoint) {
        return `Spirit is currently traveling from waypoint ${prevWaypoint} to waypoint ${nextWaypoint}. `;
    },
    LAST_TURN : function(duration) {
        return `It has only been ${duration.hours} hours and ${duration.minutes} minutes since your last instruction.  `;
    },
};

// Spirit is currently traveling to waypoint X.  check back tomorrow.  
module.exports.waypoints = {
    "Alpha" : {
        "label" : "the starting location",
        "options" : {
            "Bravo" : {
                "direction" : "east",
                "qualifier" : "a slight downward slope"
            },
            "Charlie": {
                "direction" : "northeast",
                "qualifier" : "a level path"
            },
        },
        "N": 0, "E" : 0
    },
    "Bravo" : {
        "label" : "an interesting rock formation",
        "options" : {
            "Alpha" : {
                "direction" : "west",
                "qualifier" : "a slight upward slope"
            },
            "Charlie": {
                "direction" : "north",
                "qualifier" : "a slight upward slope"
            },
            "Romeo": {
                "direction" : "east",
                "qualifier" : "a slight downward slope"
            },
        },
        "N": 0, "E" : 0
    },
    "Charlie" : {
        "label" : "an open area",
        "options" : {
            "Alpha" : {
                "direction" : "southwest",
                "qualifier" : "a level path"
            },
            "Bravo": {
                "direction" : "south",
                "qualifier" : "a slight downward slope"
            },
            "Delta": {
                "direction" : "northeast",
                "qualifier" : "a direct route"
            },
            "Romeo": {
                "direction" : "southeast",
                "qualifier" : "a slight downward slope"
            },
        },

        "N": 0, "E" : 0
    },
    "Delta" : {
        "label" : "the access point of an elevated area",
        "options" : {
            "Charlie" : {
                "direction" : "southwest",
                "qualifier" : "a direct route"
            },
            "Echo": {
                "direction" : "north",
                "qualifier" : "a clockwise arc along the edge of the elevated area"
            },
            "Foxtrot" : {
                "direction" : "northeast",
                "qualifier" : "a counter clockwise arc along the edge of the elevated area"
            },
            "Juliet": {
                "direction" : "northwest",
                "qualifier" : "a dogleg path"
            },
            "Kilo": {
                "direction" : "southeast",
                "qualifier" : "a downward slope"
            },
        },
        "N": 0, "E" : 0
    },
    "Echo" : {
        "label" : "a scenic overlook",
        "options" : {
            "Delta" : {
                "direction" : "south",
                "qualifier" : "a counter clockwise arc"
            },
            "Foxtrot": {
                "direction" : "east",
                "qualifier" : "a clockwise arc along the edge of the elevated area"
            },
        },
        "N": 0, "E" : 0
    },
    "Foxtrot" : {
        "label" : "a rocky area",
        "options" : {
            "Delta" : {
                "direction" : "south",
                "qualifier" : "a counter clockwise arc"
            },
            "Echo": {
                "direction" : "west",
                "qualifier" : "a counter clockwise arc along the edge of the elevated area"
            },
            "Golf": {
                "direction" : "east",
                "qualifier" : "a one way exit"
            },
        },
        "N": 0, "E" : 0
    },
    "Golf" : {
        "label" : "a rocky area",
        "options" : {
            "Hotel" : {
                "direction" : "northwest",
                "qualifier" : "a counter clockwise arc along the outside of the elevated area"
            },
            "Kilo": {
                "direction" : "south",
                "qualifier" : "a rocky corridor"
            },
        },
        "N": 0, "E" : 0
    },
    "Hotel" : {
        "label" : "a place",
        "options" : {
            "Golf" : {
                "direction" : "southeast",
                "qualifier" : "a clockwise arc along the outside of the elevated area"
            },
            "India": {
                "direction" : "west",
                "qualifier" : "a beeline"
            },
            "Juliet": {
                "direction" : "southwest",
                "qualifier" : "a counter clockwise arc along the outside of the elevated area"
            },
        },
        "N": 0, "E" : 0
    },
    "India" : {
        "label" : "a sandy area",
        "options" : {
            "Hotel" : {
                "direction" : "east",
                "qualifier" : "a beeline"
            },
            "Juliet": {
                "direction" : "southeast",
                "qualifier" : "a direct route"
            },
        },
        "N": 0, "E" : 0
    },
    "Juliet" : {
        "label" : "a clearing between the elevated area and a rock formation",
        "options" : {
            "Delta" : {
                "direction" : "southeast",
                "qualifier" : "a dogleg path"
            },
            "Hotel": {
                "direction" : "northeast",
                "qualifier" : "a clockwise arc along the outside of the elevated area"
            },
            "India": {
                "direction" : "northwest",
                "qualifier" : "a direct route"
            },
        },
        "N": 0, "E" : 0
    },
    "Kilo" : {
        "label" : "a darkened canyon",
        "options" : {
            "Delta" : {
                "direction" : "west",
                "qualifier" : "an upward slight"
            },
            "Golf": {
                "direction" : "north",
                "qualifier" : "a rocky corridor"
            },
            "Lima": {
                "direction" : "southwest",
                "qualifier" : "a dark ravine"
            },
            "Mike": {
                "direction" : "southeast",
                "qualifier" : "a level path"
            },
            "Papa": {
                "direction" : "east",
                "qualifier" : "a wind worn trail"
            },
        },
        "N": 0, "E" : 0
    },
    "Lima" : {
        "label" : "some rocky terrain",
        "options" : {
            "Kilo" : {
                "direction" : "northeast",
                "qualifier" : "a dark ravine"
            },
            "Mike": {
                "direction" : "east",
                "qualifier" : "a steep, narrow pathway"
            },
        },
        "N": 0, "E" : 0
    },
    "Mike" : {
        "label" : "the shadow of a gigantic boulder",
        "options" : {
            "Kilo" : {
                "direction" : "northwest",
                "qualifier" : "a level path"
            },
            "November": {
                "direction" : "east",
                "qualifier" : "a level path"
            },
            "Sierra": {
                "direction" : "southwest",
                "qualifier" : "a rocky path"
            },
        },
        "N": 0, "E" : 0
    },
    "November" : {
        "label" : "a collection of large boulders",
        "options" : {
            "Mike" : {
                "direction" : "west",
                "qualifier" : "a level path"
            },
            "Oscar": {
                "direction" : "north",
                "qualifier" : "an indirect route"
            },
            "Sierra": {
                "direction" : "west",
                "qualifier" : "a straight shot"
            },
        },
        "N": 0, "E" : 0
    },
    "Oscar" : {
        "label" : "an outcropping of rock",
        "options" : {
            "November" : {
                "direction" : "south",
                "qualifier" : "an indirect route"
            },
            "Papa": {
                "direction" : "northwest",
                "qualifier" : "a sharp dogleg path"
            },
        },
        "N": 0, "E" : 0
    },
    "Papa" : {
        "label" : "a narrow pass",
        "options" : {
            "Kilo" : {
                "direction" : "west",
                "qualifier" : "a wind worn trail"
            },
            "Oscar": {
                "direction" : "southeast",
                "qualifier" : "a sharp dogleg path"
            },
            "Quebec": {
                "direction" : "northeast",
                "qualifier" : "a gradual decent"
            },
        },
        "N": 0, "E" : 0
    },
    "Quebec" : {
        "label" : "a low lying area",
        "options" : {
            "Papa" : {
                "direction" : "southwest",
                "qualifier" : "a great ascent"
            },
        },
        "N": 0, "E" : 0
    },
    "Romeo" : {
        "label" : "an area overlooking a crater",
        "options" : {
            "Bravo" : {
                "direction" : "west",
                "qualifier" : "a slight upward slope"
            },
            "Charlie": {
                "direction" : "northwest",
                "qualifier" : "a slight downward slope"
            },
            "Sierra": {
                "direction" : "east",
                "qualifier" : "a moderately steep decent"
            },
        },
        "N": 0, "E" : 0
    },
    "Sierra" : {
        "label" : "some rocky terrain",
        "options" : {
            "Mike" : {
                "direction" : "northeast",
                "qualifier" : "a rocky path"
            },
            "November": {
                "direction" : "east",
                "qualifier" : "a strait shot"
            },
        },
        "N": 0, "E" : 0
    }
};