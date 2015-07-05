/*
** �摜�����p�̏������W�߂����C�u����
** �g����, ����, �R�����g�͂������
** http://www47.atpages.jp/sensq/blog/2014/01/25/603/
** 
** 2014/02/23
** @S_SenSq
*/

// �I�u�W�F�N�g�쐬
var CV = function () { };
// �����i�[�p
CV.history = [];
CV.historyR = [];
// �ǂݍ��񂾉摜�i�[�p�i�X�P�[�����O�������΃O���[�o���ɂ���K�v�����j
CV.image;
// �摜�̃T�C�Y�i�[�p
CV.width = 0;
CV.height = 0;

// �ǂݍ��񂾉摜��`��
CV.setImage = function (img, iDiv, oDiv) {
	var canvas = document.getElementById(iDiv);
	var context = canvas.getContext('2d');
	// ����������
	CV.history = [];
	CV.historyR = [];
	// �摜�ǂݍ���
	CV.image = new Image();
	CV.image.src = img;
	// �ǂݍ��ݏI����҂�
	CV.image.onload = function () {
		// �`��̈���摜�̃T�C�Y�Ƀ��T�C�Y
		// width>500 or height>400�̏ꍇ�͋����I��500�ɏk��
		var scale = 400 / CV.image.height;
		if (CV.image.width > CV.image.height)
			scale = 500 / CV.image.width;
		if (scale < 1.0 & document.getElementById('resize').checked) {
			canvas.width = scale * CV.image.width;
			canvas.height = scale * CV.image.height;
			context.scale(scale, scale);
		} else {
			canvas.width = CV.image.width;
			canvas.height = CV.image.height;
		}
		// �摜�`��
		context.drawImage(CV.image, 0, 0);
		// ��f�f�[�^�ǂݍ��݂ƃT�C�Y�擾
		var input = context.getImageData(0, 0, canvas.width, canvas.height);
		CV.width = input.width;
		CV.height = input.height;
		// �ŏ��̏�Ԃ𗚗��ɕۑ�
		CV.history.push(input);
		CV.init(oDiv);
	}
}

// ���͂���Canvas�v�f��������
CV.init = function (canv) {
	// �����������i�ŏ��̏�Ԃ͎c���j
	var tmp = [];
	tmp[0] = CV.history[0];
	CV.historyR = [];
	CV.history = [];
	CV.history[0] = tmp[0];

	var canvas = document.getElementById(canv);
	canvas.width = CV.width;
	canvas.height = CV.height;
	var context = canvas.getContext('2d');
	var img = context.getImageData(0, 0, canvas.width, canvas.height);
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			for (var c = 0; c < 4; c++) {
				var i = (y * CV.width + x) * 4 + c;
				img.data[i] = CV.history[0].data[i];
			}
		}
	}
	context.putImageData(img, 0, 0);
	// �q�X�g�O�����v�Z�E�`��
	var hist = CV.histogram(img);	// �v�Z�̂�
	CV.histogramGraph(hist);			// �O���t�`��
}

// �߂�
CV.undo = function () {
	var history = CV.history;
	var outImg = CV.createTmpCanvas();
	var pre = history.length - 2;	// -1�����\������Ă�����́A-2����O�ɕ\�����Ă�������
	if (pre > 0) {
		CV.historyR.push(history[pre + 1]);	// ���\������Ă�����̂�Redo�p�����ɕۑ�
		for (var y = 0; y < CV.height; y++) {
			for (var x = 0; x < CV.width; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y * CV.width + x) * 4 + c;
					outImg.data[i] = history[pre].data[i];
				}
			}
		}
		// "�߂�O"�ɕ\������Ă�������������
		history.pop();
	}
	else if (pre == 0) {
		/**********************************************
		** ���̎��_�Ō����ڂ͍ŏ��̏�Ԃɖ߂��Ă��邪�A
		** �����ɂ͖߂�O�̏�Ԃ��܂��c���Ă���̂Ŏ��o�����삾������
		** �ŏ��̏�Ԃ����������Ɏc��
		***********************************************/
		CV.historyR.push(history[pre + 1]);
		history.pop();
	}
	return outImg;
}

// ��蒼��
CV.redo = function () {
	var historyR = CV.historyR;
	var outImg = CV.createTmpCanvas();
	var next = historyR.length - 1;	// -1���߂�O�ɕ\������Ă�������
	if (next >= 0) {
		for (var y = 0; y < CV.height; y++) {
			for (var x = 0; x < CV.width; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y * CV.width + x) * 4 + c;
					outImg.data[i] = historyR[next].data[i];
				}
			}
		}
		CV.history.push(outImg);
		// "�i�ޑO"�ɕ\������Ă�������������
		historyR.pop();
		return outImg;
	}
	else
		return -1;	// �G���[
}

// ����ւ�
CV.change = function (canv1, canv2) {
	// ��ڂ�Canvas�v�f�̏����擾
	var canvas1 = document.getElementById(canv1);
	var context1 = document.getElementById(canv1).getContext('2d');
	var img1 = context1.getImageData(0, 0, canvas1.width, canvas1.height);

	// ��ڂ�Canvas�v�f�̏����擾
	var canvas2 = document.getElementById(canv2);
	var context2 = document.getElementById(canv2).getContext('2d');
	var img2 = context2.getImageData(0, 0, canvas2.width, canvas2.height);

	// ����ւ��čĕ`��
	context1.putImageData(img2, 0, 0);
	context2.putImageData(img1, 0, 0);
}

// �ϊ��p�Ɍ��̉摜�Ɠ��T�C�Y��Canvas�v�f���쐬
CV.createTmpCanvas = function () {
	var canvas = document.createElement("canvas");
	var context = canvas.getContext('2d');
	// ���͉摜�Ɠ��T�C�Y�̉摜�f�[�^���쐬
	var outImg = context.createImageData(CV.width, CV.height);
	// ������
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i] = CV.history[0].data[i];
			outImg.data[i + 1] = CV.history[0].data[i + 1];
			outImg.data[i + 2] = CV.history[0].data[i + 2];
			outImg.data[i + 3] = CV.history[0].data[i + 3];
		}
	}
	return outImg;
}

// ��{�`
CV.sample = function (inImg) {
	// ��̕ϊ��pCanvas���쐬
	var outImg = CV.createTmpCanvas();
	// �S��f���[�v
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// ���͉摜�̂��ꂼ��̉�f�l�ɉ������珈���������ďo�͉摜�����
			// ���̏ꍇ�͉������Ă��Ȃ��̂ł����摜���R�s�[���Ă��邾��
			outImg.data[i + 0] = inImg.data[i + 0];
			outImg.data[i + 1] = inImg.data[i + 1];
			outImg.data[i + 2] = inImg.data[i + 2];
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	// �쐬�����摜�f�[�^��Ԃ�
	return outImg;
}
///////////////
// �u�����f�B���O //
///////////////

// ��{�`
CV.blend = function () { }
CV.blend.loop = function (calc, inImg1, inImg2) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i + 0] = calc(inImg1.data[i + 0], inImg2.data[i + 0]);
			outImg.data[i + 1] = calc(inImg1.data[i + 1], inImg2.data[i + 1]);
			outImg.data[i + 2] = calc(inImg1.data[i + 2], inImg2.data[i + 2]);
		}
	}
	return outImg;
}
// ���Z
CV.blend.add = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value = base + blend;
		if (value > 255)
			value = 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// ���Z
CV.blend.diff = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value = base - blend;
		if (value < 0)
			value = 0;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// ���O
CV.blend.exclusion = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		// �������敽��
		var value = base + blend - 2 * base * blend / 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// ���̐�Βl
CV.blend.abs = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value = Math.abs(base - blend);
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// ��Z
CV.blend.multi = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value = base * blend / 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �Ă�����
CV.blend.burn = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value;
		if (blend == 0)
			value = 0;
		else
			value = 255 - ((255 - base) * 255 / blend);
		if (value < 0)
			value = 0;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �X�N���[��
CV.blend.screen = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		// ���]�F�ŏ�Z���Ĕ��]
		var value = 255 - ((255 - base) * (255 - blend)) / 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �����Ă�
CV.blend.dodge = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value;
		if (blend == 255)
			value = 255;
		else
			value = base * 255 / (255 - blend);
		if (value > 255)
			value = 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �I�[�o�[���C
CV.blend.overlay = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value;
		if (base < 128)
			value = base * blend * 2 / 255;
		else
			value = 2 * (base + blend - base * blend / 255) - 255;
		if (value > 255)
			value = 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �\�t�g���C�g
CV.blend.soft = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value;
		if (blend < 128)
			value = Math.pow((base / 255), ((255 - blend) / 128)) * 255;
		else
			value = Math.pow((base / 255), (128 / blend)) * 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �n�[�h���C�g
CV.blend.hard = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value;
		if (blend < 128)
			value = base * blend * 2 / 255;
		else
			value = (1 - 2 * (1 - base / 255) * (1 - blend / 255)) * 255;
		if (value > 255)
			value = 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// ���j�A���C�g
CV.blend.linear = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value;
		if (blend < 128)
			value = base + 2 * blend - 255;
		else
			value = base + 2 * (blend - 128);
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �s�����C�g
CV.blend.pin = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		if (blend < 128)
			value = Math.min(base, 2 * blend);
		else
			value = Math.max(base, 2 * (blend - 128));
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// �r�r�b�h���C�g
CV.blend.vivid = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value;
		if (blend < 128) {
			value = (1 - (255 - base) / (2 * blend)) * 255;
		}
		else {
			value = (base / (255 - 2 * (blend - 128))) * 255;
		}
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
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
// RGB�t�B���^�[
CV.rgb = function (inImg, mode) {
	var outImg = CV.createTmpCanvas();
	// �S��f��R�̒l��MAX�ɂ���
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
		// �S��f��G�̒l��MAX�ɂ���
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
		// �S��f��B�̒l��MAX�ɂ���
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


// �l�K�|�W���]
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

// �O���[�X�P�[��
CV.gray = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// �O���[�X�P�[���̒萔
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

// �Z�s�A��
CV.sepia = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// �O���[�X�P�[���̒萔
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

// ��l��
CV.binary = function (inImg, threshold) {
	var outImg = CV.createTmpCanvas();
	var bin = [];
	// LUT�쐬�i臒l�����ɔ��ƍ��ɂ킯��j
	for (var i = 0; i < threshold; i++) {
		bin[i] = 0;
	}
	for (var i = threshold; i < 256; i++) {
		bin[i] = 255;
	}
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// �O���[�X�P�[���̒萔
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

// 256�F(8bit)��C�ӂ�bit(2�̏搔)�ɗ��Ƃ�����
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
//////////////////////
// �J�X�^���t�B���^ //
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
/////////////////////
// RGB��HSV�̑��ݕϊ� //
/////////////////////

// RGB��HSV�ϊ�
CV.RGB2HSV = function (inImg) {
	var colorIndex = []
	// color�ɒl���i�[
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			colorIndex.push({
				r: inImg.data[i],
				g: inImg.data[i + 1],
				b: inImg.data[i + 2],
				a: inImg.data[i + 3],
				h: 0, s: 0, v: 0
			});
		}
	}
	// HSV�̒l���v�Z���Ċi�[
	for (var i = 0; i < colorIndex.length; i++) {
		var max = Math.max(colorIndex[i].r, Math.max(colorIndex[i].g, colorIndex[i].b));
		var min = Math.min(colorIndex[i].r, Math.min(colorIndex[i].g, colorIndex[i].b));
		// Hue�̌v�Z
		if (max == min) {
			colorIndex[i].h = 0;
		} else if (max == colorIndex[i].r) {
			colorIndex[i].h = (60 * (colorIndex[i].g - colorIndex[i].b) / (max - min) + 360) % 360;
		} else if (max == colorIndex[i].g) {
			colorIndex[i].h = (60 * (colorIndex[i].b - colorIndex[i].r) / (max - min)) + 120;
		} else if (max == colorIndex[i].b) {
			colorIndex[i].h = (60 * (colorIndex[i].r - colorIndex[i].g) / (max - min)) + 240;
		}
		// Saturation�̌v�Z
		if (max == 0) {
			colorIndex[i].s = 0;
		} else {
			colorIndex[i].s = (255 * ((max - min) / max))
		}
		// Value�̌v�Z
		colorIndex[i].v = max;
	}
	return colorIndex;
}

// HSV��RGB�ϊ�
CV.HSV2RGB = function (colorIndex) {
	var hi, f, p, q, t;
	for (var i = 0; i < colorIndex.length; i++) {
		hi = Math.floor(colorIndex[i].h / 60.0) % 6;
		f = (colorIndex[i].h / 60.0) - Math.floor(colorIndex[i].h / 60.0);
		p = Math.round(colorIndex[i].v * (1.0 - (colorIndex[i].s / 255.0)));
		q = Math.round(colorIndex[i].v * (1.0 - (colorIndex[i].s / 255.0) * f));
		t = Math.round(colorIndex[i].v * (1.0 - (colorIndex[i].s / 255.0) * (1.0 - f)));

		switch (hi) {
			case 0:
				colorIndex[i].r = colorIndex[i].v;
				colorIndex[i].g = t;
				colorIndex[i].b = p;
				break;
			case 1:
				colorIndex[i].r = q;
				colorIndex[i].g = colorIndex[i].v;
				colorIndex[i].b = p;
				break;
			case 2:
				colorIndex[i].r = p;
				colorIndex[i].g = colorIndex[i].v;
				colorIndex[i].b = t;
				break;
			case 3:
				colorIndex[i].r = p;
				colorIndex[i].g = q;
				colorIndex[i].b = colorIndex[i].v;
				break;
			case 4:
				colorIndex[i].r = t;
				colorIndex[i].g = p;
				colorIndex[i].b = colorIndex[i].v;
				break;
			case 5:
				colorIndex[i].r = colorIndex[i].v;
				colorIndex[i].g = p;
				colorIndex[i].b = q;
				break;
			default:
				alert("error");
		}
	}
	return colorIndex;
}

// HSV�ϊ�
CV.hsv = function () { }
// �F���ϊ�
CV.hsv.hueConvert = function (inImg, hue) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		colorIndex[i].h += hue;
		if (colorIndex[i].h < 0) {
			colorIndex[i].h += 360;
		} else if (colorIndex[i].h > 360) {
			colorIndex[i].h -= 360;
		}
	}
	return CV.hsv.convert(colorIndex);
}
// �ʓx�ϊ�
CV.hsv.satConvert = function (inImg, sat) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		if (colorIndex[i].s > 10)
			colorIndex[i].s += sat;
		if (colorIndex[i].s < 0) {
			colorIndex[i].s = 0;
		} else if (colorIndex[i].s > 255) {
			colorIndex[i].s = 255;
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���x�ϊ�
CV.hsv.volConvert = function (inImg, vol) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		colorIndex[i].v += vol;
		if (colorIndex[i].v < 0) {
			colorIndex[i].v = 0;
		} else if (colorIndex[i].v > 255) {
			colorIndex[i].v = 255;
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���o�̈�ȊO���J�b�g
CV.hsv.cutConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsv�̂��ꂼ��͈̔́iStart��End�j���w��
		if (hueS >= 0) {
			if (!(
				(colorIndex[i].h >= hueS) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
				)
			) {
				colorIndex[i].v = 0;
			}
		} else {
			// hueS�����������Ƃ��̏���
			if (!(
				(colorIndex[i].h > (hueS + 360)) & (colorIndex[i].h < 360) |
				(colorIndex[i].h >= 0) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
				)
			) {
				colorIndex[i].v = 0;
			}
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���o�̈�𓧉�
CV.hsv.transConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsv�̂��ꂼ��͈̔́iStart��End�j���w��
		if (hueS >= 0) {
			if (
				(colorIndex[i].h >= hueS) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].a = 0;
			}
		} else {
			if (
				(colorIndex[i].h > (hueS + 360)) & (colorIndex[i].h < 360) |
				(colorIndex[i].h >= 0) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].a = 0;
			}
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���o�̈�𔒐F��
CV.hsv.whiteConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsv�̂��ꂼ��͈̔́iStart��End�j���w��
		if (hueS >= 0) {
			if (
				(colorIndex[i].h >= hueS) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].s = 0;
				colorIndex[i].v = 255;
			}
		} else {
			if (
				(colorIndex[i].h > (hueS + 360)) & (colorIndex[i].h < 360) |
				(colorIndex[i].h >= 0) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].s = 0;
				colorIndex[i].v = 255;
			}
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���o�̈�����F��
CV.hsv.blackConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsv�̂��ꂼ��͈̔́iStart��End�j���w��
		if (hueS >= 0) {
			if (
				(colorIndex[i].h >= hueS) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].v = 0;
			}
		} else {
			if (
				(colorIndex[i].h > (hueS + 360)) & (colorIndex[i].h < 360) |
				(colorIndex[i].h >= 0) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].v = 0;
			}
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���o�̈�̐F����ϊ�
CV.hsv.extractH = function (inImg, hueS, hueE, satS, satE, volS, volE, partH) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsv�̂��ꂼ��͈̔́iStart��End�j���w��
		if (hueS >= 0) {
			if (
				(colorIndex[i].h >= hueS) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].h += partH;
				if (colorIndex[i].h < 0) {
					colorIndex[i].h += 360;
				} else if (colorIndex[i].h > 360) {
					colorIndex[i].h -= 360;
				}
			}
		} else {
			if (
				(colorIndex[i].h > (hueS + 360)) & (colorIndex[i].h < 360) |
				(colorIndex[i].h >= 0) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].h += partH;
				if (colorIndex[i].h < 0) {
					colorIndex[i].h += 360;
				} else if (colorIndex[i].h > 360) {
					colorIndex[i].h -= 360;
				}
			}
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���o�̈�̍ʓx��ϊ�
CV.hsv.extractS = function (inImg, hueS, hueE, satS, satE, volS, volE, partS) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsv�̂��ꂼ��͈̔́iStart��End�j���w��
		if (hueS >= 0) {
			if (
				(colorIndex[i].h >= hueS) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].s += partS;
				if (colorIndex[i].s < 0) {
					colorIndex[i].s = 0;
				} else if (colorIndex[i].s > 255) {
					colorIndex[i].s = 255;
				}
			}
		} else {
			if (
				(colorIndex[i].h > (hueS + 360)) & (colorIndex[i].h < 360) |
				(colorIndex[i].h >= 0) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].s += partS;
				if (colorIndex[i].s < 0) {
					colorIndex[i].s = 0;
				} else if (colorIndex[i].s > 255) {
					colorIndex[i].s = 255;
				}
			}
		}
	}
	return CV.hsv.convert(colorIndex);
}
// ���o�̈�̖��x��ϊ�
CV.hsv.extractV = function (inImg, hueS, hueE, satS, satE, volS, volE, partV) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsv�̂��ꂼ��͈̔́iStart��End�j���w��
		if (hueS >= 0) {
			if (
				(colorIndex[i].h >= hueS) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].v += partV;
				if (colorIndex[i].v < 0) {
					colorIndex[i].v = 0;
				} else if (colorIndex[i].v > 255) {
					colorIndex[i].v = 255;
				}
			}
		} else {
			if (
				(colorIndex[i].h > (hueS + 360)) & (colorIndex[i].h < 360) |
				(colorIndex[i].h >= 0) & (colorIndex[i].h <= hueE) &
				(colorIndex[i].s >= satS) & (colorIndex[i].s <= satE) &
				(colorIndex[i].v >= volS) & (colorIndex[i].v <= volE)
			) {
				colorIndex[i].v += partV;
				if (colorIndex[i].v < 0) {
					colorIndex[i].v = 0;
				} else if (colorIndex[i].v > 255) {
					colorIndex[i].v = 255;
				}
			}
		}
	}
	return CV.hsv.convert(colorIndex);
}
// �ŏI�I�ȕϊ�����
CV.hsv.convert = function (colorIndex) {
	var outImg = CV.createTmpCanvas();
	colorIndex = CV.HSV2RGB(colorIndex);
	// �ϊ�����
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			outImg.data[i + 0] = colorIndex[Math.floor(i / 4)].r;
			outImg.data[i + 1] = colorIndex[Math.floor(i / 4)].g;
			outImg.data[i + 2] = colorIndex[Math.floor(i / 4)].b;
			outImg.data[i + 3] = colorIndex[Math.floor(i / 4)].a;
		}
	}
	return outImg;
}

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


// �q�X�g�O�����v�Z
CV.histogram = function (inImg) {
	// RGB�̊e�P�x�̉�f����ۑ����Ă����z�������ď�����
	var hist = {
		r: [],
		g: [],
		b: []
	};
	for (var i = 0; i < 256; i++) {
		hist.r[i] = hist.g[i] = hist.b[i] = 0;
	}
	// �e�F�̋P�x���Ƃ̉�f�������߂�
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			i = (y * CV.width + x) * 4;
			hist.r[inImg.data[i + 0]]++;
			hist.g[inImg.data[i + 1]]++;
			hist.b[inImg.data[i + 2]]++;
		}
	}
	// �S��f���ɑ΂���P�x���Ƃ̉�f�̊��������߂�
	var max = CV.width * CV.height;
	for (var i = 0; i < 256; i++) {
		hist.r[i] = hist.r[i] / max * 100;
		hist.g[i] = hist.g[i] / max * 100;
		hist.b[i] = hist.b[i] / max * 100;
	}
	// �P�x0��255�͕\�����Ȃ��i�\������Ƃ�������0��255�̊������ˏo���ăO���t�����Â炭�Ȃ�j
	hist.r[0] = hist.r[255] = 0;
	hist.g[0] = hist.g[255] = 0;
	hist.b[0] = hist.b[255] = 0;

	return hist;
}
// �q�X�g�O�����̃O���t�`��igRaphael.js��ǂݍ��܂Ȃ��Ǝg���܂���j
CV.histogramGraph = function (hist) {
	// �O��̃O���t������
	document.getElementById('histogram').innerHTML = "";
	document.getElementById('histogram').style.backgroundColor = "#aaccff";
	var r = Raphael("histogram", 460, 170);	// �\���̈�̃T�C�Y
	var txtattr = { font: "15px sans-serif" };
	r.text(200, 12, "Color Histgram").attr(txtattr);
	r.text(20, 12, "[%]").attr(txtattr);
	r.text(430, 150, "�P�x").attr(txtattr);

	var x = [];
	for (var i = 0; i <= 260; i++) {
		x[i] = i;
	}
	// ���_�i����j, width, height, xValue[], yValue[], opts
	var lines = r.linechart(10, 12, 400, 145,
		// ��
		[x],
		// �c
		[hist.r, hist.g, hist.b],
		// �I�v�V����
		{
			nostroke: false,	// false�œ_���q��
			axis: "0 0 1 1",	// ��, �E, ��, ������\��
			axisxstep: 13,	// x���̕������i���x���Ԋu�ɑ��� 260/13=20�j
			axisystep: 5,	// y���̕�����
			colors: ["#f00", "#0f0", "#00f"],	// �܂���̐F
			gutter: 15,	// padding
			shade: true,
			symbol: "circle",	// �_�̌`
			smooth: true
		}
	);
	var xlabel = lines.axis[0].text.items;
	var ylabel = lines.axis[1].text.items;
	lines.axis.attr({ "stroke-width": 3, });	// ���̑���
	// ���x���̕����T�C�Y�ύX
	for (var i = 0; i < xlabel.length; i++) {
		xlabel[i].attr(txtattr);
	}
	for (var i = 0; i < ylabel.length; i++) {
		ylabel[i].attr(txtattr);
	}
	// �_�̃T�C�Y�ύX
	lines.symbols.attr({ r: 1 });
}


// ��s��(3x3)
CV.sharp = function (inImg, k) {
	var outImg = CV.createTmpCanvas();
	for (var y = 1; y < CV.height - 1; y++) {
		for (var x = 1; x < CV.width - 1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				outImg.data[i] =
					-k / 9 * inImg.data[i - CV.width * 4 - 4] - k / 9 * inImg.data[i - CV.width * 4] - k / 9 * inImg.data[i - CV.width * 4 + 4]
					- k / 9 * inImg.data[i - 4] + (1 + 8 * k / 9) * inImg.data[i] - k / 9 * inImg.data[i + 4]
					- k / 9 * inImg.data[i + CV.width * 4 - 4] - k / 9 * inImg.data[i + CV.width * 4] - k / 9 * inImg.data[i + CV.width * 4 + 4];
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

/////////////
// ���ߏ��� //
/////////////

// ����
CV.transparent = function (inImg, threshold) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// �O���[�X�P�[���̒萔
			var gray =
				+0.299 * inImg.data[i]
				+ 0.587 * inImg.data[i + 1]
				+ 0.114 * inImg.data[i + 2];
			outImg.data[i + 0] = inImg.data[i + 0];
			outImg.data[i + 1] = inImg.data[i + 1];
			outImg.data[i + 2] = inImg.data[i + 2];
			outImg.data[i + 3] = inImg.data[i + 3];
			// ���P�x�ȏ�̃s�N�Z���𓧉�
			if (gray >= threshold) {
				outImg.data[i + 3] = 0;
			}
		}
	}
	return outImg;
}
// �������]
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

// �������]
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

// �g�k�i�������j
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

//////////
// �ڂ��� //
//////////

// �����_������ւ�(NxN)
CV.shuffle = function (inImg, N) {
	var outImg = CV.createTmpCanvas();
	var size = Math.pow(N, 2);
	// �ʒu�����ւ��邽�߂̔z��
	var number = [];
	for (var i = 0; i < size; i++) {
		number[i] = []
	}
	// �z��̗v�f�������_���ɓ���ւ���iFisher-Yates�j
	Array.prototype.shuffle = function () {
		var i = this.length;
		while (i) {
			var j = Math.floor(Math.random() * i);
			var t = this[--i];
			this[i] = this[j];
			this[j] = t;
		}
		return this;
	}
	var offset = (N - 1) / 2;
	for (var y = offset; y < CV.height - offset; y++) {
		for (var x = offset; x < CV.width - offset; x++) {
			// �J�[�l�����̉�f���Ƃ�RGB���i�[
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				var k = 0;
				for (var dy = 0; dy < N; dy++) {
					for (var dx = 0; dx < N; dx++) {
						var horizon = CV.width * (-(N - 1) / 2 * 4 + 4 * dx);
						var vertical = -(N - 1) / 2 * 4 + 4 * dy;
						number[k][c] = inImg.data[i + horizon + vertical];
						k++;
					}
				}
			}
			number.shuffle();
			// �����_���ɓ���ւ�����f����
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				var k = 0;
				for (var dy = 0; dy < N; dy++) {
					for (var dx = 0; dx < N; dx++) {
						outImg.data[i + CV.width * dx * 4 + dy * 4] = number[k][c];
						k++;
					}
				}
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

// ���f�B�A��
CV.median = function (inImg) {
	var outImg = CV.createTmpCanvas();
	// �����l�����߂邽�߂̔z��
	var number = [];
	// �N�C�b�N�Z���N�g�ik�Ԗڂ̒l�����������Ȃ�\�[�g�j
	// �����l�i������5�Ԗځj���~���������Ȃ̂ŁA���ׂă\�[�g����K�v�͖���
	Array.prototype.quickselect = function (k, l, r) {
		var v, i, j, t;
		var l = l || 0;	// �J�n�ʒu
		var r = r || this.length - 1;	// �I���ʒu
		if (r > l) {
			v = this[r]; i = l - 1; j = r;
			for (; ;) {
				while (this[++i] < v);
				while (this[--j] > v);
				if (i >= j)
					break;
				t = this[i]; this[i] = this[j]; this[j] = t;
			}
			t = this[i]; this[i] = this[r]; this[r] = t;
			if (i > l + k - 1)
				this.quickselect(k, l, i - 1);
			if (i < l + k - 1)
				this.quickselect(k - i, i + 1, r);
		}
		return this;
	}
	// ���f�B�A���t�B���^�̏���
	for (var y = 1; y < CV.height - 1; y++) {
		for (var x = 1; x < CV.width - 1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				// 3x3�̃f�[�^���i�[�i���̓��������ԑ��������j
				number[0] = inImg.data[i - CV.width * 4 - 4];
				number[1] = inImg.data[i - CV.width * 4];
				number[2] = inImg.data[i - CV.width * 4 + 4];
				number[3] = inImg.data[i - 4];
				number[4] = inImg.data[i];
				number[5] = inImg.data[i + 4];
				number[6] = inImg.data[i + CV.width * 4 - 4];
				number[7] = inImg.data[i + CV.width * 4];
				number[8] = inImg.data[i + CV.width * 4 + 4];
				// �f�t�H���g�̃\�[�g�i���Ԃ�N�C�b�N�\�[�g�j
				// number.sort(
				// 	function(a,b){
				// 		if( a < b ) return -1;
				// 		if( a > b ) return 1;
				// 		return 0;
				// 	}
				// );
				// �N�C�b�N�Z���N�g��
				number.quickselect(5);
				// �����l����
				outImg.data[i] = number[4];
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

// ������(NxN)
CV.smoothing = function (inImg, N) {
	N = N || 5;
	var outImg = CV.createTmpCanvas();
	var smooth = Math.pow(N, -2);
	// �S��f���[�v
	var offset = (N - 1) / 2;
	for (var y = offset; y < CV.height - offset; y++) {
		for (var x = offset; x < CV.width - offset; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				var sum = 0;
				// �J�[�l���S���[�v
				for (var dy = 0; dy < N; dy++) {
					for (var dx = 0; dx < N; dx++) {
						var horizon = CV.width * (-(N - 1) / 2 * 4 + 4 * dx);
						var vertical = -(N - 1) / 2 * 4 + 4 * dy;
						// �P�x�l�v�Z
						sum += smooth * inImg.data[i + horizon + vertical];
					}
				}
				outImg.data[i] = Math.round(sum);
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

// �K�E�V�A��(3x3)
// NxN�͓񍀒藝���K�v�ŏd���Ȃ肻����������Ȃ�
CV.gaussian = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 1; y < CV.height - 1; y++) {
		for (var x = 1; x < CV.width - 1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				outImg.data[i] =
					1 / 16 * inImg.data[i - CV.width * 4 - 4] + 2 / 16 * inImg.data[i - CV.width * 4] + 1 / 16 * inImg.data[i - CV.width * 4 + 4] +
					2 / 16 * inImg.data[i - 4] + 4 / 16 * inImg.data[i] + 2 / 16 * inImg.data[i + 4] +
					1 / 16 * inImg.data[i + CV.width * 4 - 4] + 2 / 16 * inImg.data[i + CV.width * 4] + 1 / 16 * inImg.data[i + CV.width * 4 + 4];
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

// �K�E�V�A��(5x5)
CV.gaussian2 = function (inImg) {
	var outImg = CV.createTmpCanvas();
	for (var y = 2; y < CV.height - 2; y++) {
		for (var x = 2; x < CV.width - 2; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				outImg.data[i] =
					1 / 256 * inImg.data[i - CV.width * 8 - 8] +
					4 / 256 * inImg.data[i - CV.width * 8 - 4] +
					6 / 256 * inImg.data[i - CV.width * 8] +
					4 / 256 * inImg.data[i - CV.width * 8 + 4] +
					1 / 256 * inImg.data[i - CV.width * 8 + 8] +

					4 / 256 * inImg.data[i - CV.width * 4 - 8] +
					16 / 256 * inImg.data[i - CV.width * 4 - 4] +
					24 / 256 * inImg.data[i - CV.width * 4] +
					16 / 256 * inImg.data[i - CV.width * 4 + 4] +
					4 / 256 * inImg.data[i - CV.width * 4 + 8] +

					6 / 256 * inImg.data[i - 8] +
					24 / 256 * inImg.data[i - 4] +
					36 / 256 * inImg.data[i] +
					24 / 256 * inImg.data[i + 4] +
					6 / 256 * inImg.data[i + 8] +

					4 / 256 * inImg.data[i + CV.width * 4 - 8] +
					16 / 256 * inImg.data[i + CV.width * 4 - 4] +
					24 / 256 * inImg.data[i + CV.width * 4] +
					16 / 256 * inImg.data[i + CV.width * 4 + 4] +
					4 / 256 * inImg.data[i + CV.width * 4 + 8] +

					1 / 256 * inImg.data[i + CV.width * 8 - 8] +
					4 / 256 * inImg.data[i + CV.width * 8 - 4] +
					6 / 256 * inImg.data[i + CV.width * 8] +
					4 / 256 * inImg.data[i + CV.width * 8 + 4] +
					1 / 256 * inImg.data[i + CV.width * 8 + 8];
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

// ���U�C�N(NxN)
CV.pixelization = function (inImg, N) {
	N = N || 5;
	var outImg = CV.createTmpCanvas();
	var offset = (N - 1) / 2;
	var count, r, g, b;
	// �S��f���[�v
	for (var y = offset; y < CV.height; y += N) {
		for (var x = offset; x < CV.width; x += N) {
			var i = (y * CV.width + x) * 4;
			count = r = g = b = 0;
			// ���͗p�J�[�l���S���[�v
			for (var dy = 0; dy < N; dy++) {
				for (var dx = 0; dx < N; dx++) {
					var horizon = -(N - 1) / 2 * 4 + 4 * dx;
					var vertical = -(N - 1) / 2 * 4 + 4 * dy;
					// �摜�͈̔͊O�͖�������
					if (
						((x + horizon) < 0) ||
						(CV.width <= (x + horizon)) ||
						((y + vertical) < 0) ||
						(CV.height <= (y + vertical))
					) {
						continue;
					}
					// �P�x�l�̍��v���擾
					r += inImg.data[i + CV.width * horizon + vertical + 0];
					g += inImg.data[i + CV.width * horizon + vertical + 1];
					b += inImg.data[i + CV.width * horizon + vertical + 2];
					// �擾������f�̌�
					count++;
				}
			}
			// ���ϋP�x�l���v�Z
			r = Math.round(r / count);
			g = Math.round(g / count);
			b = Math.round(b / count);
			// �o�͗p�J�[�l���S���[�v
			for (var dy = 0; dy < N; dy++) {
				for (var dx = 0; dx < N; dx++) {
					var horizon = -(N - 1) / 2 * 4 + 4 * dx;
					var vertical = -(N - 1) / 2 * 4 + 4 * dy;
					// �P�x�l���
					outImg.data[i + CV.width * horizon + vertical + 0] = r;
					outImg.data[i + CV.width * horizon + vertical + 1] = g;
					outImg.data[i + CV.width * horizon + vertical + 2] = b;
				}
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

// �u���[(NxN)
CV.motionblur = function (inImg, N, course) {
	N = N || 5;
	course = course || "tiltL";
	var outImg = CV.createTmpCanvas();
	var count, r, g, b, H, V;
	if (course == "vertical")
		H = 0;
	else if (course == "tiltR")
		H = -1;
	else if (course == "tiltL")
		H = 1;
	// �S��f���[�v
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			count = r = g = b = 0;
			// ���͗p�J�[�l���S���[�v
			for (var dx = 0; dx < N; dx++) {
				if (course == "horizon") {
					var vertical = -(N - 1) / 2 * 4 + 4 * dx;
					var horizon = 0;
				} else {
					var horizon = -(N - 1) / 2 * 4 + 4 * dx;
					var vertical = H * horizon;
				}
				// �摜�͈̔͊O�͖�������
				if (
					((x + horizon) < 0) ||
					(CV.width <= (x + horizon)) ||
					((y + vertical) < 0) ||
					(CV.height <= (y + vertical))
				) {
					continue;
				}
				// �P�x�l�̍��v���擾
				r += inImg.data[i + CV.width * horizon + vertical + 0];
				g += inImg.data[i + CV.width * horizon + vertical + 1];
				b += inImg.data[i + CV.width * horizon + vertical + 2];
				// �擾������f�̌�
				count++;
			}
			// ���ϋP�x�l���v�Z
			r = Math.round(r / count);
			g = Math.round(g / count);
			b = Math.round(b / count);
			// �P�x�l���
			outImg.data[i + 0] = r;
			outImg.data[i + 1] = g;
			outImg.data[i + 2] = b;
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}
