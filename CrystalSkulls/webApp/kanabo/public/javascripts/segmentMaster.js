/**
 * segment
 */
var template;

var app = angular.module('segmentMaster', ['ngResource']);

app.factory('segmentMasterData', function($resource) {
	return $resource('api/segmentMasterData');
});

app.controller('settingCtrl', function($scope, segmentMasterData) {
	$scope.register = function() {
		var setting = [];
		var elements = $('#setting').children('.element');
		elements.each(function() {
			// 完全に空のオブジェクトは入れない
			if (!$.isEmptyObject(parseElements($(this).children()))) {
				setting.push(parseElements($(this).children()));
			}
		})
		segmentMasterData.save(JSON.stringify(setting), function() {
			alert("設定を保存しました。");
		});
	};


	segmentMasterData.get(function(segmentMasterData){
		if (segmentMasterData.setting != undefined) {
			var elementView = $('.element')
			// グローバルに保存する
			template = elementView.clone(true);
			renderSetting(segmentMasterData.setting, elementView);
		}
	});
});

function renderSetting(setting, elementView) {
	setting.forEach(function(element, index) {
		if (index != 0) {
			// 次のエレメントビューを追加する
			tmpClone = template.clone(true);
			$(elementView).after(template);
			// 追加ボタンは削除
			$(elementView).children("input:button").remove();

			// elementViewは追加した次のエレメントを指すようにする.
			elementView = template;
			template = tmpClone;
		}

		renderElement(element, elementView);
	})
}

// function renderElement(element, elementView) {
// 	// ここから各エレメントの値をはめ込んでいく描画していく処理
// 	for (elementKey in element) {
// 		var settingKey = element[elementKey];
// 		renderElement(element, elementView);
// 	}
//
// 	// childElements属性が存在する場合は再帰呼び出し
// 	var childElements = element.childElements;
// 	if (childElements != undefined && childElements != null && childElements.length > 0) {
// 		renderSetting(element.childElements);
// 	}
// }

function renderElement(element, elementView) {
		elementView.children('.dispName').children('input').val(element.dispName);
		elementView.children('.key').children('input').val(element.key);
		if (element.choice != undefined && element.choice != null) {
			elementView.children('.choice').children('input').val(element.choice.toString());
		}
		elementView.children('.repetition').children('input:checkbox').prop("checked",element.repetition);

		var childElements = element.childElements;
		if (childElements == undefined || childElements == null) {
			// 子要素なしの場合
			elementView.children('.childElements').children('input:checkbox').prop("checked",false);
		} else {
			elementView.find('.childElementsSetting').append(template);
			template = template.clone(true);
			childElementView = elementView.find('.childElementsSetting').children('.element').filter(':last');
			renderSetting(childElements, childElementView);
			// for (childElementsIndex in childElements) {
			// 	childElement = childElements[childElementsIndex];
			// 	elementView.find('.childElementsSetting').append(template);
			// 	template = template.clone(true);
			// 	childElementView = elementView.find('.childElementsSetting').children('.element').filter(':last');
			// 	// Siblingを指定しないといけない
			// 	childElements = childElement.childElements
			// 	if (childElements == undefined || childElements == null) {
			// 		renderElement(childElement, childElementView);
			// 	}
			// }
		}
}

function changeHasChild(child) {

	//チェックされたらクローンする
	if ($(child).prop("checked")) {
		// 自分の2世代上のelement要素を取得してクローン
		tmpClone = template.clone(true);
		$(child).siblings('.childElementsSetting').append(template);
		template = tmpClone;

		// 自分の兄弟要素の選択方法はdisabledにする。
		$(child).parent().siblings('.choice').children('[settingkey]').attr('disabled',true);
		$(child).parent().siblings('.searchMethod').children('[settingkey]').attr('disabled',true);
	} else {
		// チェックが消されたら削除する。
		// REVIEW: 非表示にして、JSON変換時に値を取得しないにしたほうがいいかも
		$(child).siblings('.childElementsSetting').empty();

		// 子セグメントがない状態になったらdisabled解除
		$(child).parent().siblings('.choice').children('[settingkey]').removeAttr('disabled');
		$(child).parent().siblings('.searchMethod').children('[settingkey]').removeAttr('disabled');
	}





}

function parseElements(inputSegments) {
	var setting = {};
	inputSegments.each(function() {
			var settingKey = $(this).children('[settingKey]').attr('settingKey');
			if (settingKey == 'childElements') {
				var hasChildren = $(this).children('input:checkbox').prop("checked");
				if (hasChildren) {
					var chidElements = [];
					$(this).children('.childElementsSetting').children('.element').each(function() {
						if (!$.isEmptyObject(parseElements($(this).children()))) {
							chidElements.push(parseElements($(this).children()));
						}
					});
					if (0 < chidElements.length) {
						setting[settingKey] = chidElements;
					}
				}
			} else {
				var value = parseElement($(this).children('[settingKey]'), settingKey);
				if (value != undefined && value != null && value != '') {
					setting[settingKey] = value;
				}
			}
		}
	)
	return setting;
}

function parseElement(inputSegment, settingKey) {
	if (inputSegment.attr('disabled') == 'disabled') {
		return null;
	}

	if (settingKey == 'choice') {
		return inputSegment.val().split(",");
	}

	var type = inputSegment.attr('type');
	if (type == 'text' || type == 'select') {
		return inputSegment.val();
	}
	if (type == 'checkbox') {
		return inputSegment.prop("checked");
	}
	return null;
}

function addElement(sender) {
	tmpClone = template.clone(true);
	$(sender).parent().after(template);
	template = tmpClone;
	$(sender).remove();
}
