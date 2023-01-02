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
module.exports.getPartnerByCustomer = async function(customer_id){
	var query = {customer_id:customer_id};
	return await partners.find(query).exec();
}