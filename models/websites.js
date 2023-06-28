var mongoose = require('mongoose');
// User Schema
var websitesSchema = mongoose.Schema({
	website_id:{
		type: String
	},
	website_url:{
		type: String
	},
	website_protocol:{
		type: String
	},
	template:{
        type: String,
    },
    customer: {
        type: String,
        unique: true,
    },
	detail:[{
		lang: String,
		title: String,
		keyword: String,
		description: String,
		company_name:String,
		slogan:String
	}],
	website_image:{
		type: String
	},
	website_image_path:{
		type: String
	},
	customer_id:{
		type: Number
	},
	customer_name:{
		type: String
	},
	customer_phone:{
		type: String
	},
	customer_email:{
		type: String
	},
	customer_address:{
		type: String
	},
	title:{
		type: String
	},
	description:{
		type: String
	},
	keyword:{
		type: String
	},
	hotline:{
		type: String
	},
	company_name:{
		type: String
	},
	taxcode:{
		type: String
	},
	customer_username:{
		type: String
	},
	template_id:{
		type: String
	},
	logo:{
		type: String
	},
	image_path:{
		type: String
	},
	type:{
		type: String
	},
	is_template:{
		type: Number
	},
	products_per_page:{
		type: Number
	},
	news_per_page:{
		type: Number
	},
	product_size_thump:{
		type: Number
	},
	product_size_medium:{
		type: Number
	},
	product_size_large:{
		type: Number
	},
	news_size_thump:{
		type: Number
	},
	news_size_medium:{
		type: Number
	},
	news_size_large:{
		type: Number
	},
	image_height_ratio:{
		type: Number
	},
	products_per_cat_home:{
		type: Number
	},
	products_name_letters:{
		type: Number
	},
	from_district_id:{
		type: Number
	},
	num_hot_products:{
		type: Number
	},
	num_hot_news:{
		type: Number
	},
	logo_size:{
		type: Number
	},
	multi_language:{
		type: Number
	},
});
var websites = module.exports = mongoose.model('listwebsites', websitesSchema);
module.exports.getwebsitesById = function(id, callback){
	var query = {_id:id};
	websites.findOne(query, callback);
}
module.exports.getwebsitesbycustomerid = function(id, callback){
	var query = {customer_id:id};
	websites.findOne(query, callback);
}
module.exports.getwebsitesbyurl = function(url, callback){
	var query = {website_url:url};
	websites.findOne(query, callback);
}
module.exports.getAllWebsiteTemplateByPage = async function(page,per_page){
	var query = {is_template:1};
	return await websites.find(query).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 }).exec();
}
module.exports.gettemplatewebsites = function(num,callback){
	var query = {is_template:1};
	websites.find(query, callback).skip(0).limit(num).sort({'customer_id': -1 });
}
module.exports.getallwebsitesnotpage = function(callback){
	var query = {};
	websites.find(query, callback);
}
module.exports.countWebsitesTemplate = async function(){
	var query = {is_template:1};
	return await websites.count(query).exec();
}
module.exports.countmaxcustomerid = function(callback){
	var query = {};
	websites.findOne(query,callback).sort({'customer_id': -1 });
}