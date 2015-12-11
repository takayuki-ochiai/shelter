/**
 * segment
 */
var app = angular.module('userSegment', ['ngResource']);

app.factory('segmentData', function($resource) {
	return $resource('api/segmentData');
});

app.controller('segmentCtrl', function($scope, segmentData) {
	$scope.register = function() {
		var segment = parseElements($('#user_segment').children('.element'));
		segmentData.save(JSON.stringify(segment), function() {
			alert("設定を保存しました。");
		});
	};


	segmentData.get(function(userInfo){
		if (userInfo.segment != undefined) {
			renderSegment(userInfo.segment);
		}
	});
});

function renderSegment(segment) {
	for (elementKey in segment) {
		var elementValue = segment[elementKey];
		if ($.isPlainObject(elementValue)) {
			renderSegment(elementValue);
		} else if ($.isArray(elementValue)) {
			var lastElementView = $(`[elementkey=${elementKey}] .repetition`).filter(':last');
			if (lastElementView.length == 0) {
				continue;
			}
			var clone = lastElementView.clone(true);
			for (valueIndex in elementValue) {
				var repetitionElementValue  = elementValue[valueIndex];
				if ($.isPlainObject(repetitionElementValue)) {
					renderSegment(repetitionElementValue);
				}
				var repetitionElementView = $(`[elementkey=${elementKey}] .repetition`).filter(':last');
				if (0 < parseInt(valueIndex)) {
					repetitionElementView.after(clone);
					clone = clone.clone(true);
					repetitionElementView = $(`[elementkey=${elementKey}] .repetition`).filter(':last');
				}
				repetitionElementView.children('select').val(repetitionElementValue);
			}
		} else {
			var elementView = $(`[elementkey=${elementKey}] select`).val(elementValue);
		}
	}
}

function addElement(elementName) {
	var element = $(`[elementkey=${elementName}] .repetition`).filter(':last');
	var clone = element.clone(true);
	element.after(clone);
}

function deleteElement(elementName) {
	var element = $(`[elementkey=${elementName}] .repetition`).filter(':last');
	$(element).remove();
}

function parseElements(inputSegments) {
	var segment = {};
	inputSegments.each(function() {
		var elementKey = $(this).attr('elementkey');
		if ($(this).children('.repetition').length == 0) {
			// 繰返し項目じゃない
			var value = perseElement($(this));
			if (value != undefined && value != null && value != '') {
				segment[elementKey] = value;
			}
		} else {
			// 繰返し項目
			var values = [];
			$(this).children('.repetition').each(function() {
				var value = perseElement($(this));
				if (value != undefined && value != null && value != '') {
					values.push(value);
				}
			});
			if (0 < values.length) {
				segment[elementKey] = values;
			}
		}
	});
	if ($.isEmptyObject(segment)) {
		return null;
	}
	return segment;
}

function perseElement(inputSegment) {
			if (0 < inputSegment.children('.element').length) {
				// 子供がいる
				return parseElements(inputSegment.children('.element'));
			} else {
				var value = inputSegment.children('select').val();
				return value;
			}
}