const mongoose = require('mongoose');
const addressSchema = mongoose.Schema({
	name:{
		type: String,
	},
	address:{
		type: String,
	},
	phone: {
		type: String,
	},
	customer_id:{
		type: Number,
	},
});
const address = module.exports = mongoose.model('address', addressSchema);
module.exports.getAddressByCustomer = async function(customer_id){
	const query = {customer_id:customer_id};
	return await address.find(query).exec();
}