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
module.exports.createnewscontents = function(newnewscontents, callback){
	newnewscontents.save(callback);
}
module.exports.editnewscontents = function(id,newnewscontents, callback){
	newscontents.findByIdAndUpdate(id, newnewscontents,callback);
}
module.exports.findOneAndUpdatenewscontents = function(query,newnewscontents, callback){
	newscontents.findOneAndUpdate(query, newnewscontents, callback);
}
module.exports.updateProductCount = function(product_id,pr_count,callback){
	newscontents.getnewscontentsById(product_id,function(err, newscontents) {
 		var Updateproduct = {count:newscontents.count - pr_count};
 		newscontents.editnewscontents(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.addProductCount = function(product_id,pr_count,callback){
	newscontents.getnewscontentsById(product_id,function(err, newscontents) {
 		var Updateproduct = {count:newscontents.count + pr_count};
 		newscontents.editnewscontents(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.delnewscontents = function(id,callback){
	newscontents.findByIdAndRemove(id, function(err, newscontentss) {
  	if (err) throw err;
  		console.log(newscontentss);
	});
}
module.exports.getNewsContentsById = function(id, callback){
	var query = {_id:id};
	newscontents.findOne(query, callback);
}
module.exports.getnewscontentbycontentid = function(id, callback){
	var query = {content_id:id};
	newscontents.findOne(query, callback);
}
module.exports.getAllnewscontents = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id};
	newscontents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 });
}
module.exports.getnewnews = function(count,callback){
	var query = {'new':1};
	newscontents.find(query, callback).skip(0).limit(count).sort({'rank': -1 });
}
module.exports.getnewscontentsbyparent = function(parent,callback){
	var query = {parent_id:parent};
	newscontents.find(query,callback).sort({'create_date': -1 });
}
module.exports.getrootnewscontents = function(callback){
	var query = {parent_id:0};
	newscontents.find(query, callback).sort({'create_date': -1 });
}
module.exports.countnewscontents = function(customer_id,callback){
	var query = {customer_id:customer_id};
	newscontents.count(query, callback);
}
module.exports.countMaxcontentID = function(callback){
	var query = {};
	newscontents.findOne(query,callback).sort({'content_id': -1 });
}
module.exports.getMaxproductlistID =  function (callback) {
	newscontents.countMaxproductlistID(function(err, productc) {
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
module.exports.getAllnewscontentsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	newscontents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'newscontents_id': -1 });
}
module.exports.getallproductbycat = function(cat_id,page,per_page,callback){
	var query = {'list_parent.parent_id': cat_id};
	newscontents.find(query, callback).sort({'newscontents_id': -1 });
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
	newscontents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getnewsnontentsbycatcount = function(cat_id,page,per_page,callback){
	var query = {'list_parent.parent_id':cat_id,show:1};
	newscontents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.gethotnewcontentcount = function(count,callback){
	var query = {hot:1,show:1};
	newscontents.find(query, callback).skip(0).limit(count).sort({'create_date': -1 });
}
module.exports.getratenewcontentbycatcount = function(cat_id,content_id,count,callback){
	var query = {parent_id:cat_id,show:1,content_id:{ $ne: content_id }};
	newscontents.find(query, callback).skip(0).limit(count).sort({'create_date': -1 });
}
module.exports.countnewscontentsbycat = function(cat_id,callback){
	var query = {'list_parent.parent_id':cat_id,show:1};
	newscontents.count(query, callback);
}
module.exports.getAllNewsContentsBycatCount = function(cat_id,count,callback){
	var query = {newscat_id:cat_id};
	newscontents.find(query, callback).skip(0).limit(count).sort({'create_date': -1 });
}
module.exports.countNewsContents = function(callback){
	var query = {};
	newscontents.count(query, callback);
}