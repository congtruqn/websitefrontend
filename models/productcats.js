var express = require('express');
var app = express();
var Promise = require('promise');
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
	image_icon:{
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
module.exports.createproductcats = function(newproductcats, callback){
	newproductcats.save(callback);
}
module.exports.editproductcats = function(id,newproductcats, callback){
	productcats.findByIdAndUpdate(id, newproductcats,callback);
}
module.exports.findOneAndUpdateproductcats = function(query,newproductcats, callback){
	productcats.findOneAndUpdate(query, newproductcats, callback);
}
module.exports.delproductcats = function(id,callback){
	productcats.findByIdAndRemove(id, function(err, productcatss) {
  	if (err) throw err;
  		console.log(productcatss);
	});
}
module.exports.delproductcatsbycatid = function(cat_id,callback){
	productcats.findOneAndRemove({cat_id:cat_id}, function(err, productcatss) {
  	if (err) throw err;
  		console.log(productcatss);
	});
}
module.exports.getproductcatsById = function(id, callback){
	var query = {_id:id};
	productcats.findOne(query, callback);
}
module.exports.getproductcatsbycatid = function(cat_id, callback){
	var query = {cat_id:cat_id};
	productcats.findOne(query, callback);
}
module.exports.getproductcatsparent = function(customer_id,cat_id, callback){
	productcats.getproductcatsbycatid(customer_id,cat_id,function(err, productcat) {
 		var query = {cat_id:productcat.parent_id};
		productcats.findOne(query, callback);
  	});
}
module.exports.getproductcatsparentnotthis = function(id,cat_id, callback){
	productcats.getproductcatsbycatid(cat_id,function(err, productcat) {
 		var query = {cat_id:productcat.parent_id};
		productcats.findOne(query, callback);
  	});
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
module.exports.countproductcats = function(callback){
	var query = {};
	productcats.count(query, callback);
}

module.exports.countMaxProductCatID = function(callback){
	var query = {};
	productcats.findOne(query,callback).sort({'cat_id': -1 });
}
module.exports.getMaxProductCatID =  function (callback) {
	productcats.countMaxProductCatID(function(err, productc) {
		if(productc){
			jsons = {
	          maxordercode:productc.cat_id,
	          ordercode:'HD000001',
	       	}
	       	console.log(jsons);
			return callback(jsons);
		}
		else{
			jsons = {
	          maxordercode:1,
	          ordercode:'HD000001',
	       	}
	       	console.log(jsons);
			return callback(jsons);
		}
  	});	
}
module.exports.getAllproductcatsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	productcats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'productcats_id': -1 });
}
module.exports.getproductcatsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	productcats.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
