

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