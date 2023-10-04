var express = require('express');
var app = express();
var mongoose = require("mongoose")
// User Schema
var productcatsSchema = mongoose.Schema({
	cat_id:{
		type: Number,
	},
	customer_id:{
		type: Number,
	},
	parent_id:{
		type: Number,
	},
	parent_name:{
		type: String,
	},
	image:{
		type: String,
	},
	icon:{
		type: String,
	},
	icon_font:{
		type: String,
	},	
	image_category:{
		type: String,
	},
	image_ads:{
		type: String,
	},
	detail:[{
		lang: String,
		name: String,
     	description: String,
     	content: String,
		title: String,
     	desc: String,
		keyword: String,
	}],
	status:{
		type: Number,
	},
	type:{
		type: Number,
	},
	create_date:{
		type: Number,
	},
	create_user:{
		type: String,
	},
	create_name:{
		type: String,
	},
	seo_url:{
		type: String,
	},
	ads_url:{
		type: String,
	},
	child:{
		type: Number,
	},
	list_child:[{
		child_name: String,
     	child_id: String,
     	child_cat_id: Number,
	}],
	cat_rank:{
		type: Number,
	},
	rank:{
		type: Number,
	},
	hot:{
		type: Number,
	},
	show:{
		type: Number,
	},
	title:{
		type: String,
	},
	keyword:{
		type: String,
	},
	desc:{
		type: String,
	},
	name:{
		type: String,
	},
	description:{
		type: String,
	},
	content:{
		type: String,
	},
});
var productcats = module.exports = mongoose.model('productcats', productcatsSchema);

module.exports.getProductCatByCatId = async function(customerId, catId){
	const query = {cat_id:catId,customer_id:customerId};
	return await productcats.findOne(query).exec();
}
module.exports.getAllproductcats = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id};
	productcats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getproductcatsbyparent = function(customer_id,parent,callback){
	var query = {customer_id:customer_id,parent_id:parent};
	productcats.find(query,callback).sort({'create_date': -1 });
}
module.exports.getrootproductcats = function(customer_id,callback){
	var query = {customer_id:customer_id,parent_id:0};
	productcats.find(query, callback).sort({'rank': -1 });
}
module.exports.gethotrootproductcats = function(customer_id,callback){
	var query = {customer_id:customer_id,parent_id:0,hot:1};
	productcats.find(query, callback).sort({'rank': -1 });
}
module.exports.gethotproductcategory = function(customer_id,callback){
	var query = {customer_id:customer_id,hot:1};
	productcats.find(query, callback).sort({'rank': -1 });
}


