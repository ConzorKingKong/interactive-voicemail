exports.handler = async function(context, event, callback) {
    // Here's an example of setting up some TWiML to respond to with this function
      let twiml = new Twilio.twiml.VoiceResponse();
    // Initiate a Twilio API client. Make sure you enabled exposing username and password
    const client = context.getTwilioClient();
  
    let Index = parseInt(event.index) || 0;
    let UserInput = event.Digits || event.SpeechResult || '1';
    const VOICEMAIL_NUMBER = context.TWILIO_PHONE_NUMBER;
  
  
    // Get list of voicemails. Sort by newest first
    const voicemailClean = [];
    let voicemailList = await client.recordings.list({to: VOICEMAIL_NUMBER});
    // split string, add mp3 at the end, loop through playing them
    voicemailList.forEach(function (c) {
      let audioUri = `https://api.twilio.com${c.uri.slice(0, -4)}mp3`;
      voicemailClean.push(audioUri);
    });
  
  
    if (UserInput.length > 1) {
      if (UserInput.toLowerCase().includes('next')) {
        UserInput = '1';
      } else if (UserInput.toLowerCase().includes('replay')) {
        UserInput = '2';
      } else if (UserInput.toLowerCase().includes('delete')) {
        UserInput = '3';
      } else if (UserInput.toLowerCase().includes('restart')) {
        UserInput = '9';
      }
    }
  
    switch (UserInput) {
      case '1':
        // Do nothing
        break;
      case '2':
        Index = Index - 1;
        break;
      case '3':
        let deleteResponse = await client.recordings(voicemailList[Index - 1].sid).remove();
        twiml.say('Message deleted');
        break;
      case '9':
        Index = 0
        break;
      default:
        twiml.say('We are sorry, we did not recognize your option. Please try again.');
        twiml.redirect('voicemail-loop');
    }
  
  
    // Someone accidentally hit 1 on the last voicemail
    if (Index === voicemailList.length) {
      Index = 0;
    }
  
    if (voicemailList.length === 0) {
      twiml.say('You have no messages. Goodbye');
      twiml.hangup();
    }
  
    if (Index === 0) {
      twiml.say(`You have ${voicemailList.length} messages`);
    }
  
  
    twiml.say(`Message ${Index + 1} of ${voicemailList.length}`);
    twiml.play(voicemailClean[Index]);
  
    const gather = twiml.gather({
      numDigits: 1,
      action: `./voicemail-loop?index=${Index + 1}`,
      hints: 'next, replay, delete, restart',
      input: 'speech dtmf',
    });
  
  
    if (Index + 1 !== voicemailList.length) {
      gather.say('Press 1 or say next to play the next message');
    }
    gather.say('Press 2 or say replay to replay this message');
    gather.say('Press 3 or say delete to delete this message');
    if (Index + 1 === voicemailList.length) {
      gather.say('To hear your voicemails again, press 9 or say restart');
    }
  
  
    // This callback is what is returned in response to this function being invoked.
    // It's really important! E.g. you might respond with TWiML here for a voice or SMS response.
    // Or you might return JSON data to a studio flow. Don't forget it!
    return callback(null, twiml);
  };