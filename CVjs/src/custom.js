
//////////////////////
// カスタムフィルタ //
//////////////////////

CV.custom = function (inImg, S, scale, offset) {
	var outImg = CV.createTmpCanvas();
	if (scale == 0) {
		for (var i = 0; i < S.length; i++) {
			scale += S[i];
		}
		if (scale == 0) {
			scale = 1;
		}
	}

	for (var y = 2; y < CV.height - 2; y++) {
		for (var x = 2; x < CV.width - 2; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				var tmp = CV.width * 4;
				outImg.data[i] = (
					S[0] * inImg.data[i - 2 * tmp - 8] + S[1] * inImg.data[i - 2 * tmp - 4] + S[2] * inImg.data[i - 2 * tmp + 0] + S[3] * inImg.data[i - 2 * tmp + 4] + S[4] * inImg.data[i - 2 * tmp + 8] +
					S[5] * inImg.data[i - 1 * tmp - 8] + S[6] * inImg.data[i - 1 * tmp - 4] + S[7] * inImg.data[i - 1 * tmp + 0] + S[8] * inImg.data[i - 1 * tmp + 4] + S[9] * inImg.data[i - 1 * tmp + 8] +
					S[10] * inImg.data[i - 0 * tmp - 8] + S[11] * inImg.data[i - 0 * tmp - 4] + S[12] * inImg.data[i - 0 * tmp + 0] + S[13] * inImg.data[i - 0 * tmp + 4] + S[14] * inImg.data[i - 0 * tmp + 8] +
					S[15] * inImg.data[i + 1 * tmp - 8] + S[16] * inImg.data[i + 1 * tmp - 4] + S[17] * inImg.data[i + 1 * tmp + 0] + S[18] * inImg.data[i + 1 * tmp + 4] + S[19] * inImg.data[i + 1 * tmp + 8] +
					S[20] * inImg.data[i + 2 * tmp - 8] + S[21] * inImg.data[i + 2 * tmp - 4] + S[22] * inImg.data[i + 2 * tmp + 0] + S[23] * inImg.data[i + 2 * tmp + 4] + S[24] * inImg.data[i + 2 * tmp + 8]
					) / scale + offset;
				outImg.data[i] = Math.min(255, Math.max(outImg.data[i], 0));
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}