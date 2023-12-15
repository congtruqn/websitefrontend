const mongoose = require('mongoose');
require('../models/banner_elements');
const bannersSchema = mongoose.Schema({
	banner_name:{
		type: String,
	},
	banner_title:{
		type: String,
	},
	banner_description:{
		type: String,
	},
	image_path:{
		type: String,
	},
	image:{
		type: String,
	},
	customer_id:{
		type: Number,
	},
	banner_elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'banner_elements' }]
});
const banners = module.exports = mongoose.model('banner', bannersSchema);
module.exports.getAllBanners = async function(customerId){
	const query = { customer_id: customerId };
	return await banners.find(query).populate('banner_elements').exec();;
}

