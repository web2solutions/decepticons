import { UnicronPubSub } from 'decepticons/UnicronPubSub.js'
import { config } from "decepticons/config.js"

export class UnicronMessagingClient {
    constructor(entity) {
        this.pubsub = new UnicronPubSub();
        this.entity = entity;
        

        this.topic = entity.topic || config.topic_main;

        //this.listener = this._listener.bind( this.entity );

        this._subscribe();

        entity.subscriber = this.subscriber;
        entity.publish = this.publish;


    }
    _listener(message) {
        //console.log("message", message);
        console.log("message.detail", message.detail);
        //console.log("message.type", message.type);
        //console.log("message.timeStamp",message.timeStamp);
        console.log('scope of this:::: ', this);
    }
    get listener() {
        return this._listener;
    }
    set listener(newFunction) {
        if (newFunction)
            this._listener = newFunction.bind(this.entity);

        this.pubsub.unsubscribe(this.subscriber.id);

        this._subscribe();
    }
    _subscribe() {
        //console.log( 'XXXXXXXXXX UnicronMessagingClient _subscribe' );
        this.subscriber = this.pubsub.subscribe(this.topic, this._listener, this.entity);
    }
    publish(message, topic) {
        topic = topic || this.topic;
        message.from = this.subscriber.uid;
        this.pubsub.publish(topic, message);
    }
    _registerTopic() {
        this.pubsub._registerTopic(topic);
    }
}

const _root = window || global;
( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.helpers = _root.decepticons.helpers || {});

( (namespace) => { 'use strict'; })(_root.decepticons.helpers.messenger = _root.decepticons.helpers.messenger || {});
_root.decepticons.helpers.messenger.UnicronMessagingClient= UnicronMessagingClient;