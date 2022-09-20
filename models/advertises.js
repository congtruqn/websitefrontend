var mongoose = require('mongoose');
var advertisesSchema = mongoose.Schema({
	name:{
		type: String,
	},
	position:{
		type: String,
	},
	link:{
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
var advertises = module.exports = mongoose.model('advertises', advertisesSchema);
module.exports.getAdvertisesByCustomer =async function(customer_id){
	var query = {customer_id:customer_id};
	return await advertises.find(query).exec();
}