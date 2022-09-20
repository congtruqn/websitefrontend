var mongoose = require('mongoose');
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
module.exports.getTestimonialsByCustomer = async function(num,customer_id){
	var query = {customer_id:customer_id};
	return await testimonials.find(query).skip(0).limit(num).exec();
}