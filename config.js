// import all application collections here
import { ownersDataCollection } from "decepticons/collections/owners.js"
import { petsDataCollection } from "decepticons/collections/pets.js"


import { UnicronBaseModel } from "decepticons/UnicronBaseModel.js"

const _conf = {
	topic_main: "Unicron.queue",
	topic_data_change: "data.change",
	topic_data_change_local: "data.change.local",
	topic_data_change_remote: "data.change.remote",
	collections: {
	    "owners" : ownersDataCollection,
	    "pets" : petsDataCollection
	},
	models: {
	    "owner" : UnicronBaseModel,
	    "pet" : UnicronBaseModel
	}
};
export const config = ( () => {
	return _conf 
} )()