
// This is your new function. To start, set the name and path on the left.

exports.handler = function(context, event, callback) {
    // Here's an example of setting up some TWiML to respond to with this function
    let twiml = new Twilio.twiml.VoiceResponse();
    twiml.say('Your message has been saved. Goodbye!');
    twiml.hangup();
      
    
  
    // You can log with console.log
    // let variable = 'welcome!';
    // console.log('error', variable);
  
    // This callback is what is returned in response to this function being invoked.
    // It's really important! E.g. you might respond with TWiML here for a voice or SMS response.
    // Or you might return JSON data to a studio flow. Don't forget it!
    return callback(null, twiml);
  };