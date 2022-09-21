var mongoose = require('mongoose');
var socialMediasSchema = mongoose.Schema({
	name:{
		type: String,
	},
	link:{
		type: String,
	},
	icon:{
		type: String,
	},
	icon_font:{
		type: String,
	},
	customer_id:{
		type: Number,
	},
});
var socialmedias = module.exports = mongoose.model('socialmedias', socialMediasSchema);
module.exports.getSocialMediasByCustomer = async function(customer_id){
	var query = {customer_id:customer_id};
	return await socialmedias.find(query).exec();
}
