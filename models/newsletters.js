const mongoose = require('mongoose');
const newsletterSchema = mongoose.Schema({
	name:{
		type: String,
	},
	email:{
		type: String,
	},
	customer_id:{
		type: Number,
	},
});
const newsletters = module.exports = mongoose.model('newsletters', newsletterSchema);
module.exports.createNewsLetter = async function(newsletters){
	return await newsletters.save();
}
module.exports.getNewsLetter = async function(customer_id, email){
	const query = {customer_id:customer_id, email: email};
	return await newsletters.findOne(query).exec();;
}