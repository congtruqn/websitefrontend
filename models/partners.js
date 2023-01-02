var mongoose = require('mongoose');
var partnersSchema = mongoose.Schema({
	name:{
		type: String,
	},
	email:{
		type: String,
	},
	address:{
		type: String,
	},
	phone:{
		type: String,
	},
	image_path:{
		type: String,
	},
	image:{
		type: String,
	},
	url:{
		type: String,
	},
	create_date:{
		type: Number,
	},
	customer_id:{
		type: Number,
	},
	
});
var partners = module.exports = mongoose.model('partners', partnersSchema);
module.exports.getpartnersbycustomer = function(customer_id,page,per_page, callback){
	var query = {customer_id:customer_id};
	partners.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}