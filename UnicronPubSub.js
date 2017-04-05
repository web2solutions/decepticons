import { UnicronEventSystem } from 'decepticons/UnicronEventSystem.js'
import { config } from "decepticons/config.js"
import { UnicronSubscriber } from "decepticons/UnicronSubscriber.js"



const _root = window || global


export class UnicronPubSub {
    constructor(el) {
        this.node = el || document;
        this.subscribers = {};
        this.topics = [];
        this.events = new UnicronEventSystem();

        /**
         * mandatory topics to register
         */
        this._registerTopic(config.topic_main);
        this._registerTopic(config.topic_data_change);
        this._registerTopic(config.topic_data_change_local);
        this._registerTopic(config.topic_data_change_remote);
    }
    _registerTopic(topic) {
        if (typeof topic === 'undefined')
            throw new Error('Can not register the topic');
        if (!this.topics.contains(topic)) {
            this.topics.push(topic);
            this.events.trigger('onRegisterTopic');
        }
    }
    _isTopic(topic) {
        //console.log('topic: ', topic);
        //console.log( 'this.topics', this.topics );
        return this.topics.contains(topic);
    }
    _compose(message, topic) {
        let composed_message = null,
            validEvents = ['create', 'update', 'delete', 'list', 'reject'];

        if (typeof message === 'undefined')
            throw new Error('Can not compose without a message');

        if (typeof topic === 'undefined')
            throw new Error('Can not compose without a topic');

        if (!validEvents.contains(message.action))
            throw new Error('Invalid message action');

        composed_message = {
            action: message.action, // create, update, delete, list,
            collection: message.collection,
            model: message.model,
            data: message.data,
            datetime: new Date().toISOString(),
            to: 'server', // client, server,
            from: message.from,
            topic: topic // 'data.change.remote', 'data.change.local'
        };
        return composed_message;
    }
    publish(topic, message) {
        //console.log('UnicronPubSub.publish');
        //console.log('topic:', topic);
        //console.log('message: ', message);
        if (typeof topic === 'undefined')
            throw new Error('Can not publish without a topic');

        if (typeof message === 'undefined')
            throw new Error('Can not publish without a message');

        if (!this._isTopic(topic))
            throw new Error('Can not publish to a unregistered topic');

        this.node.dispatchEvent(new CustomEvent(topic, {
            detail: this._compose(message, topic)
        }));
    }
    subscribe(topic, listener, $scope) {
        if (!this._isTopic(topic))
            throw new Error('Can not subscribe to a unregistered topic: ' + topic);

        //console.log( 'XXXXXXXXXX UnicronPubSub subscribe' );

        const subscriber = new UnicronSubscriber(topic, listener, $scope);

        //console.log( subscriber );

        this.subscribers[subscriber.id] = subscriber;

        this.node.addEventListener(
            this.subscribers[subscriber.id].topic,
            this.subscribers[subscriber.id].listener,
            0
        );

        return subscriber;
    }
    unsubscribe(id) {
        let subscriber;

        if (typeof id === 'undefined')
            throw new Error('Can not unsubscribe without a subscriber id');

        subscriber = this.subscribers[id];

        this.node.removeEventListener(
            subscriber.topic,
            subscriber.listener,
            0
        );

        delete this.subscribers[id];
    }
}


( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.helpers = _root.decepticons.helpers || {});

( (namespace) => { 'use strict'; })(_root.decepticons.helpers.messenger = _root.decepticons.helpers.messenger || {});
_root.decepticons.helpers.messenger.UnicronPubSub = UnicronPubSub;