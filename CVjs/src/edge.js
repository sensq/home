
/////////////
// �G�b�W���o //
/////////////

// �G�b�W���o�i8�ߖT���v���V�A���j
CV.edge = function (inImg) {
	var outImg = CV.createTmpCanvas();
	outImg = CV.sobel(inImg, 5);
	return outImg;
}

// �G�b�W���o�i4�ߖT���v���V�A���j
CV.edge2 = function (inImg) {
	var outImg = CV.createTmpCanvas();
	outImg = CV.sobel(inImg, 0);
	return outImg;
}

// �\�[�x���i��������0��n����4�ߖT�A5��n����8�ߖT���v���V�A���j
CV.sobel = function (inImg, course) {
	var outImg = CV.createTmpCanvas();
	switch (course) {
		case 0: var S = [0, 1, 0, 1, -4, 1, 0, 1, 0]; break;	// 4�ߖT
		case 1: var S = [0, -1, -2, 1, 0, -1, 2, 1, 0]; break;
		case 2: var S = [-1, -2, -1, 0, 0, 0, 1, 2, 1]; break;
		case 3: var S = [-2, -1, 0, -1, 0, 1, 0, 1, 2]; break;
		case 4: var S = [1, 0, -1, 2, 0, -2, 1, 0, -1]; break;
		case 5: var S = [1, 1, 1, 1, -8, 1, 1, 1, 1]; break;	// 8�ߖT
		case 6: var S = [-1, 0, 1, -2, 0, 2, -1, 0, 1]; break;
		case 7: var S = [2, 1, 0, 1, 0, -1, 0, -1, -2]; break;
		case 8: var S = [1, 2, 1, 0, 0, 0, -1, -2, -1]; break;
		case 9: var S = [0, 1, 2, -1, 0, 1, -2, -1, 0]; break;
	}
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				outImg.data[i] =
					S[0] * inImg.data[i - CV.width * 4 - 4] + S[1] * inImg.data[i - CV.width * 4] + S[2] * inImg.data[i - CV.width * 4 + 4] +
					S[3] * inImg.data[i - 4] + S[4] * inImg.data[i] + S[5] * inImg.data[i + 4] +
					S[6] * inImg.data[i + CV.width * 4 - 4] + S[7] * inImg.data[i + CV.width * 4] + S[8] * inImg.data[i + CV.width * 4 + 4];
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}