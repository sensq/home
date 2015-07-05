
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