var express = require('express');
var router = express.Router();
var mongo = require('../components/mongodbAccess.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('mypage', { title: 'mypage', id: req.session.userId});
});

router.get('/segmentMaster', function(req, res, next) {
  res.render('segmentMaster', { title: 'セグメントマスタ編集' });
});

/* セグメントマスタ問い合わせ */
router.get("/api/segmentMasterData", function(req, res) {
	segmentMaster = mongo.getSegmentMaster();
	segmentMaster.findOne({latest:true}, function(err, segmentMasterData) {
		res.send(segmentMasterData);
	});
});

/* ユーザーセグメント保存 */
router.post("/api/segmentMasterData", function(req, res) {
	segmentMaster = mongo.getSegmentMaster();
	segmentMaster.findOne({latest:true}, function(err, segmentMasterData) {
		var version = 1;
		if (segmentMasterData != undefined && segmentMasterData != null) {
			version = parseInt(segmentMasterData.version) + 1;
		}
		
		segmentMaster.update({latest:true}, {$set:{latest:false}}, function(err, result) {
			var latestSegmentMaster = {version:version, latest:true, setting:req.body}
			segmentMaster.insert(latestSegmentMaster, function(err, result) {
				console.log("セグメントマスタ更新。latestVersion : "　+ version);
			});
		});
	});
});

module.exports = router;
