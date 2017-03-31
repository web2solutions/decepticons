//import { JSData, DataStore } from "../js-data/src/index.js";
//import { HttpAdapter } from '../js-data-http/src/index.js';

const topic_data_change_local = 'data.change.local';
const topic_data_change_remote = 'data.change.remote';

/**
 * [UnicronWeapons util class]
 * @type {constructor}
 */
class UnicronWeapons {
    constructor() {
        /**
         * [uid description]
         * @type {guid}
         */
        this.uid = this.guid();
        if (typeof window.___temp_Unicron === 'undefined') window.___temp_Unicron = {};
        /**
         * [window.___temp_Unicron temporary cache]
         * @type {Associative array}
         */
        window.___temp_Unicron[this.uid] = {
            es5modules: {}
        };
        /**
         * [onDemand Queue used to load ondemand files.]
         * @type {Object}
         */
        this.onDemand = {
            queue: []
        };
        /**
         * [_queue_active is the ondemand queue being processed]
         * @type {Boolean}
         */
        this._queue_active = false;
        /**
         * [_es5modules quick access to loaded es5 modules]
         * @type {Associative array}
         */
        this._es5modules = {};


    }

    /**
     * [load description]
     * @param  {[type]}   url      [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   update   [description]
     * @return {[type]}            [description]
     */
    load(url, callback, update) {
        const self = this;

        update = update || false;

        if (Array.isArray(url)) {
            self._enqueue(url.map(function(path) {
                return {
                    url: path,
                    callback: callback,
                    update: update
                };
            }));
        } else {
            self._enqueue({
                url: url,
                callback: callback,
                update: update
            });
        }

        self.process_queue();
    }

    _requestES5Module(url, callback, update) {
        let self = this,
            arrType, type, s, nodeType, node, tag_id = url.split("?")[0];

        arrType = url.split(".");
        type = arrType[arrType.length - 1];

        if (!update) {
            if (document.getElementById(url) != null) {
                callback();
                return;
            }
        }

        if (url.indexOf(".css") != -1) {
            nodeType = "link";
            node = document.createElement(nodeType);
            node.setAttribute("rel", "stylesheet");
            node.setAttribute("type", "text/css");
        } else {
            nodeType = "script";
            node = document.createElement(nodeType);
            node.setAttribute("type", "text/javascript");
        }

        node.setAttribute("id", url);

        self.fetch(url, (request) => {

            let responseTex = request.responseText,
                uid = self.uid;
            node.textContent = `window.___temp_Unicron["${uid}"].es5modules["${url}"] = (function(_root) {  ${responseTex} })(window);`;
            document.getElementsByTagName('head')[0].appendChild(node);
            self._es5modules[url] = window.___temp_Unicron[uid].es5modules[url];
            callback();

        });
    }

    _enqueue(c) {
        this.onDemand.queue.push(c);
    }

    process_queue() {
        let self = this,
            first_on_queue = '';

        if (self._queue_active)
            return;

        if (self.onDemand.queue.length > 0) {
            self._queue_active = true;

            first_on_queue = self.onDemand.queue.shift();

            self._requestES5Module(first_on_queue.url, () => {

                first_on_queue.callback(self._es5modules[first_on_queue.url]);
                self.process_queue();

            }, first_on_queue.update);
        } else {
            self._queue_active = false;
        }
    }

    fetch(url, fnCallBack) {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200) {
                if (fnCallBack) fnCallBack(request);
            }
        }
    }

    uid() {
        return ((Date.now() & 0x7fff).toString(32) + (0x100000000 * Math.random()).toString(32));
    }

    S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    guid() {
        var self = this;
        return (self.S4() + self.S4() + "-" + self.S4() + "-" + self.S4() + "-" + self.S4() + "-" + self.S4() + self.S4() + self.S4());
    }
}



/**
 * [UnicronEventSystem implement application events]
 * @type {constructor}
 */
class UnicronEventSystem {
    constructor(parentNodeElement) {
        this.root = parentNodeElement || document;
        this._events = {};

        this.attach = this.on;
        this.attachEvent = this.on;

        this.dispatch = this.trigger;
        this.dispatchEvent = this.trigger;
    }
    on(name, handler, c) {
        const self = this;
        let event = null;
        c = c || {};
        if (typeof self._events[name] === 'undefined') {
            if (document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(name, true, true);
            } else {
                event = new Event(name); // CustomEvent
            }
            self._events[name] = {
                event: event,
                handlers: []
            };
        }
        self._events[name].handlers.push(handler);
        if (name == 'onApplicationStart') {
            self.root.addEventListener(name, function(e) {
                handler.call(self, e);
            }, false);
        } else if (name == 'onRegisterTopic') {
            console.log('--- onRegisterTopic');
            self.root.addEventListener(name, function(e) {
                console.log('xxxxxx onRegisterTopic');
                handler.call(self, e);
            }, false);

        }
        //
        else if (name == 'onComponentStart') {
            self.root.addEventListener(name, function(e) {
                handler.call(self, e);
            }, false);

        } else if (name == 'onApplicationReady') {
            self.root.addEventListener(name, function(e) {
                handler.call(self, e);
            }, false);

        } else if (name == 'onSessionStart') {
            self.root.addEventListener(name, function(e) {
                handler.call(self, e);
            }, false);
        } else if (name == 'onLocalDatabaseReady') {
            self.root.addEventListener(name, function(e) {
                handler.call(self, e);
            }, false);
        } else if (name == 'onRemoteDatabaseReady') {
            self.root.addEventListener(name, function(e) {
                handler.call(self, e);
            }, false);
        } else {
            throw new Error('Can not add listener to an unkown event');
        }
    }
    trigger(name) {
        var self = this;
        if (self._events[name]) self.root.dispatchEvent(self._events[name].event);
    };
}


class UnicronSubscriber extends UnicronWeapons {
    constructor(topic, listener, $scope) {
        super();

        if (typeof topic === 'undefined')
            throw new Error('Can not create a subscriber without a topic');

        if (typeof listener === 'undefined')
            throw new Error('Can not create a subscriber without a listener');

        this.id = this.guid();
        this.topic = topic;

        if (this.isValidHandler(listener)) {
            this.listener = listener.bind($scope || this);
        } else
            this.listener = () => {};
    }
    isValidHandler(handler) {
        let error = null;
        if (typeof handler === 'function') {
            return true;
        }
        error = new Error('Attempt to register an invalid handler with the subscriber.');
        error.handler = handler;
        throw error;
    }
}

class UnicronPubSub {
    constructor(el) {
        this.node = el || document;
        this.subscribers = {};
        this.topics = [];
        this.events = new UnicronEventSystem();

        /**
         * mandatory topics to register
         */
        this._registerTopic(topic_data_change_local);
        this._registerTopic(topic_data_change_remote);
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
            validEvents = ['create', 'update', 'delete', 'list'];

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
            datetime: (new Date().getTime()),
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
const unicron_pub_sub = new UnicronPubSub();

class UnicronMessagingClient {
    constructor(entity) {
        this.pubsub = unicron_pub_sub;
        this.entity = entity;
        entity.subscriber = this.subscriber;
        entity.publish = this.publish;

        this.topic = entity.topic || 'data.change.local';

        //this.listener = this._listener.bind( this.entity );

        this._subscribe();


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
        this.pubsub.subscribe(this.topic, this._listener, this.entity);
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


class DAO {
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




class UnicronSessionSystem {
    get(key, def) {
        var value = window.sessionStorage.getItem(key);
        var data;
        try {
            data = value ? JSON.parse(value) : def;
        } catch (e) {
            data = def;
        }
        return data;
    }
    set(key, value) {
        value = JSON.stringify(value);
        window.sessionStorage.setItem(key, value);
    }
}


class UnicronBasicComponent {
    constructor(app) {
        //super();
        this.app = app;
        this._listenToTopic = topic_data_change_remote;
        this._publishToTopic = topic_data_change_local;
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



class Unicron extends UnicronWeapons {
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

        window.UnicronDao = new DAO(this);
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





export const decepticons = (() => {
    return {
        Unicron: Unicron,
        UnicronBasicComponent: UnicronBasicComponent
    };
})();