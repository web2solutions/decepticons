//import { JSData, DataStore } from "../js-data/src/index.js" // js-data 3.0
//import { HttpAdapter } from '../js-data-http/src/index.js' // js-data 3.0
import { UnicronEventSystem } from "decepticons/UnicronEventSystem.js"
import { UnicronWeapons } from "decepticons/UnicronWeapons.js"
import { UnicronDAO } from "decepticons/UnicronDAO.js"
import { UnicronMessagingClient } from "decepticons/UnicronMessagingClient.js"
import { UnicronSessionSystem } from "decepticons/UnicronSessionSystem.js"
import { UnicronBasicComponent } from "decepticons/UnicronBasicComponent.js"

export class Unicron extends UnicronWeapons {
    constructor(c) {
        const config = c || {},
            app = config.app,
            root = config.root,
            uid = '';

        super();

        this.config = config;
        self.famd = null;
        this.famdURI = config.famd;

        this.environment = 'dev';

        this.app = app || this;
        this.root = root || document.body;

        this.events = new UnicronEventSystem();


        this.topic = 'data.change.local'; // mandatory to be used together UnicronMessagingClient
        this.messaging_client = new UnicronMessagingClient(this);
        // now this.listener and this.publish are available
        this.messaging_client.listener = (message) => {
            //console.log("message", message);
            console.log("message.detail", message.detail);
            //console.log("message.type", message.type);
            //console.log("message.timeStamp",message.timeStamp);
            console.log('scope of this: Unicron');
        };

        this.session = null;
    }

    start(fnCallBack) {
        const self = this;
        self.events.trigger('onApplicationStart');

        window.UnicronDao = new UnicronDAO(this);
        window.UnicronDao.turnDatabaseOn();


        self.session = new UnicronSessionSystem();
        self.events.trigger('onSessionStart');        

        self.fetch(self.famdURI, (request) => {
            self.famd = JSON.parse(request.responseText);
            //console.log( self.famd );

            // now use FAMD 
            self.events.trigger('onApplicationReady');
            if (fnCallBack) fnCallBack();
        });
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