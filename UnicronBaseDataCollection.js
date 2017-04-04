export class UnicronBaseDataCollection {
    constructor() {
        this.name = "basec_ollection";
        this.relations = {};
    }
    afterCreate() {
        console.log('afterCreate')
    }
    beforeCreate(resource, data, cb) {
        // do something specific for this method call
        cb(null, data);
    }
}