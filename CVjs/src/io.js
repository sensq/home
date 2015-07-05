

// ���͂��ꂽCanvas�v�f�̏���ǂݍ���ŕԂ�
CV.read = function (canv) {
	var canvas = document.getElementById(canv);
	var context = canvas.getContext('2d');
	var input = context.getImageData(0, 0, canvas.width, canvas.height);
	return input;
}

// ���͂��ꂽCanvas�v�f�ɉ摜��`��
CV.draw = function (canv, outImg) {
	var canvas = document.getElementById(canv);
	var context = canvas.getContext('2d');
	context.putImageData(outImg, 0, 0);
	// ���������
	CV.history.push(outImg);
}

// �摜�ۑ�
// �Q�l�ɂ��܂��� �� http://jsdo.it/Yukisuke/p311
CV.save = function () {
	var canvas;
	if (!document.getElementById("change").checked) {
		canvas = document.getElementById(outputDiv);
	} else {
		canvas = document.getElementById("img");
	}
	var base64 = canvas.toDataURL();	// firefox�Ȃ�toblob�Œ���blob�ɂ��ĕۑ��ł��܂��B
	var blob = Base64toBlob(base64);
	var name = "js_" + info.name + ".png";
	saveBlob(blob, name);

	function Base64toBlob(_base64) {
		var i;
		var tmp = _base64.split(',');
		var data = atob(tmp[1]);
		var mime = tmp[0].split(':')[1].split(';')[0];

		//var buff = new ArrayBuffer(data.length);
		//var arr = new Uint8Array(buff);
		var arr = new Uint8Array(data.length);
		for (i = 0; i < data.length; i++) { arr[i] = data.charCodeAt(i); }
		var blob = new Blob([arr], { type: mime });
		return blob;
	}
	function saveBlob(_blob, _file) {
		if ( /*@cc_on ! @*/ false) {	// IE�̏ꍇ
			window.navigator.msSaveBlob(_blob, _file);
		} else {
			var url = (window.URL || window.webkitURL);
			var data = url.createObjectURL(_blob);
			var e = document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
			a.href = data;
			a.download = _file;
			a.dispatchEvent(e);
		}
	}
}
