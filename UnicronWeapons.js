
/**
 * [UnicronWeapons util class]
 * @type {constructor}
 */
export class UnicronWeapons {
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


const _root = window || global;
( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.helpers = _root.decepticons.helpers || {});

_root.decepticons.helpers.UnicronWeapons = UnicronWeapons;