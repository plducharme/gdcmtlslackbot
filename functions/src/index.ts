import * as functions from 'firebase-functions';
import {WebhookClient} from 'dialogflow-fulfillment';
import * as admin from 'firebase-admin';
import {DocumentData} from '@google-cloud/firestore';

'use strict';

process.env.DEBUG = 'dialogflow:debug';


const firebaseApp = admin.initializeApp(functions.config().firebase); 
const db = firebaseApp.firestore();



class OpenTable {
    eventDate : Date;
    subject : string;

}

const openTables : Map<string, OpenTable> = new Map<string, OpenTable>();  

const getNextOpenTables = function () : OpenTable {
    let nextOpenTable = null;
    
    openTables.forEach(openTable => {
        if(nextOpenTable == null) {
            nextOpenTable = openTable;
        } else {
            //if()
        }

    });

    return nextOpenTable;
}  

const convertDataToOpenTable  = function (data : DocumentData, id : string) : OpenTable{
    const opentable : OpenTable = new OpenTable();
    opentable.eventDate = data.eventDate;
    opentable.subject = data.subject;
    
    return opentable;
}   




const getAllScheduledOpenTables = () => {
    db.collection('opentables').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.data;
            openTables.set(doc.id, convertDataToOpenTable(doc.data, doc.id));
        });    
    }).catch((error) => {
        console.log("Error while fetching OpenTables from db " + error);
    });



}



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
        agent.add("Laissez moi regarder ce que j'ai écrit sur mon calendrier scout!");

        
    }


    const intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('DateProchainOpenTables', dateProchainOpenTables);

    getAllScheduledOpenTables();
    
    webhookAgent.handleRequest(intentMap);


});


