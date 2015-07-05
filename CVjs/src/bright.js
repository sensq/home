
/////////////
// 明度補正 //
/////////////

// コントラスト
CV.contrast = function (inImg, threshold) {
	// LUT作成
	var LUT = [256];
	// 傾き計算
	var a = 255 / (255 - threshold);
	for (var i = 0; i < 256; i++) {
		LUT[i] = Math.round(a * i);
		// 閾値より低い輝度は0にする
		if (i < threshold)
			LUT[i] = 0;
			// 閾値より高い輝度は255にする
		else if (i > (255 - threshold))
			LUT[i] = 255;
	}

	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i + 0] = LUT[inImg.data[i + 0]];
			outImg.data[i + 1] = LUT[inImg.data[i + 1]];
			outImg.data[i + 2] = LUT[inImg.data[i + 2]];
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// 明暗
CV.bright = function (inImg, rate) {
	var outImg = CV.createTmpCanvas();
	rate = rate / 100;
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i + 0] = rate * inImg.data[i + 0];
			outImg.data[i + 1] = rate * inImg.data[i + 1];
			outImg.data[i + 2] = rate * inImg.data[i + 2];
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// ガンマ補正（凄く遅い）
CV.gamma = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// ガンマ値
			var gamma = document.getElementById("gammaValue").value;
			outImg.data[i + 0] = 255 * Math.pow((inImg.data[i + 0] / 255), 1.0 / gamma);
			outImg.data[i + 1] = 255 * Math.pow((inImg.data[i + 1] / 255), 1.0 / gamma);
			outImg.data[i + 2] = 255 * Math.pow((inImg.data[i + 2] / 255), 1.0 / gamma);
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// ガンマ補正（LUT使用版）
CV.gammaLUT = function (inImg, gamma) {
	var outImg = CV.createTmpCanvas();
	// ガンマ値のLUT作成
	var LUT = [256];
	for (var i = 0; i < 256; i++) {
		LUT[i] = Math.round(Math.pow((i / 255), 1 / gamma) * 255);
	}
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i + 0] = LUT[inImg.data[i]];
			outImg.data[i + 1] = LUT[inImg.data[i + 1]];
			outImg.data[i + 2] = LUT[inImg.data[i + 2]];
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}