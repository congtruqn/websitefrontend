const express = require('express');
const app = express();
const mongoose = require("mongoose")
require('../models/product_comments');
const productlistsSchema = mongoose.Schema({
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
	image1:{
		type: String,
	},
	image2:{
		type: String,
	},
	image3:{
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
	rating:{
		type: Number,
	},
	ratings:{
		type: Number,
	},
	votes:{
		type: Number,
	},
	product_comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product_comments' }]
});
const productlists = module.exports = mongoose.model('productlists', productlistsSchema);

module.exports.getProductById = async function(customer_id,id){
	const query = {customer_id:customer_id,product_id:id};
	return await productlists.findOne(query).populate('product_comments').exec();
}

module.exports.findproductbykey = function(key,customer_id,callback){
	var query = {$or:[{title:new RegExp(key, "i"),show:1},{'detail.name':new RegExp(key, "i"),show:1}],customer_id:customer_id};
	//var query = {title:new RegExp(key, "i"),show:1};
	productlists.find(query, callback).skip(0).limit(24).sort({'rank': -1 });
}
module.exports.searchproduct = function(key,callback){
	const query = {$or:[{title:new RegExp(key, "i")},{'detail.title':new RegExp(key, "i")}]};
	productlists.find(query, callback).skip(0).limit(24).sort({'rank': -1 });
}

module.exports.countproductlists = function(customer_id,callback){
	const query = {customer_id:customer_id};
	productlists.countDocuments(query, callback);
}
module.exports.countproductlistsbycat = async function(customer_id,cat_id){
	const query = {customer_id:customer_id,'list_parent.parent_id': cat_id,show:1};
	return productlists.count(query).exec();
}

module.exports.countnewproducts = function(customer_id,callback){
	const query = {new:1,show:1,customer_id:customer_id};
	productlists.countDocuments(query, callback);
}
module.exports.countTopProducts = async function(customer_id, type){
	//1 Sản phẩm hot
	//2 Sản phẩm mới
	//3 Sản phẩm giảm giá
	let query = {hot:1,show:1,customer_id:customer_id};
	if(type==2){
		query = {new:1,show:1,customer_id:customer_id};
	}
	if(type==3){
		query = {sale:1,show:1,customer_id:customer_id};
	}
	return await productlists.countDocuments(query).exec();
}
module.exports.getallproductbycat = function(cat_id,page,per_page,callback){
	const query = {'list_parent.parent_id': cat_id};
	productlists.find(query, callback).sort({'productlists_id': -1 });
}
module.exports.getallproductbycatshow = async function(customer_id,cat_id,page,per_page){
	const query = {customer_id:customer_id,'list_parent.parent_id': cat_id,show:1};
	return await productlists.find(query).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1,'create_date': -1 ,'product_id': -1  }).exec();
}
module.exports.getAllTopProducts = async function( customer_id, page, per_page ,type ){
	//1 Sản phẩm hot
	//2 Sản phẩm mới
	//3 Sản phẩm giảm giá
	let query = { hot: 1,show: 1,customer_id: customer_id };
	if(type==2){
		query = { new: 1,show: 1,customer_id: customer_id };
	}
	if(type==3){
		query = {sale: 1,show: 1,customer_id: customer_id };
	}
	return await productlists.find(query).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1,'create_date': -1 ,'product_id': -1  }).exec();
}
module.exports.getallnewproductsbypage = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id,show:1,new:1};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.getproductbycatcount = function(customer_id,cat_id,count,callback){
	const query = {customer_id:customer_id,'list_parent.parent_id': cat_id,show:1};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.getnewproducts = function(customer_id,count,callback){
	const query = {customer_id:customer_id,'new':1,'show':1};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.getSaleProducts = function(customer_id,count,callback){
	const query = {customer_id:customer_id,'sale':1,'show':1};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.gethotproducts = function(customer_id,count,callback){
	const query = {customer_id:customer_id,'hot':1,'show':1};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.gethotandnewproducts = function(customer_id,count,callback){
	const query = {customer_id:customer_id,'show':1,$or:[{'new':1},{'hot':1}]};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.getproductbydetailid = function(productid,detailid,callback){
	const query = {_id:productid,'product_detail.detail_id': detailid};
	productlists.findOne(query, callback);
}
module.exports.getrateproductlistscatcount = function(customer_id,cat_id,product_id,count,callback){
	const query = {customer_id:customer_id,parent_id:cat_id,show:1,product_id:{ $ne: product_id }};
	productlists.find(query, callback).skip(0).limit(count).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.getallproductbymoreinfo = function(customer_id,moreinfo_id,page,per_page,callback){
	const query = {customer_id:customer_id,'product_more_info.defaultid': moreinfo_id,show:1};
	productlists.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.countproductbymoreinfo = function(customer_id,moreinfo_id,callback){
	const query = {customer_id:customer_id,'product_more_info.defaultid': moreinfo_id,show:1};
	productlists.countDocuments(query, callback);
}
module.exports.getproductsbymoreinfo = function(customer_id,num,moreinfo_id,callback){
	const query = {customer_id:customer_id,'product_more_info.defaultid': moreinfo_id,show:1};
	productlists.find(query, callback).limit(num).sort({'rank': -1,'create_date': -1 ,'product_id': -1  });
}
module.exports.updateRating = async function(customerId,productId,rating,ratings,votes){
	return productlists.findOneAndUpdate({customer_id: customerId, product_id:productId} , {rating: rating ,ratings: ratings, votes: votes}).exec();
}
module.exports.addReview = async function(customerId, productId, reviewId){
	return productlists.findOneAndUpdate({customer_id: customerId, _id: productId } , { $push: { product_comments: reviewId } }).exec();
}
