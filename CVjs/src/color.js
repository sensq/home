
// RGBフィルター
CV.rgb = function (inImg, mode) {
	var outImg = CV.createTmpCanvas();
	// 全画素のRの値をMAXにする
	if (mode == "R") {
		for (var y = 0; y < CV.height; y++) {
			for (var x = 0; x < CV.width; x++) {
				var i = (y * CV.width + x) * 4;
				outImg.data[i] = 255;
				outImg.data[i + 1] = inImg.data[i + 1];
				outImg.data[i + 2] = inImg.data[i + 2];
				outImg.data[i + 3] = inImg.data[i + 3];
			}
		}
	}
		// 全画素のGの値をMAXにする
	else if (mode == "G") {
		for (var y = 0; y < CV.height; y++) {
			for (var x = 0; x < CV.width; x++) {
				var i = (y * CV.width + x) * 4;
				outImg.data[i] = inImg.data[i];
				outImg.data[i + 1] = 255;
				outImg.data[i + 2] = inImg.data[i + 2];
				outImg.data[i + 3] = inImg.data[i + 3];
			}
		}
	}
		// 全画素のBの値をMAXにする
	else if (mode == "B") {
		for (var y = 0; y < CV.height; y++) {
			for (var x = 0; x < CV.width; x++) {
				var i = (y * CV.width + x) * 4;
				outImg.data[i] = inImg.data[i];
				outImg.data[i + 1] = inImg.data[i + 1];
				outImg.data[i + 2] = 255;
				outImg.data[i + 3] = inImg.data[i + 3];
			}
		}
	}
	return outImg;
}


// ネガポジ反転
CV.negaposi = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i] = 255 - inImg.data[i];
			outImg.data[i + 1] = 255 - inImg.data[i + 1];
			outImg.data[i + 2] = 255 - inImg.data[i + 2];
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// グレースケール
CV.gray = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// グレースケールの定数
			var gray =
				+0.299 * inImg.data[i]
				+ 0.587 * inImg.data[i + 1]
				+ 0.114 * inImg.data[i + 2];
			outImg.data[i + 0] = gray;
			outImg.data[i + 1] = gray;
			outImg.data[i + 2] = gray;
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// セピア調
CV.sepia = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// グレースケールの定数
			var gray =
				+0.299 * inImg.data[i]
				+ 0.587 * inImg.data[i + 1]
				+ 0.114 * inImg.data[i + 2];
			outImg.data[i + 0] = gray / 255 * 240;
			outImg.data[i + 1] = gray / 255 * 200;
			outImg.data[i + 2] = gray / 255 * 140;
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// 二値化
CV.binary = function (inImg, threshold) {
	var outImg = CV.createTmpCanvas();
	var bin = [];
	// LUT作成（閾値を境に白と黒にわける）
	for (var i = 0; i < threshold; i++) {
		bin[i] = 0;
	}
	for (var i = threshold; i < 256; i++) {
		bin[i] = 255;
	}
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// グレースケールの定数
			var gray = Math.round(
				+0.299 * inImg.data[i]
				+ 0.587 * inImg.data[i + 1]
				+ 0.114 * inImg.data[i + 2]
			);
			outImg.data[i + 0] = bin[gray];
			outImg.data[i + 1] = bin[gray];
			outImg.data[i + 2] = bin[gray];
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// 256色(8bit)を任意のbit(2の乗数)に落とし込む
CV.decreaseColor = function (inImg, bit) {
	var LUT = [256];
	for (i = 0; i < 256; i++) {
		var numColor = Math.pow(2, bit);
		var base = 256 / numColor;
		var tmp = base / 2;
		var i;
		for (j = 1; j < numColor; j++) {
			if (i > (j * base))
				tmp += base;
		}
		LUT[i] = tmp;
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