/**
 * Returns TwiML that prompts the users to make a choice.
 * If the user enters something it will trigger the handle-user-input Function and otherwise go in a loop.
 */
 exports.handler = function (context, event, callback) {
    
    const twiml = new Twilio.twiml.VoiceResponse();
    // The call timed out or didn't complete. We will take a voicemail.
    // Otherwise, the call completed and we exit
    if (event.DialCallStatus === 'no-answer' || event.DialCallStatus === 'failed' || event.DialCallStatus === 'busy' || event.DialCallStatus === 'canceled') {
        twiml.say('Please record your message after the tone. Press 1 when youre done recording');
        twiml.record({
          transcribe: true,
          timeout: 10,
          finishOnKey: '1',
          action: 'voicemail-complete',
          maxLength: 30
        });
    }
    
    callback(null, twiml);
  };