var mongoose = require("mongoose")
// User Schema
var StocksSchema = mongoose.Schema({
	product_code: {
		type: String
	},
	product_code_count:{
		type: String
	},
	product_name:{
		type: String
	},
	product_id:{
		type: String
	},
	product_type_id:{
		type: String
	},
	product_type_name:{
		type: String
	},
	image_name:{
		type: String
	},
	buy_price:{
		type: Number
	},
	sell_price:{
		type: Number
	},
	count:{
		type: Number	
	},
	product_detail:[{
		detail_name:  String,
     	detail_value: String,
     	product_detail_id:String
	}],
	create_date:{
		type: Number	
	},
	import_stock_id:{
		type: String	
	},
});
var Stocks = module.exports = mongoose.model('stocks', StocksSchema);
module.exports.createStocks = function(newStocks, callback){
	newStocks.save(callback);
}
module.exports.editStocks = function(id,newStocks, callback){
	Stocks.findByIdAndUpdate(id, newStocks,callback);
}
module.exports.findOneAndUpdateStocks = function(query,newStocks, callback){
	Stocks.findOneAndUpdate(query, newStocks, function(err) {
	  	if (err) throw err;
    		console.log('Ok');
	});
}
module.exports.getAllStocksByProduct = function(product_id,callback){
	var query = {product_id: product_id};
	Stocks.find(query, callback);
}
module.exports.delStocks = function(id,callback){
	Stocks.findByIdAndRemove(id, function(err, Stockss) {
  	if (err) throw err;
  		console.log(Stockss);
	});
}
module.exports.getStocksById = function(id, callback){
	Stocks.findById(id, callback);
}
module.exports.getAllStocks = function(page,per_page,callback){
	var query = {};
	Stocks.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getAllStocksNotPage = function(callback){
	var query = {};
	Stocks.find(query, callback).sort({'create_date': -1 });
}
module.exports.getAllProductsInStocks = function(callback){
	var query = {count: { $ne: 0 }};
	Stocks.find(query, callback);
}
module.exports.addStocksCount = function(stocks_id,st_count,callback){
	Stocks.getStocksById(stocks_id,function(err,stock) {
 		var UpdateStock = {count:stock.count + st_count};
 		Stocks.editStocks(stocks_id,UpdateStock,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.Searchs = function(searchString,callback){
	var query = {};
	Stocks.find({$text: {$search:searchString}},callback).limit(20);
}
module.exports.getAllStocksByDetail = function(query,callback){
	//var query = {};
	Stocks.find(query, callback);
}
module.exports.countStocks = function(callback){
	var query = {};
	Stocks.count(query, callback);
}
module.exports.countCompanyInStocks = function(companyid,callback){
	var query = {company_id:companyid};
	Stocks.count(query, callback);
}
module.exports.countMaxStocksCode = function(callback){
	//Tweet.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
  		//console.log( post );
	//});
	var query = {};
	Stocks.findOne(query,callback).sort({'Stocks_id': -1 });
}
module.exports.getAllStocksByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	Stocks.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'Stocks_id': -1 });
}

module.exports.getStocksByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	Stocks.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
module.exports.getStocksByUserDate = function(userid,type,from_date,to_date,callback){
	var query = {};
	//console.log(type);
	if(type===1||type===2||type===3){
		var query = {create_user:userid,status:type};
	}
	else{
		var query = {create_user:userid};
	}
	//console.log(query);
	Stocks.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}
module.exports.getStocksByCompanyDate = function(companyid,type,from_date,to_date,callback){
	var query = {};
	//console.log(type);
	if(type===1||type===2||type===3){
		var query = {company_id:companyid,status:type};
	}
	else{
		var query = {company_id:companyid};
	}
	Stocks.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}