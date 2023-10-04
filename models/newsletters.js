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
module.exports = mongoose.model('newsletters', newsletterSchema);
module.exports.createNewsLetter = async function(newsletters){
	return await newsletters.save();
}