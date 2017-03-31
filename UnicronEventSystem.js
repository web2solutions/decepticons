/**
 * [UnicronEventSystem implement application events]
 * @type {constructor}
 */
export class UnicronEventSystem {
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


const _root = window || global;
( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.helpers = _root.decepticons.helpers || {});


_root.decepticons.helpers.UnicronEventSystem = UnicronEventSystem;