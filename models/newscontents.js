var express = require('express');
var app = express();
var mongoose = require("mongoose")
// User Schema
var newscontentsSchema = mongoose.Schema({
	content_id:{
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
	rank:{
		type: Number,
	},
	hot:{
		type: Number,
	},
	new:{
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
var newscontents = module.exports = mongoose.model('newscontents', newscontentsSchema);
module.exports.getNewsContentsById = function(id, callback){
	var query = {_id:id};
	newscontents.findOne(query, callback);
}
module.exports.getnewscontentbycontentid = function(customer_id,id, callback){
	var query = {content_id:id,customer_id:customer_id};
	newscontents.findOne(query, callback);
}
module.exports.getAllnewscontents = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id};
	newscontents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getnewnews = function(count,callback){
	var query = {'new':1};
	newscontents.find(query, callback).skip(0).limit(count).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getnewscontentsbyparent = function(parent,callback){
	var query = {parent_id:parent};
	newscontents.find(query,callback).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getrootnewscontents = function(callback){
	var query = {parent_id:0};
	newscontents.find(query, callback).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.countnewscontents = function(customer_id,callback){
	var query = {customer_id:customer_id};
	newscontents.countDocuments(query, callback);
}
module.exports.getnewcontents = function(customer_id,count,callback){
	var query = {customer_id:customer_id,'new':1};
	newscontents.find(query, callback).skip(0).limit(count).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });;
}
module.exports.countMaxcontentID = function(callback){
	var query = {};
	newscontents.findOne(query,callback).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getAllnewscontentsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	newscontents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getallproductbycat = function(cat_id,page,per_page,callback){
	var query = {'list_parent.parent_id': cat_id};
	newscontents.find(query, callback).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getproductbydetailid = function(productid,detailid,callback){
	var query = {_id:productid,'product_detail.detail_id': detailid};
	newscontents.findOne(query, callback);
}
module.exports.getnewscontentsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	newscontents.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
module.exports.getAllNewsContentsBycat = function(cat_id,page,per_page,callback){
	var query = {newscat_id:cat_id};
	newscontents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getnewsnontentsbycatcount = async function(cat_id,page,per_page){
	var query = {'list_parent.parent_id':cat_id,show:1};
	return await newscontents.find(query).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 ,'content_id':-1,'create_date': -1 }).exec();
}
module.exports.gethotnewcontentcount = function(count,callback){
	var query = {hot:1,show:1};
	newscontents.find(query, callback).skip(0).limit(count).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.getratenewcontentbycatcount = function(cat_id,content_id,count,callback){
	var query = {parent_id:cat_id,show:1,content_id:{ $ne: content_id }};
	newscontents.find(query, callback).skip(0).limit(count).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.countnewscontentsbycat = function(cat_id,callback){
	var query = {'list_parent.parent_id':cat_id,show:1};
	newscontents.count(query, callback);
}
module.exports.getAllNewsContentsBycatCount = function(cat_id,count,callback){
	var query = {newscat_id:cat_id};
	newscontents.find(query, callback).skip(0).limit(count).sort({'rank': -1 ,'content_id':-1,'create_date': -1 });
}
module.exports.countNewsContents = function(callback){
	var query = {};
	newscontents.count(query, callback);
}