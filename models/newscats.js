var express = require('express');
var app = express();
var mongoose = require("mongoose")
// User Schema
var newscatsSchema = mongoose.Schema({
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
	child:{
		type: Number,
	},
	list_child:[{
		child_name: String,
     	child_id: String,
     	child_cat_id: Number,
	}],
	hot:{
		type: Number,
	},
	new:{
		type: Number,
	},
	show:{
		type: Number,
	},
	cat_rank:{
		type: Number,
	},
	rank:{
		type: Number,
	}
});
var newscats = module.exports = mongoose.model('newscats', newscatsSchema);
module.exports.createnewscats = function(newnewscats, callback){
	newnewscats.save(callback);
}
module.exports.editnewscats = function(id,newnewscats, callback){
	newscats.findByIdAndUpdate(id, newnewscats,callback);
}
module.exports.findOneAndUpdatenewscats = function(query,newnewscats, callback){
	newscats.findOneAndUpdate(query, newnewscats, callback);
}
module.exports.delnewscats = function(id,callback){
	newscats.findByIdAndRemove(id, function(err, newscatss) {
  	if (err) throw err;
  		console.log(newscatss);
	});
}
module.exports.getnewscatsById = function(id, callback){
	var query = {_id:id};
	newscats.findOne(query, callback);
}
module.exports.getnewscatsbycatid = function(customer_id,cat_id, callback){
	var query = {cat_id:cat_id,customer_id:customer_id};
	newscats.findOne(query, callback);
}
module.exports.getnewscatsparent = function(customer_id,cat_id, callback){
	newscats.getnewscatsbycatid(customer_id,cat_id,function(err, productcat) {
 		var query = {cat_id:productcat.parent_id};
		newscats.findOne(query, callback);
  	});
}
module.exports.getnewscatsparentnotthis = function(id,cat_id, callback){
	newscats.getnewscatsbycatid(cat_id,function(err, productcat) {
 		var query = {cat_id:productcat.parent_id};
		newscats.findOne(query, callback);
  	});
}
module.exports.getAllnewscats = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id};
	newscats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}

module.exports.getnewscatsbyparent = function(customer_id,parent,callback){
	var query = {customer_id:customer_id,parent_id:parent};
	newscats.find(query,callback).sort({'create_date': -1 });
}
module.exports.getrootnewscats = function(customer_id,callback){
	var query = {customer_id:customer_id,parent_id:0};
	newscats.find(query, callback).sort({'create_date': -1 });
}
module.exports.countnewscats = function(callback){
	var query = {};
	newscats.count(query, callback);
}
module.exports.gethotnewcatbyrank = function(callback){
	var query = {hot:1};
	newscats.findOne(query,callback).sort({'rank': -1 });
}
module.exports.getMaxProductCatID =  function (callback) {
	newscats.countMaxProductCatID(function(err, productc) {
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
module.exports.getAllnewscatsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	newscats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'newscats_id': -1 });
}
module.exports.getnewscatsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	newscats.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
