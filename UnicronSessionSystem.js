export class UnicronSessionSystem {
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


const _root = window || global;
( (namespace) => { 'use strict'; })(_root.decepticons = _root.decepticons || {});
( (namespace) => { 'use strict'; })(_root.decepticons.helpers = _root.decepticons.helpers || {});

_root.decepticons.helpers.UnicronSessionSystem = UnicronSessionSystem;