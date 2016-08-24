window.id = 0;
$('#json #generate').click(function() {
	eval("window.json = " + $('#json textarea').val());
	console.info(window.json);

	$.ajax({
		type : 'POST',
		url : 'https://script.google.com/macros/s/AKfycbxF-s25Ceg0v1i9ZqRimDBDJi2gWMCfQSjKAc1cmlWx3_e1G7py/exec',
		data : {
			data : JSON.stringify(window.json)
		}
	}).done(function(id) {
		window.id = id;
		$('#result').attr('src', 'https://docs.google.com/spreadsheets/d/'+id+'/edit?rm=minimal');
	});
});
$('#json #xls').click(function() {
	if (!window.id) {
		alert('Do the magic first!');
		return;
	}
	window.open('https://docs.google.com/spreadsheets/d/'+window.id+'/export?format=xlsx', '_blank');
});
$('#json #pdf').click(function() {
	if (!window.id) {
		alert('Do the magic first!');
		return;
	}
	window.open('https://docs.google.com/spreadsheets/d/'+window.id+'/export?format=pdf', '_blank');
});

function _arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

$.ajax({type:'POST',url: 'https://script.google.com/macros/s/AKfycbxA4Hg2k2BofWDEXS6KDkWhABY50YYoW0jTifi83LrZU6bUkxQ/exec'}).done(function(result) {
	result = JSON.parse(result);
	for (var i =0;i<result.length;i++) {
		document.getElementById("ItemPreview" + (i+1)).src = "data:image/png;base64," + _arrayBufferToBase64(result[i].thumbnail);

	}
});