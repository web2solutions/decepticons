// import all application collections here
import { ownerDataCollection } from "decepticons/collections/owner.js"
import { petDataCollection } from "decepticons/collections/pet.js"


import { UnicronBaseModel } from "decepticons/UnicronBaseModel.js"

const _conf = {
	environment: "dev",
	// is this an offline application?
    offline_application: true,
	topic_main: "Unicron.queue",
	topic_data_change: "data.change",
	topic_data_change_local: "data.change.local",
	topic_data_change_remote: "data.change.remote",
	collections: {
	    "owner" : ownerDataCollection,
	    "pet" : petDataCollection
	},
	models: {
	    "owner" : UnicronBaseModel,
	    "pet" : UnicronBaseModel
	}
};
export const config = ( () => {
	return _conf 
} )()