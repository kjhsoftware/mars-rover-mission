'use strict';

// http://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html

var useXRAY = (process.env.AWS_XRAY_DAEMON_ADDRESS);
if (process.env.AWS_XRAY_DAEMON_ADDRESS) {
    var AWSXRay = require('aws-xray-sdk-core');
}

exports.captureLambdaHandler = function (handler) {
    if (!typeof handler === 'function') {
        throw new Error("handler is not a function");
    }
    // return new FunctionWrapper(handler).wrappingFunction();
    const wrappedFunction = function (event, context, callback) {
        if (AWSXRay) {
            // Function "addMetadata" cannot be called on an AWS Lambda segment. Please use a subsegment to record data.
            const segmentName = process.env._HANDLER || 'index.handler';
            var subsegment = AWSXRay.getSegment().addNewSubsegment(segmentName);
            subsegment.addMetadata('event', event);
            subsegment.addMetadata('context', context);
            
            addAlexaSkillsKitAnnotations(subsegment, event);
        }
        try {
            handler(event, context, function(err, result) {
                callback(err, result);
                if (subsegment) {
                    subsegment.addMetadata('result', result);
                    subsegment.close(err, false);
                }
            });
        }
        catch (e) {
            if (subsegment) {
                subsegment.close(e, false);
            }
        }
    };

    return wrappedFunction;
};

function addAlexaSkillsKitAnnotations(subsegment, event) {
    subsegment.addAnnotation('sessionId', event.session.sessionId);

    if (event.session) {
        subsegment.addAnnotation('sessionId', event.session.sessionId);
    }

    if (event.context) {
        subsegment.addAnnotation('applicationId', event.context.System.application.applicationId);
        subsegment.addAnnotation('userId', event.context.System.user.userId);
    }
    
    if (event.request) {
        subsegment.addAnnotation('requestId', event.request.requestId);
        subsegment.addAnnotation('type', event.request.type); 
        if (event.request.intent) {
            subsegment.addAnnotation('intent', event.request.intent.name); 
        }
    }
}