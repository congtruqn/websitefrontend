var mongoose = require("mongoose")
// User Schema
var SeourlSchema = mongoose.Schema({
	seo_url: {
		type: String,
	},
	type: {
		type: Number,
	},
	content_id: {
		type: String
	},
	customer_id: {
		type: Number
	},
});
var Seourl = module.exports = mongoose.model('seourl', SeourlSchema);

module.exports.createSeourl = function(newSeourl, callback){
	newSeourl.save(callback);
}
module.exports.findByUrl = function(customer_id,url,callback){
	var query = {"customer_id":customer_id,"seo_url":url};
	Seourl.findOne(query,callback);
}
module.exports.findOneAndUpdateSeourl = function(query,newSeourl, callback){
	Seourl.findOneAndUpdate(query, newSeourl, callback);
}
module.exports.editSeourl = function(id,newSeourl, callback){
	Seourl.findByIdAndUpdate(id, newSeourl, function(err) {
	  	if (err) throw err;
    		console.log('User successfully updated!');
	});
}
module.exports.delSeourlByID = function(id,callback){
	Seourl.findByIdAndRemove(id, function(err, user) {
  	if (err) throw err;
  		console.log(user);
	});
}
module.exports.delSeourl = function(query,callback){
	Seourl.findOneAndRemove(query, function(err, user) {
  	if (err) throw err;
  		console.log(user);
	});
}
module.exports.getAllSeourl = function(page,per_page,callback){
	var query = {};
	Seourl.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}
module.exports.CountSeourl = function(callback){
	var query = {};
	Seourl.count(query, callback);
}

module.exports.getSeourlById = function(id, callback){
	Seourl.findById(id, callback);
}
module.exports.getSeourlByUser = function(userid, callback){
	var query = {createuser: userid};
	Seourl.find(query, callback);
}
module.exports.getAllSeourlByAdmin = function(userid, callback){
	var query = {};
	Seourl.find(query, callback);
}
module.exports.getAllSeourlByUser = function(userid,page,per_page,callback){
	var query = {createuser: userid};
	Seourl.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}