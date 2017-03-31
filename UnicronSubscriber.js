import { UnicronWeapons } from 'decepticons/UnicronWeapons.js'

export class UnicronSubscriber extends UnicronWeapons {
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

const _root = window || global;
( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.helpers = _root.decepticons.helpers || {});

( (namespace) => { 'use strict'; })(_root.decepticons.helpers.messenger = _root.decepticons.helpers.messenger || {});
_root.decepticons.helpers.messenger.UnicronSubscriber = UnicronSubscriber;