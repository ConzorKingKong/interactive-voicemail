/**
 * Returns TwiML that prompts the users to make a choice.
 * If the user enters something it will trigger the handle-user-input Function and otherwise go in a loop.
 */
 exports.handler = function (context, event, callback) {
    const OWNERPHONE = context.MY_PHONE_NUMBER
    
    const twiml = new Twilio.twiml.VoiceResponse();
  
    // This is for when the owner of the voicemail calls in
    if (event.From === OWNERPHONE)  {
      twiml.redirect("./voicemail-loop?index=0")
    } else {
      // Try to connect to phone number twiml.dial. if called party hangs up, code underneath still runs. must be changed
      twiml.dial(OWNERPHONE)
      // If no answer, then take voicemail
      // if call is answered and caller hangs up, following code will not execute
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