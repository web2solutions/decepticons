
import { config as app_config } from "decepticons/config.js"
import { UnicronEventSystem } from "decepticons/UnicronEventSystem.js"
import { UnicronWeapons } from "decepticons/UnicronWeapons.js"
import { UnicronLocalPersistenceLayer } from "decepticons/UnicronLocalPersistenceLayer.js"
import { UnicronRemotePersistenceLayer } from "decepticons/UnicronRemotePersistenceLayer.js"
import { UnicronMessagingClient } from "decepticons/UnicronMessagingClient.js"
import { UnicronSessionSystem } from "decepticons/UnicronSessionSystem.js"
import { UnicronBasicComponent } from "decepticons/UnicronBasicComponent.js"

export class Unicron extends UnicronWeapons {
    constructor(c) {
        const config = c || {},
            app = config.app,
            root = config.root,
            uid = ''

        super()
        
        this.uid = this.guid();

        this.config = config
        self.famd = null
        this.famdURI = config.famd

        this.environment = config.environment
        
        // is this an offline application?
        this.offline_application = config.offline_application

        this.app = app || this
        this.root = root || document.body

        this.events = new UnicronEventSystem()

        this.topic = app_config.topic_main // mandatory to be used together UnicronMessagingClient
        this.messaging_client = new UnicronMessagingClient(this)
        // now this.listener and this.publish are available
        this.messaging_client.listener = this.listener

        this.session = null
    }

    start(fnCallBack) {
        const self = this
        self.events.trigger('onApplicationStart')

        window.UnicronLocalPersistenceLayer = new UnicronLocalPersistenceLayer(this)
        console.log(window.UnicronLocalPersistenceLayer)

        if( ! this.offline_application )
        {
            window.UnicronRemotePersistenceLayer = new UnicronRemotePersistenceLayer(this)
            console.log(window.UnicronRemotePersistenceLayer)
        }
        


        self.session = new UnicronSessionSystem()
        self.events.trigger('onSessionStart')        

        self.fetch(self.famdURI, (request) => {
            self.famd = JSON.parse(request.responseText)
            //console.log( self.famd )

            // now use FAMD 
            self.events.trigger('onApplicationReady')
            if (fnCallBack) fnCallBack()
        })
    }

    listener(){
        //console.log("message", message)
        console.log("message.detail", message.detail)
        //console.log("message.type", message.type)
        //console.log("message.timeStamp",message.timeStamp)
        console.log('scope of this: Unicron')
    }

    destroy() {
        // remote database
        // local database
        // event system
        // session
        // temporary window scope
        // DAO
        // dao_http_adapter
        // dao_indexeddb_adapter
    }
}