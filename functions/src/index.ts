import * as functions from 'firebase-functions';
import {WebhookClient} from 'dialogflow-fulfillment';



'use strict';

process.env.DEBUG = 'dialogflow:debug';

export const dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const webhookAgent = new WebhookClient({ request, response });
    

    function welcome(agent) {
        agent.add("Bonjour!");
        agent.add("Vous pouvez me demander des informations sur les tables de discussions et sur les prochaines présentations");
    }


    function fallback(agent) {
        agent.add("Désolé, je n'ai pas compris! Mais j'apprends!");
    }

    function dateProchainOpenTables(agent) {
        console.log("dateProchainOpenTables called!");
        agent.add("Laissez moi regarder ce que j'ai écrit sur mon calendrier scout");
    }


    const intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('DateProchainOpenTables', dateProchainOpenTables);
    
    webhookAgent.handleRequest(intentMap);


});


