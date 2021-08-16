var mongoose = require("mongoose")
// User Schema
var NewsPagesSchema = mongoose.Schema({
	image:{
		type: String
	},
	image_path:{type: String},
	detail:[{
		lang: String,
		name: String,
     	description: String,
     	content: String,
		title: String,
     	desc: String,
		keyword: String,
	}],
	customer_id:{
		type: Number,
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
	seo_url:{
		type: String,
	},
});
var NewsPages = module.exports = mongoose.model('newspages', NewsPagesSchema);
module.exports.createNewsPages = function(newNewsPages, callback){
	newNewsPages.save(callback);
}
module.exports.editNewsPages = function(id,newNewsPages, callback){
	NewsPages.findByIdAndUpdate(id, newNewsPages,callback);
}
module.exports.findOneAndUpdateNewsPages = function(query,newNewsPages, callback){
	NewsPages.findOneAndUpdate(query, newNewsPages, callback);
}
module.exports.updateProductCount = function(product_id,pr_count,callback){
	NewsPages.getNewsPagesById(product_id,function(err, NewsPages) {
 		var Updateproduct = {count:NewsPages.count - pr_count};
 		NewsPages.editNewsPages(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.addProductCount = function(product_id,pr_count,callback){
	NewsPages.getNewsPagesById(product_id,function(err, NewsPages) {
 		var Updateproduct = {count:NewsPages.count + pr_count};
 		NewsPages.editNewsPages(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.delNewsPages = function(id,callback){
	NewsPages.findByIdAndRemove(id, function(err, NewsPagess) {
  	if (err) throw err;
  		console.log(NewsPagess);
	});
}
module.exports.getNewsPagesById = function(customer_id,id, callback){
	var query = {_id:id,customer_id:customer_id};
	NewsPages.findOne(query, callback);
}
module.exports.getAllNewsPages = function(customer_id,page,per_page,callback){
	var query = {customer_id:customer_id};
	NewsPages.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}

module.exports.countNewsPages = function(customer_id,callback){
	var query = {customer_id:customer_id};
	NewsPages.count(query, callback);
}

module.exports.getAllNewsPagesByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	NewsPages.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'NewsPages_id': -1 });
}
module.exports.getNewsPagesByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	NewsPages.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}