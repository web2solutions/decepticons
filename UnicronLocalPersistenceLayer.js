import { config } from "decepticons/config.js"

//import { JSData, DataStore } from "../js-data/src/index.js" // js-data 3.0
//import { HttpAdapter } from '../js-data-http/src/index.js' // js-data 3.0

import { UnicronMessagingClient } from "decepticons/UnicronMessagingClient.js"

import { UnicronEventSystem } from "decepticons/UnicronEventSystem.js"

import { UnicronDataStoreAPI } from "decepticons/UnicronDataStoreAPI.js"

export class UnicronLocalPersistenceLayer extends JSData.DS{
    constructor(app) {

        const adapter = new DSLocalForageAdapter()
        
        super()

        this.branch = "local"
        
        this.app = app || { }
        
        this.events = this.app.events || new UnicronEventSystem()
        

        this.topic = config.topic_data_change // mandatory to be used together UnicronMessagingClient
        
        this.messaging_client = new UnicronMessagingClient(this)
        this.messaging_client.listener = this.listener

        this.registerAdapter('lf', adapter, {
            'default': true
        })

        this.events.trigger('onLocalDatabaseReady')

        this.datastore = {
            "owner": new UnicronDataStoreAPI(this, "owner", "owner"),
            "pet": new UnicronDataStoreAPI(this, "pet", "pet")
        }

        this.app.datastore = this.datastore
    }
    listener( m ){
        const topic = m.type,
            message = m.detail,
            data = message.data,
            collection = message.collection,
            action = message.action

        console.log("topic: ", topic)
        console.log("message: ", message)

        //console.log("data: ", JSON.stringify(data))
        //console.log('scope of this: UnicronLocalPersistenceLayer', this)
    }
}

const _root = window || global
((namespace) => {
    'use strict'
})(_root.decepticons = _root.decepticons || {})
((namespace) => {
    'use strict'
})(_root.decepticons.helpers = _root.decepticons.helpers || {})

_root.decepticons.helpers.UnicronLocalPersistenceLayer = UnicronLocalPersistenceLayer