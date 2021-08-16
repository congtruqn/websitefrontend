var mongoose = require("mongoose")
// User Schema
var DistrictSchema = mongoose.Schema({
	ProvinceID:{
		type: Number,
	},
	ProvinceName: {
		type: String,
	},
	Code:{type: String,},
	IsEnable:{type: Number},
	RegionID:{type: Number},
	UpdatedBy:{type: Number},
	Status:{type: Number},
});

var District = module.exports = mongoose.model('provinces', DistrictSchema);
module.exports.getallprovinces = function(callback){
	var query = {};
	District.find(query, callback).sort({CountryID:-1});
}