import { config } from "decepticons/config.js"



class UnicronBasicComponent {
    constructor(app) {
        //super();
        this.app = app;
        this._listenToTopic = config.topic_data_change_remote;
        this._publishToTopic = config.topic_data_change_local;
        //this.id = c.guid();

        this.events = this.app.events;

        this.session = this.app.session;

        this.events.trigger('onComponentStart');

        this.topic = 'data.change.local'; // mandatory to be used together UnicronMessagingClient
        this.messaging_client = new UnicronMessagingClient(this);
        // now this.listener and this.publish are available
        this.messaging_client.listener = (message) => {
            //console.log("message", message);
            console.log("message.detail", message.detail);
            //console.log("message.type", message.type);
            //console.log("message.timeStamp",message.timeStamp);
            console.log('scope of this: UnicronBasicComponent');
        };


    }

    destroy() {
        // destroy listener
    }

    _start() {
        // register component listener as a PubSub Listener

    }
}

const _root = window || global
( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.components = _root.decepticons.components || {});

_root.decepticons.components.UnicronBasicComponent = UnicronBasicComponent;