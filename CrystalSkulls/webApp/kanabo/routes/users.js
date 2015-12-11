var express = require('express');
var router = express.Router();
var mongo = require('../components/mongodbAccess.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('mypage', { title: 'mypage', id: req.session.userId});
});

router.get('/segment', function(req, res, next) {
  var segmentMaster = mongo.getSegmentMaster();
  segmentMaster.findOne({latest:true}, function(err, segmentMaster) {
    if (segmentMaster == null) {
      res.render('userSegment', { title: 'ユーザー情報', setting: {} });
    } else {
      res.render('userSegment', { title: 'ユーザー情報', setting: segmentMaster.setting });
    }
  });
  // res.render('userSegment', { title: 'ユーザー情報', segmentMaster: segmentMaster });
});

/* ユーザーセグメント問い合わせ */
router.get("/api/segmentData", function(req, res) {
	user = mongo.getUser();
	user.findOne({id:req.session.userId}, function(err, userInfo) {
		if (userInfo == null) {
			res.send({});
		} else {
			userInfo.password='***';
			res.send(userInfo);
		}
	});
});

/* ユーザーセグメント保存 */
router.post("/api/segmentData", function(req, res) {
	user = mongo.getUser();
	user.update({id:req.session.userId}, {$set:{segment:req.body}}, function(err, result) {
		console.log(result);
	});
});

module.exports = router;
