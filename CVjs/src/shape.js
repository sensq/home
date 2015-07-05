
// ‚’¼”½“]
CV.vmirror = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			var j = (y * CV.width + (CV.width - x - 1)) * 4;
			outImg.data[i + 0] = inImg.data[j + 0];
			outImg.data[i + 1] = inImg.data[j + 1];
			outImg.data[i + 2] = inImg.data[j + 2];
			outImg.data[i + 3] = inImg.data[j + 3];
		}
	}
	return outImg;
}

// …•½”½“]
CV.hmirror = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			var j = ((CV.height - y - 1) * CV.width + x) * 4;
			outImg.data[i + 0] = inImg.data[j + 0];
			outImg.data[i + 1] = inImg.data[j + 1];
			outImg.data[i + 2] = inImg.data[j + 2];
			outImg.data[i + 3] = inImg.data[j + 3];
		}
	}
	return outImg;
}

// Šgki–¢Š®¬j
CV.scaling = function (inImg, rate) {
	rate = rate / 100;
	var canvas = document.getElementById(outputDiv);
	var context = canvas.getContext('2d');
	canvas.width = Math.ceil(canvas.width * rate);
	canvas.height = Math.ceil(canvas.height * rate);
	CV.width = canvas.width;
	CV.height = canvas.height;
	context.scale(rate, rate);
	context.drawImage(CV.image, 0, 0);

	var temp = context.getImageData(0, 0, canvas.width, canvas.height);
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i + 0] = temp.data[i + 0];
			outImg.data[i + 1] = temp.data[i + 1];
			outImg.data[i + 2] = temp.data[i + 2];
			outImg.data[i + 3] = temp.data[i + 3];
		}
	}
	return outImg;
}
