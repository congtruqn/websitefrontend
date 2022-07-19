var mongoose = require('mongoose');
var policysSchema = mongoose.Schema({
	name:{
		type: String,
	},
	description:{
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
var policys = module.exports = mongoose.model('policies', policysSchema);
module.exports.getPolicyByCustomer = async function(customer_id){
	var query = {customer_id:customer_id};
	return await policys.find(query).exec();;
}