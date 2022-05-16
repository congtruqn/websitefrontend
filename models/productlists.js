var express = require('express');
var app = express();
var mongoose = require("mongoose")
// User Schema
var productlistsSchema = mongoose.Schema({
	product_id:{
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
	price:{
		type: Number,
	},
	sale_price:{
		type: Number,
	},
	image:{
		type: String,
	},
	image_path:{
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
	list_parent:[{
		parent_name: String,
		parent_id: String,
		parent_url: String,
	}],
	list_images:[{
		image_name: String,
		image_path:String,
		image: String,
		image1: String,
		image2: String,
	}],
	product_detail:[{
		detail_name:  String,
     	detail_id: String,
     	detail_value:[{
			value:  String,
	     	value_id: String,
     	}],
	}],
	product_more_info:[{
		info_name: String,
		info_value:String,
		defaultid:String,
		status:String,
		info_type:String,
		info_seo_url: String,
	}],
	rank:{
		type: Number,
	},
	hot:{
		type: Number,
	},
	new:{
		type: Number,
	},
	sale:{
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
var productlists = module.exports = mongoose.model('productlists', productlistsSchema);
module.exports.createproductlists = function(newproductlists, callback){
	newproductlists.save(callback);
}
module.exports.editproductlists = function(id,newproductlists, callback){
	productlists.findByIdAndUpdate(id, newproductlists,callback);
}
module.exports.findOneAndUpdateproductlists = function(query,newproductlists, callback){
	productlists.findOneAndUpdate(query, newproductlists, callback);
}
module.exports.updateProductCount = function(product_id,pr_count,callback){
	productlists.getproductlistsById(product_id,function(err, productlists) {
 		var Updateproduct = {count:productlists.count - pr_count};
 		productlists.editproductlists(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.addProductCount = function(product_id,pr_count,callback){
	productlists.getproductlistsById(product_id,function(err, productlists) {
 		var Updateproduct = {count:productlists.count + pr_count};
 		productlists.editproductlists(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.delproductlists = function(id,callback){
	productlists.findByIdAndRemove(id, function(err, productlistss) {
  	if (err) throw err;
  		console.log(productlistss);
	});
}
module.exports.getproductlistsById = function(id, callback){
	var query = {_id:id};
	productlists.findOne(query, callback);
}
module.exports.getproductbyproductid = function(id, callback){
	var query = {product_id:id};
	productlists.findOne(query, callback);
}
module.exports.getAllproductlists = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 });
}
module.exports.findproductbykey = function(key,customer_id,callback){
	var query = {$or:[{title:new RegExp(key, "i"),show:1},{'detail.name':new RegExp(key, "i"),show:1}],customer_id:customer_id};
	//var query = {title:new RegExp(key, "i"),show:1};
	productlists.find(query, callback).skip(0).limit(24).sort({'rank': -1 });
}
module.exports.searchproduct = function(key,callback){
	var query = {$or:[{title:new RegExp(key, "i")},{'detail.title':new RegExp(key, "i")}]};
	//var query = {title:new RegExp(key, "i")};
	productlists.find(query, callback).skip(0).limit(24).sort({'rank': -1 });
}
module.exports.getproductlistsbyparent = function(parent,callback){
	var query = {parent_id:parent};
	productlists.find(query,callback).sort({'create_date': -1 });
}
module.exports.getrootproductlists = function(callback){
	var query = {parent_id:0};
	productlists.find(query, callback).sort({'create_date': -1 });
}
module.exports.countproductlists = function(customer_id,callback){
	var query = {customer_id:customer_id};
	productlists.count(query, callback);
}
module.exports.countproductlistsbycat = function(cat_id,callback){
	var query = {'list_parent.parent_id': cat_id,show:1};
	productlists.count(query, callback);
}
module.exports.counthotproducts = function(customer_id,callback){
	var query = {hot:1,show:1,customer_id:customer_id};
	productlists.count(query, callback);
}
module.exports.countnewproducts = function(customer_id,callback){
	var query = {new:1,show:1,customer_id:customer_id};
	productlists.count(query, callback);
}
module.exports.countMaxproductlistID = function(callback){
	var query = {};
	productlists.findOne(query,callback).sort({'product_id': -1 });
}
module.exports.getAllproductlistsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'productlists_id': -1 });
}
module.exports.getallproductbycat = function(cat_id,page,per_page,callback){
	var query = {'list_parent.parent_id': cat_id};
	productlists.find(query, callback).sort({'productlists_id': -1 });
}
module.exports.getallproductbycatshow = function(customer_id,cat_id,page,per_page,callback){
	var query = {customer_id:customer_id,'list_parent.parent_id': cat_id,show:1};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 });
}

module.exports.getallhotproductsbypage = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id,show:1,hot:1};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 });
}
module.exports.getallnewproductsbypage = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id,show:1,new:1};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 });
}
module.exports.getproductbycatcount = function(customer_id,cat_id,count,callback){
	var query = {customer_id:customer_id,'list_parent.parent_id': cat_id,show:1};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1 });
}
module.exports.getnewproducts = function(customer_id,count,callback){
	var query = {customer_id:customer_id,'new':1,'show':1};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1 });
}
module.exports.gethotproducts = function(customer_id,count,callback){
	var query = {customer_id:customer_id,'hot':1,'show':1};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1 });
}
module.exports.gethotandnewproducts = function(customer_id,count,callback){
	var query = {customer_id:customer_id,'show':1,$or:[{'new':1},{'hot':1}]};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1 });
}
module.exports.getproductbydetailid = function(productid,detailid,callback){
	var query = {_id:productid,'product_detail.detail_id': detailid};
	productlists.findOne(query, callback);
}
module.exports.getproductlistsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	productlists.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
module.exports.getrateproductlistscatcount = function(cat_id,product_id,count,callback){
	var query = {parent_id:cat_id,show:1,product_id:{ $ne: product_id }};
	productlists.find(query, callback).skip(0).limit(count).sort({'create_date': -1 });
}
module.exports.getallproductbymoreinfo = function(customer_id,moreinfo_id,page,per_page,callback){
	var query = {customer_id:customer_id,'product_more_info.defaultid': moreinfo_id,show:1};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 });
}
module.exports.countproductbymoreinfo = function(customer_id,moreinfo_id,callback){
	var query = {customer_id:customer_id,'product_more_info.defaultid': moreinfo_id,show:1};
	productlists.count(query, callback);
}
module.exports.getproductsbymoreinfo = function(customer_id,num,moreinfo_id,callback){
	var query = {customer_id:customer_id,'product_more_info.defaultid': moreinfo_id,show:1};
	productlists.find(query, callback).limit(num).sort({'rank': -1 });
}
