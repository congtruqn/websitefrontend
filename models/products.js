
var mongoose = require("mongoose")
var ProductsSchema = mongoose.Schema({
	product_code: {
		type: String
	},
	product_name:{
		type: String
	},
	product_code_count:{
		type: Number,
	},
	product_type_id:{
		type: String
	},
	product_type_name:{
		type: String
	},
	image_name:{
		type: String
	},
	buy_price:{
		type: Number
	},
	sell_price:{
		type: Number
	},
	count:{
		type: Number	
	},
	product_detail:[{
		detail_name:  String,
     	detail_value: String
	}],
	create_date:{
		type: Number	
	},
	status:{
		type: Number	
	},
});
var Products = module.exports = mongoose.model('products', ProductsSchema);
module.exports.getProductsById = function(id, callback){
	Products.findById(id, callback);
}
module.exports.getAllProducts = function(page,per_page,callback){
	var query = {status: { $ne: 0 }};
	Products.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 }).sort({'product_code_count': -1 });
}
module.exports.getAllProductsNotPage = function(callback){
	var query = {};
	Products.find(query, callback).sort({'product_code_count': -1 });
}
module.exports.SumAllPrice = function(callback){
	var query = {};
	Products.aggregate([
	    { $match: {} },
	    { $group: { _id: null, buy_price: { $sum: "$buy_price" } } }
	],callback);
}
module.exports.countProducts = function(callback){
	var query = {status: { $ne: 0 }};
	Products.countDocuments(query, callback);
}
module.exports.countMaxProductCode = function(callback){
	//Tweet.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
  		//console.log( post );
	//});
	var query = {};
	Products.findOne(query,callback).sort({'product_code_count': -1 });
}
module.exports.getAllProductsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	Products.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'Products_id': -1 });
}
module.exports.getProductsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	Products.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
module.exports.getProductsByUserDate = function(userid,type,from_date,to_date,callback){
	var query = {};
	//console.log(type);
	if(type===1||type===2||type===3){
		var query = {create_user:userid,status:type};
	}
	else{
		var query = {create_user:userid};
	}
	//console.log(query);
	Products.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
module.exports.getProductsByCompanyDate = function(companyid,type,from_date,to_date,callback){
	var query = {};
	//console.log(type);
	if(type===1||type===2||type===3){
		var query = {company_id:companyid,status:type};
	}
	else{
		var query = {company_id:companyid};
	}
	Products.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}