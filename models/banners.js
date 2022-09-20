var mongoose = require('mongoose');
// User Schema
var bannersSchema = mongoose.Schema({
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
	
});
var banners = module.exports = mongoose.model('banners', bannersSchema);
module.exports.getbannersById = function(id, callback){
	var query = {_id:id};
	banners.findOne(query, callback);
}
module.exports.getAllbanners = function(page,per_page,callback){
	var query = {};
	banners.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getbannerbycustomer = function(customer_id,callback){
	var query = {customer_id:customer_id};
	banners.find(query, callback);
}
