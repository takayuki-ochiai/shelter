var segments = require('./segments.js');

module.exports = {
	segment: function(setting) {
		return generateSegment(setting);
	}
};

function generateSegment(elements) {
	var html = "";
	for (index in elements) {
		element = elements[index];
		html += `<div class="element" elementKey="${element.key}">`
		html += `<span>${element.dispName}</span>`
		if (element.repetition) {
			html += `<div class="repetition">`
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
		if (element.repetition) {
			html += `</div>`
			html += `<button onclick="addElement('${element.key}')">追加</button>`
			html += `<button onclick="deleteElement('${element.key}')">削除</button>`
		}
		html += `</div>`
	}
	return html;
}
