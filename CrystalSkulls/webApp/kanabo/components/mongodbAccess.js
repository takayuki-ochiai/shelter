/**
 * mongodbAccess
 */
var mongodb = require('mongodb');

mongodb.MongoClient.connect("mongodb://localhost/kanabo", function(err, database) {
	db = database;
	user = db.collection("user");
	admin = db.collection("admin");
	segmentMaster = db.collection("segmentMaster");
});

exports.getUser = function(queryStr, callback) {
	return user;
};

module.exports = {
	getUser: function() {
		return user;
	},
	getAdmin: function() {
		return admin;
	},
	getSegmentMaster: function() {
		return segmentMaster;
	}
};