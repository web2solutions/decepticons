import { UnicronMessagingClient } from "decepticons/UnicronMessagingClient"

export class UnicronDAO {
    constructor(app) {
        this.app = app;
        this.dao = JSData;
        this.events = this.app.events;
        this.dao_indexeddb_adapter = null;
        this.dao_http_adapter = null;
        this.local_database = null;
        this.remote_database = null;
        this.topic = 'data.change.local'; // mandatory to be used together UnicronMessagingClient
        this.messaging_client = new UnicronMessagingClient(this);
        this.messaging_client.listener = (message) => {
            //console.log("message", message);
            console.log("message.detail", message.detail);
            //console.log("message.type", message.type);
            //console.log("message.timeStamp",message.timeStamp);
            console.log('scope of this: DAO');
        };
        // now this.listener and this.publish are available
    }
    turnDatabaseOn() {
        const enable_local_database = this.app.config.enable_local_database || false,
            enable_remote_database = this.app.config.enable_remote_database || false;

        if (enable_local_database) this.dao_indexeddb_adapter = new DSLocalForageAdapter();
        if (enable_remote_database) this.dao_http_adapter = new DSHttpAdapter();
        
        /*
        js-data 3.0
        if (enable_remote_database) {
            this.dao_http_adapter = new HttpAdapter();
            this.remote_database = new DataStore();

            this.remote_database.registerAdapter('http', this.dao_http_adapter, { 'default': true });

            
            this.events.trigger('onRemoteDatabaseReady');
        }*/

        if (this.dao_indexeddb_adapter) {
            this.local_database = new this.dao.DS();
            this.local_database.registerAdapter('lf', this.dao_indexeddb_adapter, {
                default: true
            });
            this.events.trigger('onLocalDatabaseReady');
        }

        if (this.dao_http_adapter) {
            this.remote_database = new this.dao.DS();
            this.remote_database.registerAdapter('http', this.dao_http_adapter, {
                'default': true
            });
            this.events.trigger('onRemoteDatabaseReady');
        }

        this.app.local_database = this.local_database;
        this.app.remote_database = this.remote_database; 
    }
}


const _root = window || global;
( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.helpers = _root.decepticons.helpers || {});

_root.decepticons.helpers.UnicronDAO = UnicronDAO;