import { UnicronWeapons } from "decepticons/UnicronWeapons.js"

export class UnicronBaseModel {
    constructor(obj) {
        for( var p in obj )
        {
            this[ p ] = obj[ p ];
        }
        if (obj) {
            if (obj.id) {
                this.id = obj.id
            } else {
                this.id = ( new UnicronWeapons() ).guid()
            }
            this.active = (obj.active === null || obj.active === undefined) ? true : obj.active
            this.createdAt = obj.createdAt || new Date().toISOString()
            this.updatedAt = obj.updatedAt || new Date().toISOString()
        } else {
            this.id = (new UnicronWeapons()).guid()
            this.active = true
            this.createdAt = new Date().toISOString()
            this.updatedAt = null

        }
    }
}