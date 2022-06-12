/**
 * Returns TwiML that prompts the users to make a choice.
 * If the user enters something it will trigger the handle-user-input Function and otherwise go in a loop.
 */
 exports.handler = function (context, event, callback) {
    const OWNERPHONE = context.MY_PHONE_NUMBER
    
    const twiml = new Twilio.twiml.VoiceResponse();
  
    // When the owner of the voicemail calls in, we transfer
    // them right to the voicemail
    if (event.From === OWNERPHONE)  {
      twiml.redirect("./voicemail-loop?index=0")
    } else {
      // We connect the unknown caller to us with twiml.dial
      // if the call completes or times out we move to the handler in the action option
      twiml.dial({
        action: 'handle-call',
        timeout: 17
      }, OWNERPHONE)
    }
    
    callback(null, twiml);
  };