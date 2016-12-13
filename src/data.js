/* jshint esversion: 6, node: true */
"use strict";

module.exports.phrases = {
    SKILL_NAME: "Mars Rover Mission",
    INTRO_SOUND: "<audio src=\"https://s3.amazonaws.com/kjhsoftware-alexa-skills/mars-rover-mission/sounds/intro.mp3\" /> ",
    BEEP_SOUND: "<audio src=\"https://s3.amazonaws.com/kjhsoftware-alexa-skills/mars-rover-mission/sounds/beep.mp3\" /> ",
    WELCOME_PRE : "Welcome to Mars Rover Mission.",
    WELCOME : "A slow-paced adventure game where you control a Mars exploration rover one day at a time - literally. ",
    WELCOME_PROMPT: 'Would you like to play a game?',
    WELCOME_REPROMPT: "Say yes to start the game or no to quit.",
    HELP : "Mars Rover Mission is a adventure game where you control a Mars exploration rover.  It is slow-paced in that you can only take one turn per day. ",
    GOODBYE : "Good Bye",
    MISSION: "I have exciting news. We have re-established contact with the Mars Exploration Rover Spirit. " +
        "NASA last communicated with Spirit on March 22, 2010. They ended attempts to regain contact on May 24, 2011. " +
        "We have restored limited control and would like to continue exploration of the Mars surface. " +
        "We need you to be the Spirit mission manager.  Can I count on you? ",
    MISSION_REPROMPT: "Can I count on you to be the Spirit mission manager? ",
    MISSION_ACCEPT: "That's great to hear.  Let me fill you in on some more mission details. " +
        "A solar day on Mars (often called a <phoneme alphabet=\"ipa\" ph=\"sol\">soʊl</phoneme>) is about 24 hours and 40 minutes long. " +
        "Due to communications delay and rover speed, you can only instruct the rover once per Martian day. " +
        "Say mission status to continue or stop to quit",
    MISSION_ACCEPT_REPROMPT: "Say mission status to continue or stop to quit",
    MISSION_DECLINE: "I'm sorry to hear that.  If you reconsider, please let me know.  Good Bye.",
    MISSION_RECONSIDER: "Have you reconsidered being the Spirit mission manager? ",
    MISSION_RESET: "Do you want to abandon the Mars rover mission?  All progress will be lost.  ",
    MISSION_RESET_REPROMPT: "Abandon the Mars rover mission? ",
    MISSION_RESET_ACK: "Spirit has been abandoned. <break time=\"1s\"/> Again! "
};

module.exports.phrasebuilder = {
    AT_WAYPOINT : function(waypoint) {
        return `Spirit is currently located at waypoint ${waypoint}. `;
    },
    ARRIVE_WAYPOINT : function(waypoint, report) {
        return `Spirit has arrived at waypoint ${waypoint}. ${report} `;
    },
    SEE_WAYPOINT : function(direction, qualifier, label, waypoint) {
        return `To the ${direction} is ${qualifier} to ${label} designated as waypoint ${waypoint}. `;
    },
    WAYPOINT_PROMPT : function(options) {
        var total = Object.keys(options).length;
        var current = 1;
        var msg = "Do you want to go to ";
        for (let key of Object.keys(options)) {
            if (total == 1) {
                // override message
                msg = "Your only option is to go to waypoint " + key + ".";
            } else if (current == total) {
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
        "report": "Images of the sky were taken for calibration purposes and transmitted to NASA's Odyssey orbiter. ",
        "options" : {
            "Bravo" : {
                "direction" : "east",
                "qualifier" : "a gradual downward slope"
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
        "report": "The sky and ground were surveyed with the miniature thermal emission spectrometer. ",
        "options" : {
            "Alpha" : {
                "direction" : "west",
                "qualifier" : "a gradual upward slope"
            },
            "Charlie": {
                "direction" : "north",
                "qualifier" : "an upward slope"
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
        "report": "During travel, the rover searched for clouds using the navigation camera. ",
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
                "qualifier" : "a downward slope"
            },
        },

        "N": 0, "E" : 0
    },
    "Delta" : {
        "label" : "the access point of an elevated area",
        "report": "A 360-degree, full-color view of the surroundings was captured. ",
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
        "report": "Full-color images were acquired, using all 13 filters of the panoramic camera. ",
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
        "label" : "a rocky region",
        "report": "The tilt of the solar panels was adjusted to better point them toward the Sun. ",
        "options" : {
            "Delta" : {
                "direction" : "south",
                "qualifier" : "a clockwise arc"
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
        "label" : "a rocky expanse",
        "report": "Colder temperatures and lower solar array input required additional time to recharge the battery. ",
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
        "report": "The alpha-particle X-ray spectrometer was used to measure argon gas in the atmosphere. ",
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
        "report": "Because of the soft terrain, some difficulty was experienced during this drive. ",
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
        "report": "Measurements were gathered of atmospheric dust levels. ",
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
        "report": "The miniature thermal emission spectrometer was calibrated. ",
        "options" : {
            "Delta" : {
                "direction" : "west",
                "qualifier" : "an upward slope"
            },
            "Golf": {
                "direction" : "north",
                "qualifier" : "a corridor"
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
        "report": "Time-lapse movies were taken with the navigation camera. ",
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
        "report": "Soil samples containing iron-bearing minerals were studied. ",
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
                "qualifier" : "a jagged path"
            },
        },
        "N": 0, "E" : 0
    },
    "November" : {
        "label" : "a collection of large boulders",
        "report": "Material was analyzed on the external capture magnet. ",
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
        "report": "The overall charge state of the battery has dropped slightly as a result of recent activities. ",
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
        "report": "Atmospheric dust levels were assessed with the panoramic camera based on the darkness of the sky. ",        
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
                "qualifier" : "a great descent"
            },
        },
        "N": 0, "E" : 0
    },
    "Quebec" : {
        "label" : "a low lying area",
        "report": "The spacecraft clock was synchronized to Earth time, requiring a power-intensive communications link. ",
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
        "report": "The rock abrasion tool was used to brush the surface. ",
        "options" : {
            "Bravo" : {
                "direction" : "west",
                "qualifier" : "a slight upward slope"
            },
            "Charlie": {
                "direction" : "northwest",
                "qualifier" : "an upward slope"
            },
            "Sierra": {
                "direction" : "east",
                "qualifier" : "an irreversible steep descent"
            },
        },
        "N": 0, "E" : 0
    },
    "Sierra" : {
        "label" : "some rocky terrain",
        "report": "The on-board system of fiber-optic gyroscopes and solid-state accelerometers was reset. ",
        "options" : {
            "Mike" : {
                "direction" : "northeast",
                "qualifier" : "a rocky path"
            },
            "November": {
                "direction" : "east",
                "qualifier" : "a straight shot"
            },
        },
        "N": 0, "E" : 0
    }
};