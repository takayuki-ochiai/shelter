var mongo = require('./mongodbAccess.js')

/**
 * segments
 */

var segmentTemplate = {
	dispName:{
  	dispName: "表示名",
  	type: "text",
  	repetition: false
	},
	key: {
  	dispName: "キー",
  	type: "text",
  	repetition: false
	},
	choices: {
	  dispName: "選択肢",
	  type: "text",
	  repetition: true,
	  childElements:
	    [
	      {
	        dispName: "選択値",
	        key: "choice",
	        repetition: false
	      }
	    ]
	},
	searchMethod: {
	  dispName: "検索方法",
	  type: "select",
	  choice: [
	    {
	      key: "部分一致",
	      value: "1"
	    },
	    {
	    	key: "完全一致",
	    	value: "2"
	    }
	  ]
	}
}
var segmentMaster = [
		{
			dispName:"生年月日(年)",
			key:"birthday_year",
			choice:["1998","1999"],
			searchMethod:"1",
			repetition:false
		},
		{
			dispName:"生年月日(月)",
			key:"birthday_month",
			choice:["1","2","3","4","5","6","7","8","9","10","11","12"],
			searchMethod:"1",
			repetition:false
		},
		{
			dispName:"住所",
			key:"address",
			hasChild:true,
			choice:["神奈川","山梨"],
			searchMethod:"1",
			repetition:false,
			childElements:
				[
					{
						dispName:"都道府県",
						key:"prefecture",
						choice:["神奈川","山梨"],
						searchMethod:"1",
						repetition:false
					},
					{
						dispName:"市区町村",
						key:"city",
						choice:["保土ヶ谷区","笛吹市"],
						searchMethod:"1",
						repetition:false
					}
				]
		},
		{
			dispName:"車",
			key:"car",
			choice:["トヨタ車","ホンダ車","日産車"],
			searchMethod:"1",
			repetition:true
		}
	]

exports.getSegmentMaster = function() {
	var segmentMaster = mongo.getSegmentMaster();
	segmentMaster.findOne({}, function(err, segmentMaster) {
		if (segmentMaster == null) {
			return {};
		} else {
			return segmentMaster;
		}
	});
};
