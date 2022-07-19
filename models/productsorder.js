var mongoose = require("mongoose")
// User Schema
var ProductsordersSchema = mongoose.Schema({
	product_code: {
		type: String
	},
	product_name:{
		type: String
	},
	product_id:{
		type: String
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
     	detail_value: String,
     	product_detail_id:String
	}],
	create_date:{
		type: Number	
	},
	import_stock_id:{
		type: String	
	},
	stock_id:{
		type: String	
	},
	order_id:{
		type: String	
	},
});
var Productsorders = module.exports = mongoose.model('productsorder', ProductsordersSchema);
module.exports.getProductsordersById = function(id, callback){
	Productsorders.findById(id, callback);
}
module.exports.getAllProductByOrder = function(orderid,callback){
	var query = {order_id:orderid};
	Productsorders.find(query, callback);
}
module.exports.getAllProductsorders = function(page,per_page,callback){
	var query = {};
	Productsorders.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.countProductsorders = function(callback){
	var query = {};
	Productsorders.count(query, callback);
}
module.exports.countProductsOrdersByDate = function(from_date,to_date,callback){
	var query = {$and: [
		{"create_date":{ $gt:from_date}},
		{"create_date":{ $lt:to_date}}
      ]
		
  	};
	Productsorders.count(query, callback);
}
module.exports.countCompanyInProductsorders = function(companyid,callback){
	var query = {company_id:companyid};
	Productsorders.count(query, callback);
}
module.exports.countMaxProductsordersCode = function(callback){
	//Tweet.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
  		//console.log( post );
	//});
	var query = {};
	Productsorders.findOne(query,callback).sort({'Productsorders_id': -1 });
}
module.exports.getAllProductsordersByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	Productsorders.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'Productsorders_id': -1 });
}
module.exports.getProductsOrdersByDate = function(page,per_page,from_date,to_date,callback){
	var query = {};
	Productsorders.find(query, callback).where("create_date").gte(from_date).lte(to_date).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getProductsordersByUserDate = function(userid,type,from_date,to_date,callback){
	var query = {};
	//console.log(type);
	if(type===1||type===2||type===3){
		var query = {create_user:userid,status:type};
	}
	else{
		var query = {create_user:userid};
	}
	//console.log(query);
	Productsorders.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}