var express = require('express');
var app = express();
var mongoose = require("mongoose")
// User Schema
var menuSchema = mongoose.Schema({
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
	detail:[{
		lang: String,
		name: String,
	}],
	link:{
		type: String,
	},
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
	child:{
		type: Number,
	},
	list_child:[{
		child_name: String,
     	child_id: String,
     	child_cat_id: Number,
	}],
	ishot:{
		type: Number,
	},
	cat_rank:{
		type: Number,
	},
	position:{
		type: Number,
	}
});
var menu = module.exports = mongoose.model('menus', menuSchema);
module.exports.getmenuById = function(id, callback){
	var query = {_id:id};
	menu.findOne(query, callback);
}
module.exports.getmenubycatid = function(cat_id, callback){
	var query = {cat_id:cat_id};
	menu.findOne(query, callback);
}
module.exports.getmenuparent = function(cat_id, callback){
	menu.getmenubycatid(cat_id,function(err, productcat) {
 		var query = {cat_id:productcat.parent_id};
		menu.findOne(query, callback);
  	});
}
module.exports.getmenuparentnotthis = function(id,cat_id, callback){
	menu.getmenubycatid(cat_id,function(err, productcat) {
 		var query = {cat_id:productcat.parent_id};
		menu.findOne(query, callback);
  	});
}
module.exports.getAllmenu = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id};
	menu.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}

module.exports.getmenubyparent = function(customer_id,parent,callback){
	var query = {customer_id:customer_id,parent_id:parent};
	menu.find(query,callback).sort({'create_date': -1 });
}
module.exports.getrootmenu = function(customer_id,callback){
	var query = {customer_id:customer_id,parent_id:0};
	menu.find(query, callback).sort({'position': -1 });
}
module.exports.countmenu = function(callback){
	var query = {};
	menu.countDocuments(query, callback);
}
module.exports.countMaxProductCatID = function(callback){
	var query = {};
	menu.findOne(query,callback).sort({'cat_id': -1 });
}
module.exports.getMaxProductCatID =  function (callback) {
	menu.countMaxProductCatID(function(err, productc) {
		if(productc){
			jsons = {
	          maxordercode:productc.cat_id,
	          ordercode:'HD000001',
	       	}
	
			return callback(jsons);
		}
		else{
			jsons = {
	          maxordercode:1,
	          ordercode:'HD000001',
	       	}
			return callback(jsons);
		}
  	});	
}
module.exports.getAllmenuByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	menu.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'menu_id': -1 });
}
module.exports.getmenuByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	menu.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
