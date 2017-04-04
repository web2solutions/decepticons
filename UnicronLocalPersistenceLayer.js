import { default as Schemator } from "js-data-schema/lib/index.js"

import { UnicronMessagingClient } from "decepticons/UnicronMessagingClient.js"

import { UnicronEventSystem } from "decepticons/UnicronEventSystem.js"

import { UnicronDataStoreAPI } from "decepticons/UnicronDataStoreAPI.js"

export class UnicronLocalPersistenceLayer extends JSData.DS{
    constructor(app) {
        const adapter = new DSLocalForageAdapter()
        
        super();
        
        this.app = app || { };
        
        this.events = this.app.events || new UnicronEventSystem();
        
        
        this.topic = 'data.change.local'; // mandatory to be used together UnicronMessagingClient
        
        this.messaging_client = new UnicronMessagingClient(this);
        this.messaging_client.listener = (message) => {
            //console.log("message", message);
            console.log("message.detail", message.detail);
            //console.log("message.type", message.type);
            //console.log("message.timeStamp",message.timeStamp);
            console.log('scope of this: UnicronLocalPersistenceLayer');
        };

        this.registerAdapter('http', adapter, {
            'default': false
        });
        this.events.trigger('onLocalDatabaseReady');

        this.datastore = {
            "owners": new UnicronDataStoreAPI(this, "owners"),
            "pets": new UnicronDataStoreAPI(this, "pets")
        };

        this.app.datastore = this.datastore;
    }
}



/*

class test extends JSData.DS{
    constructor(){
        super();
    }
}

console.log( new test() );

console.log( Schemator );
*/

const _root = window || global;
((namespace) => {
    'use strict';
})(_root.decepticons = _root.decepticons || {});
((namespace) => {
    'use strict';
})(_root.decepticons.helpers = _root.decepticons.helpers || {});

_root.decepticons.helpers.UnicronLocalPersistenceLayer = UnicronLocalPersistenceLayer;





/**
 * 
 * 

    1 - read model names from famd
    2 - import models schema to namespace
    3 - generate schemas into namespace -> schemator.defineSchema
    4 - create database resources -> store.defineResource


    Schema

    http://www.js-data.io/v2.9/docs/js-data-schema


    EVENTS

    http://www.js-data.io/v2.9/docs/events
    
    DS.beforeCreate
    DS.afterCreate
    DS.beforeUpdate
    DS.afterUpdate
    DS.beforeDestroy
    DS.afterDestroy
    DS.beforeInject
    DS.afterInject
    DS.beforeEject
    DS.afterEject
    DS.beforeReap
    DS.afterReap
    __________________________________


    Schema
    http://www.js-data.io/v2.9/docs/js-data-schema

 *
 *
 * 
 */