var mongoose = require("mongoose")
var ObjectId = require('mongoose').Types.ObjectId;
var productmoreinfoSchema = mongoose.Schema({
	name: {
		type: String,
	},

	default_value: [{
		default_id:String,
		default_name:String,
		title:String,
		keyword:String,
		description:String,
		seo_url:String
	}],
	type:{
		type: Number,
	},
	customer_id:{
		type: Number,
	},
	status:{
		type: Number,
	},
});

var productmoreinfo = module.exports = mongoose.model('productsmoreinfo', productmoreinfoSchema);

module.exports.createproductmoreinfo = function(newproductmoreinfo, callback){
	newproductmoreinfo.save(callback);
}

module.exports.editproductmoreinfo = function(id,newproductmoreinfo, callback){
	if (ObjectId.isValid(id)) {
		productmoreinfo.findByIdAndUpdate(id, newproductmoreinfo, function(err) {
			if (err) throw err;
			  console.log('User successfully updated!');
	  	});
    } else {
        return callback(null,{});
    }
}
module.exports.findandupdate = function(query,newProducts, callback){
	productmoreinfo.findOneAndUpdate(query, newProducts, callback);
}
module.exports.dellproductmoreinfo = function(id,callback){
	if (ObjectId.isValid(id)) {
		productmoreinfo.findByIdAndRemove(id, function(err, user) {
			if (err) throw err;
				console.log(user);
		});
    } else {
        return callback(null,{});
    }
}

module.exports.getallproductmoreinfo = function(customer_id,callback){
	var query = {customer_id:customer_id};
	productmoreinfo.find(query, callback);
}
module.exports.getmoreinfovalue = function(customer_id,defaultid,callback){
	//var query = {customer_id:customer_id};
	productmoreinfo.find({"default_value.default_id":defaultid}, {customer_id: customer_id, default_value: {$elemMatch: {default_id:defaultid}}}, callback);
}
module.exports.getallchoiseproductmoreinfo = function(customer_id,callback){
	var query = {customer_id:customer_id,type:1};
	productmoreinfo.find(query, callback);
}

module.exports.getproductmoreinfobyid = function(id, callback){
	if (ObjectId.isValid(id)) {
		productmoreinfo.findById(id, callback);
    } else {
        return callback(null,{});
    }
	
}