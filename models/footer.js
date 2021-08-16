var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
// User Schema
var footerSchema = mongoose.Schema({
	footer_name:{
		type: String,
	},
	footer_url:{
		type: String,
	},
	footer_position:{
		type: Number,
	},
	create_date:{
		type: Number,
	},
	footer_child:[{
		child_name: String,
     	child_url: String,
     	child_position: Number,
	}],
	customer_id:{
		type: Number,
	},
	
});
var footer = module.exports = mongoose.model('footer', footerSchema);
module.exports.getfooterById = function(id, callback){
	var query = {_id:id};
	footer.findOne(query, callback);
}
module.exports.getfooterbycustomer = function(customer_id, callback){
	var query = {customer_id:customer_id};
	footer.find(query, callback);
}