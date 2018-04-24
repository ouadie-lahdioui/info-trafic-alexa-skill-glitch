const express = require("express");
const alexa = require("alexa-app");
const unirest = require('unirest');

const PORT = process.env.port || 8080;
const expressApp = express();

const alexaApp = new alexa.app("message/receive");

const Phrases = {
  "Launch"    :'<say-as interpret-as="interjection">Mystère mystère</say-as> Bonsoir, bienvenu dans la soirée Alexa',
  "Help"      :'je suis là pour vous aidez, il suffit de me demander',
  "Stop"      :'You ask me to stop',
  "Error"     :"By the Hoary hosts of Hoggoth, I need you to try again.",
  "NotHeard"  :'What is it?  I suggest you try it again.',
  "NotFound"  :'Not found, how about you try something else.',
  "NoList"    :'No list has that name. You can try it again.',
  "Reprompt"  :'Lets give it another go.',
  "TakingTooLong":'Get on with it!'
};

alexaApp.express({expressApp});

expressApp.get('/', (req, res) => res.send('Hello World!'));


alexaApp.launch((req, res) => {
  res.say(Phrases.Launch).shouldEndSession(false);
});

alexaApp.intent("AMAZON.HelpIntent",
  (req, res) => {
    res.say(Phrases.help).shouldEndSession(false);
  }
);

alexaApp.intent('getInfoTrafic',
  (req, res) => {
    let line = req.slots["metroLine"].value;
  
     return new Promise((resolve, reject) => {
        unirest.get('https://www.ratp.fr/meteo/ajax/data')
          .end( (response) => {
            let message = response.body.status.metro.lines[line].message;
            res.say("Voici l'état du trafic de la ligne " + line);
            res.say(message).shouldEndSession(false);
            resolve();
          });
      });  
  
  }
);

alexaApp.pre = (request, response, type) => {
  console.log("applicationId = " + request.applicationId);
  // throw "Invalid applicationId"; OR return response.fail("Invalid applicationId")
};

alexaApp.sessionEnded(function(request, response) {
  // cleanup the user's server-side session
  // no response required
  console.log("Good bye, see you next time :)")
});

expressApp.listen(PORT);

console.log("Listening on port " + PORT + ", try http://localhost:" + PORT + "/message/receive");