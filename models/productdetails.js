var mongoose = require("mongoose")
// User Schema
var ProductsDetailSchema = mongoose.Schema({
	name: {
		type: String,
	},
	numproduct: {
		type: String
	},
});
var ProductsDetail = module.exports = mongoose.model('products_details', ProductsDetailSchema);

module.exports.createProductsDetail = function(newProductsDetail, callback){
	newProductsDetail.save(callback);
}
module.exports.editProductsDetail1 = function(id,newProductsDetail, callback){
	ProductsDetail.findById(id, function(err, user) {
  		if (err) throw err;
  		user.fullname = newProductsDetail.fullname;
  		user.save(function(err) {
    		if (err) throw err;

  		});
	});
}
module.exports.editProductsDetail = function(id,newProductsDetail, callback){
	ProductsDetail.findByIdAndUpdate(id, newProductsDetail, function(err) {
	  	if (err) throw err;
	});
}
module.exports.dellProductsDetail = function(id,callback){
	ProductsDetail.findByIdAndRemove(id, function(err, user) {
  	if (err) throw err;
	});
}

module.exports.getAllProductsDetail = function(page,per_page,callback){
	var query = {};
	ProductsDetail.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}
module.exports.CountProductsDetail = function(callback){
	var query = {};
	ProductsDetail.count(query, callback);
}
module.exports.getUserByUsername = function(username, callback){
	var query = {fullname: congtruqn};
	User.findOne(query, callback);
}

module.exports.getProductsDetailById = function(id, callback){
	ProductsDetail.findById(id, callback);
}
module.exports.getProductsDetailByUser = function(userid, callback){
	var query = {createuser: userid};
	ProductsDetail.find(query, callback);
}
module.exports.getAllProductsDetailByAdmin = function(userid, callback){
	var query = {};
	ProductsDetail.find(query, callback);
}
module.exports.getAllProductsDetailByUser = function(userid,page,per_page,callback){
	var query = {createuser: userid};
	ProductsDetail.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}