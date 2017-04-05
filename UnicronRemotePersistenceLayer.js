import { config } from "decepticons/config.js"

//import { JSData, DataStore } from "../js-data/src/index.js" // js-data 3.0
//import { HttpAdapter } from '../js-data-http/src/index.js' // js-data 3.0
import { default as Schemator } from "js-data-schema/lib/index.js"

import { UnicronMessagingClient } from "decepticons/UnicronMessagingClient.js"

import { UnicronEventSystem } from "decepticons/UnicronEventSystem.js"

import { UnicronDataStoreAPI } from "decepticons/UnicronDataStoreAPI.js"

export class UnicronRemotePersistenceLayer extends JSData.DS{
    constructor(app) {
        
        const adapter = new DSHttpAdapter({
          suffix: '.json',
          basePath: 'http://localhost:8081/api/v1'
        })
        
        super()

        this.branch = "remote"
        
        this.app = app || { }
        
        this.events = this.app.events || new UnicronEventSystem()
        
        
        this.topic = config.topic_data_change // mandatory to be used together UnicronMessagingClient
        
        this.messaging_client = new UnicronMessagingClient(this)
        this.messaging_client.listener = this.listener

        this.registerAdapter('http', adapter, {
            'default': false
        })
        this.events.trigger('onRemoteDatabaseReady')

        this.datastore = {
            "owners": new UnicronDataStoreAPI(this, "owners", "owner"),
            "pets": new UnicronDataStoreAPI(this, "pets", "pet")
        }

        this.app.remote_datastore = this.datastore
    }
    listener( m ){
        const topic = m.type,
            message = m.detail,
            data = message.data,
            collection = message.collection,
            action = message.action

        if( ['create', 'update', 'delete'].contains(action)  )
        {
            console.log("UnicronRemotePersistenceLayer.listener received a valid message")
            console.log("topic: ", topic)
            console.log("message: ", message)

            this.datastore[ collection ][ action ](data).then( function( item ) {
                console.log('listener sent to server')
            });
        }

        //console.log("data: ", JSON.stringify(data))
        //console.log('scope of this: UnicronRemotePersistenceLayer', this)
    }
}

const _root = window || global
((namespace) => {
    'use strict'
})(_root.decepticons = _root.decepticons || {})
((namespace) => {
    'use strict'
})(_root.decepticons.helpers = _root.decepticons.helpers || {})

_root.decepticons.helpers.UnicronRemotePersistenceLayer = UnicronRemotePersistenceLayer