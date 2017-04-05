import { config } from "decepticons/config.js"

import { default as Schemator } from "js-data-schema/lib/index.js"

/*

console.log( Schemator )
*/

export class UnicronDataStoreAPI {
    constructor(PersistenceLayer, collectionName, modelName) {

        this.name = collectionName
        this.modelName = modelName
        this.PersistenceLayer = PersistenceLayer
        this.messaging_client = this.PersistenceLayer.messaging_client
        this.branch = this.PersistenceLayer.branch

        this._page_size = 20
        this._currentPage = 1
        /*this._relations = {}
        this._schema = {
            name: {
                type: 'string',
                nullable: true,
                minLength: 5
            }
        }*/

        this.collection = this.PersistenceLayer.defineResource( new config.collections[ this.name ]( ) )
    }
    bind() {}
    sync() {}
    create( record ) {
        const self = this
        return new Promise((resolve, reject) => {
            self._create( record ).then( function( item ) 
            {
                const re = {};
                for(let p in item)
                {
                    if( item.hasOwnProperty(p) )
                        re[ p ] = item[ p ]
                }

                if( self.branch == 'local' )
                {
                    self.messaging_client.publish({
                        action: 'create', // create, update, delete, list,
                        collection: self.name,
                        model: 'owner',
                        data: re
                    })
                }
                
                resolve( item )
            }).catch( (reason) => { reject(reason) } )
        })
    }
    _create( record ) {
        const self = this,
            model = new config.models[ this.modelName ]( record ? record : {} )
            //model = new UnicronBaseModel( record ? record : {} ) // replace by owner model
        console.log( model )
        return self.collection.create( model )
    }
    update() {}
    remove() {}
    get(param) {
        return this.collection.get(param)
    }
    set() {}
    filter() {}
    findAll(c) {
        c = c || {}
        return this.collection.findAll(c)
    }
    validate(store, item, cb) {
        /*var err = validate(item, productSchema)
        if (err) {
          cb(err)
        } else {
          // pass the item along 
          
        }*/
        console.log(item)
        cb(null, item)
    }
}





/**
 * 
 * 

    1 - read model names from famd
    2 - import models schema to namespace
    3 - generate schemas into namespace -> schemator.defineSchema
    4 - create database resources -> store.defineResource


    Schema

    http://www.js-data.io/v2.9/docs/js-data-schema


    EVENTS

    http://www.js-data.io/v2.9/docs/events
    
    DS.beforeCreate
    DS.afterCreate
    DS.beforeUpdate
    DS.afterUpdate
    DS.beforeDestroy
    DS.afterDestroy
    DS.beforeInject
    DS.afterInject
    DS.beforeEject
    DS.afterEject
    DS.beforeReap
    DS.afterReap
    __________________________________


    Schema
    http://www.js-data.io/v2.9/docs/js-data-schema

 *
 *
 * 
 */