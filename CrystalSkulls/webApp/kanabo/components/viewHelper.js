var segments = require('./segments.js');

module.exports = {
	segment: function(setting) {
		return generateSegment(setting);
	}
};

function generateSegment(elements) {
	var html = "";
	var repetationElement = null;
	for (index in elements) {
		element = elements[index];
		html += `<div class="element" elementKey="${element.key}">`
		html += `<span>${element.dispName}</span>`
		if (element.repetition) {
			html += `<div class="repetition">`
			// elementの参照先は書き換えられる場合があるので、退避しておく
			repetationElement = element;
		}
		if (element.childElements == undefined) {
			html += `<select>`
			var options = '<option value="">選択してください。</option>';
			for (choiceIndex in element.choice) {
				var choice = element.choice[choiceIndex];
				options += `<option value="${choice}">${choice}</option>
				`;
			}
			html += options;
			html += `</select>`;
		} else {
			html += generateSegment(element.childElements);
		}
		if (repetationElement != undefined && repetationElement != null) {
			html += `</div>`;
			html += `<button onclick="addElement('${repetationElement.key}')">追加</button>`;
			html += `<button onclick="deleteElement('${repetationElement.key}')">削除</button>`;
			// 退避していたrepetationElementを削除
			repetationElement = null;
		}
		html += `</div>`
	}
	return html;
}
