var mongoose = require('mongoose');
// User Schema
var testimonialsSchema = mongoose.Schema({
	testimonial_name:{
		type: String,
	},
	testimonial_title:{
		type: String,
	},
	testimonial_description:{
		type: String,
	},
	image_path:{
		type: String,
	},
	image:{
		type: String,
	},
	customer_id:{
		type: Number,
	},
});
var testimonials = module.exports = mongoose.model('testimonials', testimonialsSchema);
module.exports.createtestimonials = function(newtestimonials, callback){
	newtestimonials.save(callback);
}
module.exports.edittestimonials = function(id,newtestimonials, callback){
	testimonials.findByIdAndUpdate(id, newtestimonials,callback);
}
module.exports.findOneAndUpdatetestimonials = function(query,newtestimonials, callback){
	testimonials.findOneAndUpdate(query, newtestimonials, callback);
}
module.exports.deltestimonials = function(id,callback){
	testimonials.findByIdAndRemove(id, function(err, testimonialss) {
  	if (err) throw err;
	});
}
module.exports.gettestimonialsById = function(id, callback){
	var query = {_id:id};
	testimonials.findOne(query, callback);
}
module.exports.gettestimonialsbycustomer = function(customer_id,page,per_page, callback){
	var query = {customer_id:customer_id};
	testimonials.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}
module.exports.getcounttestimonialsbycustomer = function(num,customer_id,callback){
	var query = {customer_id:customer_id};
	testimonials.find(query, callback).skip(0).limit(num).sort({'customer_id': -1 });
}
module.exports.getAlltestimonials = function(page,per_page,callback){
	var query = {};
	testimonials.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getalltestimonialsnotpage = function(callback){
	var query = {};
	testimonials.find(query, callback);
}
module.exports.counttestimonials = function(callback){
	var query = {};
	testimonials.count(query, callback);
}

module.exports.getAlltestimonialsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	testimonials.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'testimonials_id': -1 });
}
module.exports.gettestimonialsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	testimonials.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}