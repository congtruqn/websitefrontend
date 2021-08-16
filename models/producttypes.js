var mongoose = require("mongoose")
// User Schema
var ProductsTypeSchema = mongoose.Schema({
	name: {
		type: String,
	},
	numproduct: {
		type: String
	},
});
var ProductsType = module.exports = mongoose.model('products_types', ProductsTypeSchema);

module.exports.createProductsType = function(newProductsType, callback){
	newProductsType.save(callback);
}
module.exports.editProductsType1 = function(id,newProductsType, callback){
	ProductsType.findById(id, function(err, user) {
  		if (err) throw err;
  		user.fullname = newProductsType.fullname;
  		user.save(function(err) {
    		if (err) throw err;
    		console.log('User successfully updated!');
  		});
	});
}
module.exports.editProductsType = function(id,newProductsType, callback){
	ProductsType.findByIdAndUpdate(id, newProductsType, function(err) {
	  	if (err) throw err;
    		console.log('User successfully updated!');
	});
}
module.exports.dellProductsType = function(id,callback){
	ProductsType.findByIdAndRemove(id, function(err, user) {
  	if (err) throw err;
  		console.log(user);
	});
}

module.exports.getAllProductsType = function(page,per_page,callback){
	var query = {};
	ProductsType.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}
module.exports.CountProductsType = function(callback){
	var query = {};
	ProductsType.count(query, callback);
}
module.exports.getUserByUsername = function(username, callback){
	var query = {fullname: congtruqn};
	User.findOne(query, callback);
}

module.exports.getProductsTypeById = function(id, callback){
	ProductsType.findById(id, callback);
}
module.exports.getProductsTypeByUser = function(userid, callback){
	var query = {createuser: userid};
	ProductsType.find(query, callback);
}
module.exports.getAllProductsTypeByAdmin = function(userid, callback){
	var query = {};
	ProductsType.find(query, callback);
}
module.exports.getAllProductsTypeByUser = function(userid,page,per_page,callback){
	var query = {createuser: userid};
	ProductsType.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}