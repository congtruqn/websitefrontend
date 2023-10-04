const mongoose = require("mongoose")
const newscontentsSchema = mongoose.Schema({
	content_id:{
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
	image1:{
		type: String,
	},
	image2:{
		type: String,
	},
	image3:{
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
	list_parent:[{
		parent_name: String,
		parent_id: String,
		parent_url: String,
	}],
	rank:{
		type: Number,
	},
	hot:{
		type: Number,
	},
	new:{
		type: Number,
	},
	show:{
		type: Number,
	},
	title:{
		type: String,
	},
	keyword:{
		type: String,
	},
	desc:{
		type: String,
	},
	name:{
		type: String,
	},
	description:{
		type: String,
	},
	content:{
		type: String,
	},
});
const newscontents = module.exports = mongoose.model('newscontents', newscontentsSchema);
module.exports.getNewsInfo = async function( customer_id, id ){
	const query = { content_id:id,customer_id:customer_id };
	return await newscontents.findOne(query).exec();
}
module.exports.getNewNews = async function(customer_id,count){
	const query = {customer_id:customer_id,'new':1};
	return await newscontents.find(query).skip(0).limit(count).sort({'rank': -1 ,'content_id':-1,'create_date': -1 }).exec();
}
module.exports.getnewsnontentsbycatcount = async function(cat_id,page,per_page,customer_id){
	const query = {'list_parent.parent_id':cat_id,show:1,customer_id:customer_id};
	return await newscontents.find(query).skip(per_page * (page - 1)).limit(per_page).sort({'rank': -1 ,'content_id':-1,'create_date': -1 }).exec();
}
module.exports.getRateNews = async function( cat_id, content_id, count, customer_id ){
	const query = {customer_id:customer_id,parent_id:cat_id,show:1,content_id:{ $ne: content_id }};
	return await newscontents.find(query).skip(0).limit(count).sort({'rank': -1 ,'content_id':-1,'create_date': -1 }).exec();
}
module.exports.countNewsByCat = async function(cat_id,customer_id){
	const query = {'list_parent.parent_id':cat_id,show:1,customer_id:customer_id};
	return await newscontents.count(query).exec();
}
