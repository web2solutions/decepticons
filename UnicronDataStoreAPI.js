// import all application collections here
import { ownersDataCollection } from "decepticons/collections/owners.js"
import { petsDataCollection } from "decepticons/collections/pets.js"



import { UnicronBaseModel } from "decepticons/UnicronBaseModel.js" 
// replace by owner model


// setup a collection of collections and it respective name and namespace
const collections = {
    "owners" : ownersDataCollection,
    "pets" : petsDataCollection
}


export class UnicronDataStoreAPI {
    constructor(PersistenceLayer, collectionName) {

        this.name = collectionName;
        this.PersistenceLayer = PersistenceLayer;
        this.messaging_client = this.PersistenceLayer.messaging_client;

        this._page_size = 20;
        this._currentPage = 1;
        /*this._relations = {};
        this._schema = {
            name: {
                type: 'string',
                nullable: true,
                minLength: 5
            }
        };*/
        
        this.collection = null;
        
        const collectionObj = new collections[ this.name ]( );

        this.collection = this.PersistenceLayer.defineResource( collectionObj );
    }
    bind() {}
    sync() {}
    create( record ) {
        const self = this;
        return new Promise((r, reject) => {
            self._create( record ).then( function( item ) {
                //console.log( self.messaging_client );


                self.messaging_client.publish({
                    action: 'create', // create, update, delete, list,
                    collection: self.name,
                    model: 'owner',
                    data: record,
                });


                r( item );
            });
        });
    }
    _create( record ) {
        const self = this,
            model = new UnicronBaseModel( record ? record : {} ); // replace by owner model
        //console.log( model )
        return self.collection.create( model );
    }
    update() {}
    remove() {}
    get(param) {
        return this.collection.get(param);
    }
    set() {}
    filter() {}
    findAll(c) {
        c = c || {};
        return this.collection.findAll(c)
    }
    validate(store, item, cb) {
        /*var err = validate(item, productSchema);
        if (err) {
          cb(err);
        } else {
          // pass the item along 
          
        }*/
        console.log(item);
        cb(null, item);
    }
}