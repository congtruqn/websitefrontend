var bcrypt = require('bcryptjs');
var mongoose = require("mongoose")
// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	customer_id: {
		type: Number
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	phone: {
		type: String
	},
	address: {
		type: String
	},
	type: {
		type: Number
	},
	status: {
		type: Number
	}
});

var User = module.exports = mongoose.model('users', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.editUser = function(id,newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        User.findByIdAndUpdate(id, newUser, function(err) {
	  			if (err) throw err;
    			console.log('User successfully updated!');
			});
	    });
	});
}
module.exports.editUserNotPass = function(id,newCompany, callback){
	User.findByIdAndUpdate(id, newCompany, function(err) {
	  	if (err) throw err;
    		console.log('User successfully updated!');
	});
}
module.exports.dellUser = function(id,callback){
	User.findByIdAndRemove(id, function(err, user) {
  	if (err) throw err;
  		console.log(user);
	});
}

module.exports.getAllUser = function(page,per_page,callback){
	var query = {};
	User.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}
module.exports.getAllUserNotPage = function(callback){
	var query = {};
	User.find(query, callback);
}

module.exports.CountUser = function(callback){
	var query = {};
	User.count(query, callback);
}
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}
module.exports.getcustomeruser = function(username,customer_id, callback){
	var query = {username: username,customer_id:customer_id};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}