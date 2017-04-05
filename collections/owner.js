
import { UnicronBaseDataCollection }  from "decepticons/UnicronBaseDataCollection.js"

// generated via YO
export class ownerDataCollection extends UnicronBaseDataCollection {
    constructor() {
        super();
        this.name = "owner";
        this.relations = {
            "hasMany": {
                "pet": {
                    "localField": "pet",
                    "foreignKey": "ownerId"
                }
            }
        };
    }
    afterCreate() {
        console.log('afterCreate')
    }
    beforeCreate(resource, data, cb) {
        console.log('beforeCreate')
        cb(null, data);
    }
    afterUpdate(resource, data, cb) {
        console.log('afterUpdate')
        cb(null, data);
    }
    beforeUpdate(resource, data, cb) {
        console.log('beforeUpdate')
        cb(null, data);
    }
    afterCreateInstance(resource, data) {
        console.log('afterCreateInstance')
        return data;
    }
    afterDestroy(Resource, data, cb) {
        console.log('afterDestroy')
        cb(null, data);
    }
    afterEject(Resource, data) {
        console.log('afterEject')
        return data;
    }
}