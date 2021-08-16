var mongoose = require('mongoose');
// User Schema
var customersSchema = mongoose.Schema({
	name:{
		type: String
	},
	phone:{
		type: String,
	},
	email:{
		type: String,
	},
	template_name:{
		type: String,
	},
	status:{
		type: Number,
	},
});
var customers = module.exports = mongoose.model('customers', customersSchema);
module.exports.createcustomers = function(newcustomers, callback){
	newcustomers.save(callback);
}
module.exports.editcustomers = function(id,newcustomers, callback){
	customers.findByIdAndUpdate(id, newcustomers,callback);
}
module.exports.findOneAndUpdatecustomers = function(query,newcustomers, callback){
	customers.findOneAndUpdate(query, newcustomers, callback);
}
module.exports.delcustomers = function(id,callback){
	customers.findByIdAndRemove(id, function(err, customerss) {
  	if (err) throw err;
  		console.log(customerss);
	});
}
module.exports.getcustomersById = function(id, callback){
	var query = {_id:id};
	customers.findOne(query, callback);
}
module.exports.getAllcustomers = function(page,per_page,callback){
	var query = {};
	customers.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getallcustomersnotpage = function(callback){
	var query = {};
	customers.find(query, callback);
}
module.exports.countcustomers = function(callback){
	var query = {};
	customers.count(query, callback);
}
module.exports.getAllcustomersByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	customers.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'customers_id': -1 });
}
module.exports.getcustomersByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	customers.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}