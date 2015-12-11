var express = require('express');
var router = express.Router();

var mongo = require('../components/mongodbAccess.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Kanaboログイン' });
});

router.post('/login', function(req, res) {
	var id = req.body.id;
	var password = req.body.password;

	authUser(id, password, function(isAuth) {
		if (isAuth) {
			req.session.userId = id;
			res.redirect('/users');
		} else {
			req.session.destroy();
			res.redirect('/');
		}
	});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'サインアップ' });
});

router.post('/signup', function(req, res) {
	var id = req.body.id;
	var password = req.body.password;

	signupUser(id, password, function(isSignup) {
		if (isSignup) {
			req.session.userId = id;
			res.redirect('/users');
		} else {
			res.render('signup', { title: 'サインアップ', err: 'IDが重複しています。' });
		}
	});
});

module.exports = router;

function authUser(id, password, callback) {
	user = mongo.getUser();
	user.findOne({"id":id, "password":password}, function(err, userInfo) {
		callback(userInfo != null);
	});
}

function signupUser(id, password, callback) {
	user = mongo.getUser();
	count = user.find({"id":id}).items.length;
	if (0 < count) {
		callback(false);
	}

	user.insert({'id':id, 'password':password}, function(err, result){
		if (err) {
			callback(false);
		} else {
			callback(true);
		}
	});
}