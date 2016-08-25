var jsons = [{
	name: 'User json',
	obj: {
		header_title: 'my header title',
		user: {
			name: 'Matheus',
			skills: [{
				language: 'java',
				level: '3'
			}, {
				language: 'ruby',
				level: '4'
			}, {
				language: 'python',
				level: '1'
			}],
			experiences: [{
				cource_name: 'ciencia da computacao',
				institution: 'unicamp'
			}, {
				cource_name: 'informática',
				institution: 'cotuca'
			}]
		}
	}
}];

var settings = [{
	name: 'No config',
	obj: {}
}];

window.id = 0;
$('#json #generate').click(function() {
	eval("window.json = " + $('#json textarea').val());
	console.info(window.json);

	$.ajax({
		type: 'POST',
		url: 'https://script.google.com/macros/s/AKfycbxF-s25Ceg0v1i9ZqRimDBDJi2gWMCfQSjKAc1cmlWx3_e1G7py/exec',
		data: {
			data: JSON.stringify(window.json)
		}
	}).done(function(id) {
		window.id = id;
		$('#result').attr('src', 'https://docs.google.com/spreadsheets/d/' + id + '/edit?rm=minimal');
	});
});
$('#json #xls').click(function() {
	if (!window.id) {
		alert('Do the magic first!');
		return;
	}
	window.open('https://docs.google.com/spreadsheets/d/' + window.id + '/export?format=xlsx', '_blank');
});
$('#json #pdf').click(function() {
	if (!window.id) {
		alert('Do the magic first!');
		return;
	}
	window.open('https://docs.google.com/spreadsheets/d/' + window.id + '/export?format=pdf', '_blank');
});

$(document).on('click', '.select-element', function() {
	$(this).parents('li').addClass('selected').siblings().removeClass('selected');
}).on('click','.templates .show-element', function() {
	var li = $(this).parents('li'),
		index = li.index(),
		card = $('.card-template-visualizer');
	card.show();
	card.find('img')[0].src = "data:image/png;base64," + _arrayBufferToBase64(templates[index].thumbnail);
	card.find('a.see-on-drive')[0].href = templates[index].url;
}).on('click','.jsons .show-element, .config .show-element', function() {
	var li = $(this).parents('li'),
		index = li.index(),
		card = $('.card-json-visualizer');
	card.show();
	card.find('textarea').val(JSON.stringify(jsons[index].obj, null, 4));
	 
});

function _arrayBufferToBase64(buffer) {
	var binary = '';
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

var templates = [];
$.get('/pages/list-item.html').done(function(listItemHtml) {
	var template = doT.template(listItemHtml);
	$.ajax({
		type: 'POST',
		url: 'https://script.google.com/macros/s/AKfycbxA4Hg2k2BofWDEXS6KDkWhABY50YYoW0jTifi83LrZU6bUkxQ/exec'
	}).done(function(result) {
		templates = JSON.parse(result);
		//	document.getElementById("ItemPreview" + (i + 1)).src = "data:image/png;base64," + _arrayBufferToBase64(templates[i].thumbnail);
		populateList(templates, {
			img: 'sheet',
			alt: 'SpreadSheet',
			firstText: 'SpreadSheet',
			secondText: 'Template'
		}, 'name', $('.templates ul'), template);
		$('ul li:first-child .select-element').click();
	});
	populateList(jsons, {
		img: 'json',
		alt: 'Json',
		firstText: 'Json',
		secondText: 'Template'
	}, 'name', $('.jsons ul'), template);
	populateList(settings, {
		img: 'config',
		alt: 'Settings',
		firstText: 'Settings',
		secondText: 'Template'
	}, 'name', $('.configs ul'), template);
});


var populateList = function(list, obj, titlePropertie, container, template) {
	var templateHtml = '';
	for (var i = 0; i < list.length; i++) {
		var cloneObj = JSON.parse(JSON.stringify(obj));
		cloneObj.title = list[i][titlePropertie];
		templateHtml += template(cloneObj);
	}
	container.html(templateHtml);
};