var mongoose = require("mongoose")
var productlistdetailSchema = mongoose.Schema({
	name: {
		type: String,
	},
	description: {
		type: String,
	},
	parent_id: {
		type: String,
	},
	parent_name: {
		type: String,
	},
	detail_value:[{
		value: String,
	}],
	list_parent:[{
		parent_name: String,
		parent_id: String,
		parent_url: String,
	}],
	customer_id: {
        type: Number,
    },
});
var productlistdetail = module.exports = mongoose.model('productlistdetails', productlistdetailSchema);

module.exports.getAllproductlistdetail = function(page,per_page,callback){
	var query = {};
	productlistdetail.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}
module.exports.getproductlistdetailbyparent = function(parentid,callback){
	var query = {'list_parent.parent_id':parentid};
	productlistdetail.find(query, callback);
}
module.exports.Countproductlistdetail = function(callback){
	var query = {};
	productlistdetail.count(query, callback);
}
module.exports.getproductlistdetailById = function(id, callback){
	var query = {_id: id};
	productlistdetail.findOne(query, callback).populate({path:'detail_value',select: 'value',options:{ sort:{value: -1}}})
}
module.exports.getproductlistdetailByUser = function(userid, callback){
	var query = {createuser: userid};
	productlistdetail.find(query, callback);
}
module.exports.getAllproductlistdetailByAdmin = function(userid, callback){
	var query = {};
	productlistdetail.find(query, callback);
}
module.exports.getAllproductlistdetailByUser = function(userid,page,per_page,callback){
	var query = {createuser: userid};
	productlistdetail.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}