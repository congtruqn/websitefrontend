var mongoose = require("mongoose")
// User Schema
var OrdersSchema = mongoose.Schema({
	order_code: {
		type: String
	},
	order_id: {
		type: Number
	},
	customer_name:{
		type: String
	},
	customer_phone:{
		type: String
	},
	saleoff_monney:{
		type: Number
	},
	total_monney:{
		type: Number
	},
	buy_monney:{
		type: Number
	},
	status:{
		type: Number
	},
	count:{
		type: Number
	},
	create_date:{
		type: Number
	}
});
var Orders = module.exports = mongoose.model('orders', OrdersSchema);
module.exports.createOrders = function(newOrders, callback){
	newOrders.save(callback);
}
module.exports.editOrders = function(id,newOrders, callback){
	Orders.findByIdAndUpdate(id, newOrders,callback);
}
module.exports.findOneAndUpdateOrders = function(query,newOrders, callback){
	Orders.findOneAndUpdate(query, newOrders, function(err) {
	  	if (err) throw err;
    		
	});
}
module.exports.delOrders = function(id,callback){
	Orders.findByIdAndRemove(id, function(err, Orderss) {
  	if (err) throw err;
  		
	});
}
module.exports.getOrdersById = function(id, callback){
	Orders.findById(id, callback);
}
module.exports.SumTotalMonney = function(from_date,to_date,callback){
	var query = {};
	Orders.aggregate([
	    { $match: {
	    	 create_date : {
                '$gte':from_date,
                '$lt':to_date
            }
	    } },
	    { $group: { _id: null, total_monney: { $sum: "$total_monney" },buy_monney: { $sum: "$buy_monney" } ,saleoff_monney: { $sum: "$saleoff_monney" } } }
	],callback);
}
module.exports.getAllOrders = function(page,per_page,callback){
	var query = {};
	Orders.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'order_id': -1 });
}
module.exports.countOrders = function(callback){
	var query = {};
	Orders.count(query, callback);
}
module.exports.countOrdersByDate = function(from_date,to_date,callback){
	var query = {$and: [
		{"create_date":{ $gt:from_date}},
		{"create_date":{ $lt:to_date}}
      ]
		
  	};
	Orders.count(query, callback);
}
module.exports.countCompanyInOrders = function(companyid,callback){
	var query = {company_id:companyid};
	Orders.countDocuments(query, callback);
}
module.exports.getOrderCode = function(callback){
	var jsons = {};
	Orders.countMaxOrdersCode(function(err, companys) {
		if(companys){
	      if(Number(companys.order_id)<9){
	        jsons = {
	          maxordercode:companys.order_id,
	          ordercode:'HD00000'+(Number(companys.order_id)+1),
	        }
	      }
	      else if(Number(companys.order_id)<99&&Number(companys.order_id)>=9){
	        jsons = {
	          maxordercode:companys.order_id,
	          ordercode:'HD0000'+(Number(companys.order_id)+1),
	        }
	      }
	      else if(Number(companys.order_id)<999&&Number(companys.order_id)>=99){
	        jsons = {
	          maxordercode:companys.order_id,
	          ordercode:'HD000'+(Number(companys.order_id)+1),
	        }
	      }
	      else if(Number(companys.order_id)<9999&&Number(companys.order_id)>=999){
	        jsons = {
	          maxordercode:companys.order_id,
	          ordercode:'HD00'+(Number(companys.order_id)+1),
	        }
	      }
	      else if(Number(companys.order_id)<99999&&Number(companys.order_id)>=9999){
	        jsons = {
	          maxordercode:companys.order_id,
	          ordercode:'HD0'+(Number(companys.order_id)+1),
	        }
	      }
	      else if(Number(companys.order_id)<999999&&Number(companys.order_id)>99999){
	        jsons = {
	          maxordercode:companys.order_id,
	          ordercode:'HD'+(Number(companys.order_id)+1),
	        }
	      }
	      return callback(jsons);
	    }
	    else{
	      jsons = {
	          maxordercode:0,
	          ordercode:'HD000001',
	       }
	       return callback(jsons);
	    }
	});
}
module.exports.countMaxOrdersCode = function(callback){
	var query = {};
	Orders.findOne(query,callback).sort({'order_id': -1 });
}
module.exports.getAllOrdersByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	Orders.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'order_id': -1 });
}
module.exports.getOrdersByDate = function(page,per_page,from_date,to_date,callback){
	var query = {};
	Orders.find(query, callback).where("create_date").gte(from_date).lte(to_date).skip(per_page * (page - 1)).limit(per_page).sort({'order_id': -1 });;
}
module.exports.getOrdersByUserDate = function(userid,type,from_date,to_date,callback){
	var query = {};
	//console.log(type);
	if(type===1||type===2||type===3){
		var query = {create_user:userid,status:type};
	}
	else{
		var query = {create_user:userid};
	}
	//console.log(query);
	Orders.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}