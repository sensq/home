
/////////////
// ���x�␳ //
/////////////

// �R���g���X�g
CV.contrast = function (inImg, threshold) {
	// LUT�쐬
	var LUT = [256];
	// �X���v�Z
	var a = 255 / (255 - threshold);
	for (var i = 0; i < 256; i++) {
		LUT[i] = Math.round(a * i);
		// 臒l���Ⴂ�P�x��0�ɂ���
		if (i < threshold)
			LUT[i] = 0;
			// 臒l��荂���P�x��255�ɂ���
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

// ����
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

// �K���}�␳�i�����x���j
CV.gamma = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// �K���}�l
			var gamma = document.getElementById("gammaValue").value;
			outImg.data[i + 0] = 255 * Math.pow((inImg.data[i + 0] / 255), 1.0 / gamma);
			outImg.data[i + 1] = 255 * Math.pow((inImg.data[i + 1] / 255), 1.0 / gamma);
			outImg.data[i + 2] = 255 * Math.pow((inImg.data[i + 2] / 255), 1.0 / gamma);
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	return outImg;
}

// �K���}�␳�iLUT�g�p�Łj
CV.gammaLUT = function (inImg, gamma) {
	var outImg = CV.createTmpCanvas();
	// �K���}�l��LUT�쐬
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