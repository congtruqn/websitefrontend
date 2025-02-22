var mongoose = require("mongoose")
var listordersSchema = mongoose.Schema({
	order_code: {
		type: String
	},
	order_id: {
		type: Number
	},
	name:{
		type: String
	},
	phone:{
		type: String
	},
	email:{
		type: String
	},
	address:{
		type: String
	},
	list_products:[{
		product_id: String,
		product_name: String,
     	product_price: String,
		product_image: String,
		value_names: [{ type: String }],
		count: Number
	}],
	saleoff_money:{
		type: Number
	},
	total_money:{
		type: Number
	},
	shipping_fee:{
		type: Number
	},
	amount:{
		type: String
	},
	status:{
		type: Number
	},
	create_date:{
		type: Number
	},
	customer_id:{
		type: String
	}
});
var listorders = module.exports = mongoose.model('listorders', listordersSchema);
module.exports.createlistorders = function(newlistorders, callback){
	newlistorders.save(callback);
}
module.exports.editlistorders = function(id,newlistorders, callback){
	listorders.findByIdAndUpdate(id, newlistorders,callback);
}
module.exports.findOneAndUpdatelistorders = function(query,newlistorders, callback){
	listorders.findOneAndUpdate(query, newlistorders, function(err) {
	  	if (err) throw err;

	});
}
module.exports.dellistorders = function(id,callback){
	listorders.findByIdAndRemove(id, function(err, listorderss) {
	});
}
module.exports.getlistordersById = function(id, callback){
	listorders.findById(id, callback);
}
module.exports.SumTotalMonney = function(from_date,to_date,callback){
	var query = {};
	listorders.aggregate([
	    { $match: {
	    	 create_date : {
                '$gte':from_date,
                '$lt':to_date
            }
	    } },
	    { $group: { _id: null, total_monney: { $sum: "$total_monney" },buy_monney: { $sum: "$buy_monney" } ,saleoff_monney: { $sum: "$saleoff_monney" } } }
	],callback);
}
module.exports.getAlllistorders = function(page,per_page,callback){
	var query = {};
	listorders.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'order_id': -1 });
}
module.exports.countlistorders = function(callback){
	var query = {};
	listorders.count(query, callback);
}
module.exports.countlistordersByDate = function(from_date,to_date,callback){
	var query = {$and: [
		{"create_date":{ $gt:from_date}},
		{"create_date":{ $lt:to_date}}
      ]
		
  	};
	listorders.count(query, callback);
}
module.exports.countCompanyInlistorders = function(companyid,callback){
	var query = {company_id:companyid};
	listorders.count(query, callback);
}
module.exports.getOrderCode = function(callback){
	var jsons = {};
	listorders.countMaxlistordersCode(function(err, companys) {
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
module.exports.countMaxlistordersCode = function(callback){
	var query = {};
	listorders.findOne(query,callback).sort({'order_id': -1 });
}
module.exports.getAlllistordersByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	listorders.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'order_id': -1 });
}
module.exports.getlistordersByDate = function(page,per_page,from_date,to_date,callback){
	var query = {};
	listorders.find(query, callback).where("create_date").gte(from_date).lte(to_date).skip(per_page * (page - 1)).limit(per_page).sort({'order_id': -1 });;
}
module.exports.getlistordersByUserDate = function(userid,type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		var query = {create_user:userid,status:type};
	}
	else{
		var query = {create_user:userid};
	}
	listorders.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}