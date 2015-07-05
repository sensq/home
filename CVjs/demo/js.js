// �O���t�쐬�p���C�u����
document.write('<script type="text/javascript" src="raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.line-min.js"></script>');
document.write('<script type="text/javascript" src="../build/CV.js"></script>');

var inputDiv = "img";
var outputDiv = "outputImg";

// ������
var init = function () {
	CV.init(outputDiv);
}
// �q�X�g�O����
var histogram = function () {
	var inImg = CV.read(outputDiv);
	var hist = CV.histogram(inImg);	// �v�Z�̂�
	CV.histogramGraph(hist);			// �O���t�`��
}
// �߂�
var undo = function () {
	var outImg = CV.undo();
	// CV.draw���Ɩ߂����Ƃ��̏�ԂōĂї���������Ă��܂��̂Ń_��
	var canvas = document.getElementById(outputDiv);
	var context = canvas.getContext('2d');
	context.putImageData(outImg, 0, 0);
}
// �߂�
var redo = function () {
	var outImg = CV.redo();
	// CV.draw���Ɩ߂����Ƃ��̏�ԂōĂї���������Ă��܂��̂Ń_��
	if (outImg != -1) {
		var canvas = document.getElementById(outputDiv);
		var context = canvas.getContext('2d');
		context.putImageData(outImg, 0, 0);
	}
}
// �摜�̓ǂݍ���
var Read = function () {
	// �d�ˊ|������ꍇ
	if (document.getElementById("copy").checked)
		return CV.read(outputDiv);
		// �d�ˊ|�����Ȃ��ꍇ
	else
		return CV.read(inputDiv);
}

// �F��
// �l�K�|�W
var negaposi = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.negaposi(inImg);
	CV.draw(outputDiv, outImg);
}
// �O���[�X�P�[��
var gray = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.gray(inImg);
	CV.draw(outputDiv, outImg);
}
// �Z�s�A
var sepia = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.sepia(inImg);
	CV.draw(outputDiv, outImg);
}
// �R���g���X�g
var contrast = function () {
	var inImg = Read(outputDiv);
	var threshold = document.getElementById('thresholdContrast').value;
	var outImg = CV.contrast(inImg, threshold);
	CV.draw(outputDiv, outImg);
}
// ��l��
var binary = function () {
	var inImg = Read(outputDiv);
	var threshold = document.getElementById('threshold').value;
	var outImg = CV.binary(inImg, threshold);
	CV.draw(outputDiv, outImg);
}
// ���F
var decreaseColor = function () {
	var bit = Number(colorBit.options[colorBit.selectedIndex].value);
	var inImg = Read(outputDiv);
	var outImg = CV.decreaseColor(inImg, bit);
	CV.draw(outputDiv, outImg);
}
// RGB���o
var rgb = function (mode) {
	var inImg = Read(outputDiv);
	var outImg = CV.rgb(inImg, mode);
	CV.draw(outputDiv, outImg);
}
// �J�X�^���t�B���^
var custom = function () {
	var inImg = Read(outputDiv);
	var S = new Array(
        parseInt(document.getElementById('custom11').value), parseInt(document.getElementById('custom12').value), parseInt(document.getElementById('custom13').value), parseInt(document.getElementById('custom14').value), parseInt(document.getElementById('custom15').value),
        parseInt(document.getElementById('custom21').value), parseInt(document.getElementById('custom22').value), parseInt(document.getElementById('custom23').value), parseInt(document.getElementById('custom24').value), parseInt(document.getElementById('custom25').value),
        parseInt(document.getElementById('custom31').value), parseInt(document.getElementById('custom32').value), parseInt(document.getElementById('custom33').value), parseInt(document.getElementById('custom34').value), parseInt(document.getElementById('custom35').value),
        parseInt(document.getElementById('custom41').value), parseInt(document.getElementById('custom42').value), parseInt(document.getElementById('custom43').value), parseInt(document.getElementById('custom44').value), parseInt(document.getElementById('custom45').value),
        parseInt(document.getElementById('custom51').value), parseInt(document.getElementById('custom52').value), parseInt(document.getElementById('custom53').value), parseInt(document.getElementById('custom54').value), parseInt(document.getElementById('custom55').value)
        );
	var scale = parseInt(document.getElementById('customScale').value);
	var offset = parseInt(document.getElementById('customOffset').value);
	var outImg = CV.custom(inImg, S, scale, offset);
	CV.draw(outputDiv, outImg);
}
// �G�b�W���o
// 4�ߖT���v���V�A��
var edge = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.sobel(inImg, 0);
	CV.draw(outputDiv, outImg);
}
// 8�ߖT���v���V�A��
var edge2 = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.sobel(inImg, 5);
	CV.draw(outputDiv, outImg);
}
// �\�[�x��
var sobel = function () {
	var inImg = Read(outputDiv);
	var course = parseInt(document.getElementById('course').value);
	// ��������0��n����4�ߖT�A5��n����8�ߖT���v���V�A��
	var outImg = CV.sobel(inImg, course);
	CV.draw(outputDiv, outImg);
}
// ������
// ���f�B�A��
var median = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.median(inImg);
	CV.draw(outputDiv, outImg);
}
// ������(NxN)
var smoothing = function (N) {
	var inImg = Read(outputDiv);
	var outImg = CV.smoothing(inImg, N);
	CV.draw(outputDiv, outImg);
}
// �K�E�V�A��(3x3)
var gaussian = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.gaussian(inImg);
	CV.draw(outputDiv, outImg);
}
// �K�E�V�A��(5x5)
var gaussian2 = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.gaussian2(inImg);
	CV.draw(outputDiv, outImg);
}
// �����_������ւ�(NxN)
var shuffle = function (N) {
	var inImg = Read(outputDiv);
	var outImg = CV.shuffle(inImg, N);
	CV.draw(outputDiv, outImg);
}
// ���U�C�N(NxN)
var pixelization = function (N) {
	var inImg = Read(outputDiv);
	var outImg = CV.pixelization(inImg, N);
	CV.draw(outputDiv, outImg);
}
// �u���[(NxN)
var motionblur = function (N, course) {
	var inImg = Read(outputDiv);
	var outImg = CV.motionblur(inImg, N, course);
	CV.draw(outputDiv, outImg);
}
// ��s��(3x3)
var sharp = function () {
	var inImg = Read(outputDiv);
	// ����
	var intensity = document.getElementById('sharpValue').value;
	var outImg = CV.sharp(inImg, intensity);
	CV.draw(outputDiv, outImg);
}
// HSV
var hsv = function () { }
hsv.Hue = function () {
	var inImg = Read(outputDiv);
	var hue = Number(document.getElementById('hueValue').value);
	var outImg = CV.hsv.hueConvert(inImg, hue);
	CV.draw(outputDiv, outImg);
}
hsv.Sat = function () {
	var inImg = Read(outputDiv);
	var sat = Number(document.getElementById('satValue').value);
	var outImg = CV.hsv.satConvert(inImg, sat);
	CV.draw(outputDiv, outImg);
}
hsv.Vol = function () {
	var inImg = Read(outputDiv);
	var vol = Number(document.getElementById('volValue').value);
	var outImg = CV.hsv.volConvert(inImg, vol);
	CV.draw(outputDiv, outImg);
}
hsv.Cut = function () {
	var inImg = Read(outputDiv);
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var outImg = CV.hsv.cutConvert(inImg, hueS, hueE, satS, satE, volS, volE);
	CV.draw(outputDiv, outImg);
}
hsv.White = function () {
	var inImg = Read(outputDiv);
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var outImg = CV.hsv.whiteConvert(inImg, hueS, hueE, satS, satE, volS, volE);
	CV.draw(outputDiv, outImg);
}
hsv.Black = function () {
	var inImg = Read(outputDiv);
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var outImg = CV.hsv.blackConvert(inImg, hueS, hueE, satS, satE, volS, volE);
	CV.draw(outputDiv, outImg);
}
hsv.extractH = function () {
	var inImg = Read(outputDiv);
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var partH = Number(document.getElementById('convHValue').value);
	var outImg = CV.hsv.extractH(inImg, hueS, hueE, satS, satE, volS, volE, partH);
	CV.draw(outputDiv, outImg);

	var nextS = hueS + partH;
	var nextE = hueE + partH;
	if (nextS > 360)
		nextS -= 360;
	else if (nextS < 0)
		nextS += 360;
	if (nextE > 360)
		nextE -= 360;
	else if (nextE < 0)
		nextE += 360;
	if (nextS > nextE)
		nextS -= 360;
	document.getElementById('hueStart').value = nextS;
	document.getElementById('hueEnd').value = nextE;
}
hsv.extractS = function () {
	var inImg = Read(outputDiv);
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var partS = Number(document.getElementById('convSValue').value);
	var outImg = CV.hsv.extractS(inImg, hueS, hueE, satS, satE, volS, volE, partS);
	CV.draw(outputDiv, outImg);

	var nextS = satS + partS;
	var nextE = satE + partS;
	if (nextS > 255)
		nextS = 255;
	else if (nextS < 0)
		nextS = 0;
	if (nextE > 255)
		nextE = 255;
	else if (nextE < 0)
		nextE = 0;
	document.getElementById('satStart').value = nextS;
	document.getElementById('satEnd').value = nextE;
}
hsv.extractV = function () {
	var inImg = Read(outputDiv);
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var partV = Number(document.getElementById('convVValue').value);
	var outImg = CV.hsv.extractV(inImg, hueS, hueE, satS, satE, volS, volE, partV);
	CV.draw(outputDiv, outImg);

	var nextS = volS + partV;
	var nextE = volE + partV;
	if (nextS > 255)
		nextS = 255;
	else if (nextS < 0)
		nextS = 0;
	if (nextE > 255)
		nextE = 255;
	else if (nextE < 0)
		nextE = 0;
	document.getElementById('volStart').value = nextS;
	document.getElementById('volEnd').value = nextE;
}

// �P�x
// �K���}�␳
var gamma = function () {
	var inImg = Read(outputDiv);
	// �K���}�l
	var g = document.getElementById('gammaValue').value;
	var outImg = CV.gammaLUT(inImg, g);
	CV.draw(outputDiv, outImg);
}
// ���x�ύX
var bright = function () {
	var inImg = Read(outputDiv);
	// ����
	var rate = document.getElementById('brightValue').value;
	var outImg = CV.bright(inImg, rate);
	CV.draw(outputDiv, outImg);
}
// ����
var transparent = function () {
	var inImg = Read(outputDiv);
	// �K���}�l
	var threshold = document.getElementById('opacity').value;
	var outImg = CV.transparent(inImg, threshold);
	CV.draw(outputDiv, outImg);
}
// Blend
var blend = function () {
	var inImg1 = CV.read(inputDiv);
	var inImg2 = CV.read(outputDiv);
	var mode = BlendType.options[BlendType.selectedIndex].value;
	var outImg;
	if (mode == "add")	// ���Z
		outImg = CV.blend.add(inImg1, inImg2);
	else if (mode === "diff")	// ���Z
		outImg = CV.blend.diff(inImg1, inImg2);
	else if (mode == "exclusion")	// ���O
		outImg = CV.blend.exclusion(inImg1, inImg2);
	else if (mode == "abs")		// ���̐�Βl
		outImg = CV.blend.abs(inImg1, inImg2);
	else if (mode == "multi")	// ��Z
		outImg = CV.blend.multi(inImg1, inImg2);
	else if (mode == "burn")	// �Ă�����
		outImg = CV.blend.burn(inImg1, inImg2);
	else if (mode == "screen")	// �X�N���[��
		outImg = CV.blend.screen(inImg1, inImg2);
	else if (mode == "dodge")	// �Ă�����
		outImg = CV.blend.dodge(inImg1, inImg2);
	else if (mode == "overlay")	// �I�[�o�[���C
		outImg = CV.blend.overlay(inImg1, inImg2);
	else if (mode == "soft")	// �\�t�g���C�g
		outImg = CV.blend.soft(inImg1, inImg2);
	else if (mode == "hard")	// �n�[�h���C�g
		outImg = CV.blend.hard(inImg1, inImg2);
	else if (mode == "linear")	// ���j�A���C�g
		outImg = CV.blend.linear(inImg1, inImg2);
	else if (mode == "pin")	// �s�����C�g
		outImg = CV.blend.pin(inImg1, inImg2);

	CV.draw(outputDiv, outImg);
}

// ��
// �������]
var hmirror = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.hmirror(inImg);
	CV.draw(outputDiv, outImg);
}
// �������]
var vmirror = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.vmirror(inImg);
	CV.draw(outputDiv, outImg);
}
// �g��k��
var scaling = function () {
	var inImg = Read(outputDiv);
	// var rate = document.getElementById('rate').value;
	var rate = 1.2;
	var outImg = CV.scaling(inImg, rate);
	CV.draw(outputDiv, outImg);
}

function selectFilter(s) {
	var srcMatrix = new Array(
	document.getElementById('customScale'),
	document.getElementById('customOffset'),

	document.getElementById('custom11'),
	document.getElementById('custom12'),
	document.getElementById('custom13'),
	document.getElementById('custom14'),
	document.getElementById('custom15'),

	document.getElementById('custom21'),
	document.getElementById('custom22'),
	document.getElementById('custom23'),
	document.getElementById('custom24'),
	document.getElementById('custom25'),

	document.getElementById('custom31'),
	document.getElementById('custom32'),
	document.getElementById('custom33'),
	document.getElementById('custom34'),
	document.getElementById('custom35'),

	document.getElementById('custom41'),
	document.getElementById('custom42'),
	document.getElementById('custom43'),
	document.getElementById('custom44'),
	document.getElementById('custom45'),

	document.getElementById('custom51'),
	document.getElementById('custom52'),
	document.getElementById('custom53'),
	document.getElementById('custom54'),
	document.getElementById('custom55')
		);

	var dstMatrix;
	switch (s.selectedIndex) {
		case 1:
			dstMatrix = new Array(1, 255,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, -1, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0
			);
			break;
		case 2:
			dstMatrix = new Array(48, 0,
				0, 1, 2, 1, 0,
				1, 2, 4, 2, 1,
				2, 4, 8, 4, 2,
				1, 2, 4, 2, 1,
				0, 1, 2, 1, 0
			);
			break;
		case 3:
			dstMatrix = new Array(5, 0,
				0, 0, 0, 0, 0,
				0, -1, -1, -1, 0,
				0, -1, 13, -1, 0,
				0, -1, -1, -1, 0,
				0, 0, 0, 0, 0
			);
			break;
		case 4:
			dstMatrix = new Array(3, 0,
				1, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 1
			);
			break;
		case 5:
			dstMatrix = new Array(1, 128,
				0, 0, 0, 0, 0,
				0, 1, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, -1, 0,
				0, 0, 0, 0, 0
			);
			break;
		case 6:
			dstMatrix = new Array(4, -32,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 5, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0
			);
			break;
		case 7:
			dstMatrix = new Array(4, 32,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 3, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0
			);
			break;
	}
	for (var i = 0; i < 27; i++) {
		srcMatrix[i].value = dstMatrix[i];
	}
}

/**********************
** �摜�ǂݍ��݊֘A�̃��\�b�h
***********************/

// �摜��ǂݍ���
function loadImg() {
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		// �t�@�C�����Ɗg���q��ʁX�Ɏ擾
		var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
		info = { name: name[1], type: name[2], size: img.size };
		var property = "NAME�w" + img.name +
			"�x, SIZE�w" + img.size + "byte (" + (img.size / 1024).toFixed(0) + "KB)�x";
		document.getElementById('list').innerSTML = property;
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			CV.setImage(e.target.result, inputDiv, outputDiv);
		}
		fr.readAsDataURL(img);
	} else {
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

// �h���b�O���h���b�v�œǂݍ���
function onDropFile(e) {
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	// �t�@�C�����Ɗg���q��ʁX�Ɏ擾
	var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
	info = { name: name[1], type: name[2], size: img.size };
	var property = "NAME�w" + img.name +
		"�x, SIZE�w" + img.size + "byte (" + (img.size / 1024).toFixed(0) + "KB)�x";
	document.getElementById('list').innerHTML = property;
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			CV.setImage(e.target.result, inputDiv, outputDiv);
		}
		fr.readAsDataURL(img);
	} else {
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

// �f�t�H���g�������L�����Z��
function onCancel(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	return false;
};

/*************
** ���̑��̃��\�b�h
**************/

var customReset = function () {
	document.getElementById('customScale').value = 1;
	document.getElementById('customOffset').value = 0;

	document.getElementById('custom11').value = 0;
	document.getElementById('custom12').value = 0;
	document.getElementById('custom13').value = 0;
	document.getElementById('custom14').value = 0;
	document.getElementById('custom15').value = 0;

	document.getElementById('custom21').value = 0;
	document.getElementById('custom22').value = 0;
	document.getElementById('custom23').value = 0;
	document.getElementById('custom24').value = 0;
	document.getElementById('custom25').value = 0;

	document.getElementById('custom31').value = 0;
	document.getElementById('custom32').value = 0;
	document.getElementById('custom33').value = 1;
	document.getElementById('custom34').value = 0;
	document.getElementById('custom35').value = 0;

	document.getElementById('custom41').value = 0;
	document.getElementById('custom42').value = 0;
	document.getElementById('custom43').value = 0;
	document.getElementById('custom44').value = 0;
	document.getElementById('custom45').value = 0;

	document.getElementById('custom51').value = 0;
	document.getElementById('custom52').value = 0;
	document.getElementById('custom53').value = 0;
	document.getElementById('custom54').value = 0;
	document.getElementById('custom55').value = 0;
}

/*
** �C�ӂ̗v�f�̃I�t�Z�b�g���擾����֐� �i�`��̈�̃I�t�Z�b�g�ʒu�擾�p�j
** �}�E�X���W�𐳂����擾���邽�߂ɕK�v
*/
function getElementPosition(element) {
	var html = document.documentElement;
	var body = document.body;
	var top = left = scrollLeft = scrollTop = 0;
	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		scrollLeft = body.scrollLeft || html.scrollLeft;
		scrollTop = body.scrollTop || html.scrollTop;
		element = element.offsetParent;
	}
	while (element);
	return { top: top, left: left, scrollLeft: scrollLeft, scrollTop: scrollTop };
};


/*
** �}�E�X�ړ����̃C�x���g
*/
document.addEventListener('mousemove', function (e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = { r: 0, g: 0, b: 0, a: 0, h: 0, s: 0, v: 0 };
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ��������C�x���g���� */
	var outImg = CV.read(outputDiv);
	if (mouseX >= 0 & mouseX < CV.width & mouseY >= 0 & mouseY < CV.height) {
		var i = (mouseY * CV.width + mouseX) * 4;
		color.r = outImg.data[i + 0];
		color.g = outImg.data[i + 1];
		color.b = outImg.data[i + 2];
		color.a = outImg.data[i + 3];
		rgba[0] = color.r;
		rgba[1] = color.g;
		rgba[2] = color.b;
		rgba[3] = color.a;
		rgb2hsv(color);
		hsv[0] = parseInt(color.h);
		hsv[1] = parseInt(color.s);
		hsv[2] = parseInt(color.v);
		info = "R:" + rgba[0] + "�@G:" + rgba[1] + "�@B:" + rgba[2] + "�@A:" + rgba[3] + "�@�@H:" + hsv[0] + "�@S:" + hsv[1] + "�@V:" + hsv[2];
		document.getElementById('info').innerHTML = info;
	}

	function rgb2hsv(color) {
		var max = Math.max(color.r, Math.max(color.g, color.b));
		var min = Math.min(color.r, Math.min(color.g, color.b));
		// Hue�̌v�Z
		if (max == min) {
			color.h = 0;
		} else if (max == color.r) {
			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
		} else if (max == color.g) {
			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
		} else if (max == color.b) {
			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
		}
		// Saturation�̌v�Z
		if (max == 0) {
			color.s = 0;
		} else {
			color.s = (255 * ((max - min) / max))
		}
		// Value�̌v�Z
		color.v = max;
	}
}, false);

/*
** �}�E�X�N���b�N���̃C�x���g�i���m�ɂ͗��������j�j
*/
document.addEventListener('click', function (e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = { r: 0, g: 0, b: 0, a: 0, h: 0, s: 0, v: 0 };
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ��������C�x���g���� */
	var outImg = CV.read(outputDiv);
	if (mouseX >= 0 & mouseX < CV.width & mouseY >= 0 & mouseY < CV.height) {
		var i = (mouseY * CV.width + mouseX) * 4;
		color.r = outImg.data[i + 0];
		color.g = outImg.data[i + 1];
		color.b = outImg.data[i + 2];
		color.a = outImg.data[i + 3];
		rgba[0] = color.r;
		rgba[1] = color.g;
		rgba[2] = color.b;
		rgba[3] = color.a;
		rgb2hsv(color);
		hsv[0] = parseInt(color.h);
		hsv[1] = parseInt(color.s);
		hsv[2] = parseInt(color.v);
		document.getElementById('hueStart').value = hsv[0] - 20;
		document.getElementById('hueEnd').value = hsv[0] + 20;
		if (hsv[1] > 40)
			document.getElementById('satStart').value = hsv[1] - 40;
		else
			document.getElementById('satStart').value = 0;
		if (hsv[1] < 215)
			document.getElementById('satEnd').value = hsv[1] + 40;
		else
			document.getElementById('satEnd').value = 255;
		if (hsv[2] > 40)
			document.getElementById('volStart').value = hsv[2] - 40;
		else
			document.getElementById('volStart').value = 0;
		if (hsv[2] < 215)
			document.getElementById('volEnd').value = hsv[2] + 40;
		else
			document.getElementById('volEnd').value = 255;
	}

	function rgb2hsv(color) {
		var max = Math.max(color.r, Math.max(color.g, color.b));
		var min = Math.min(color.r, Math.min(color.g, color.b));
		// Hue�̌v�Z
		if (max == min) {
			color.h = 0;
		} else if (max == color.r) {
			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
		} else if (max == color.g) {
			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
		} else if (max == color.b) {
			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
		}
		// Saturation�̌v�Z
		if (max == 0) {
			color.s = 0;
		} else {
			color.s = (255 * ((max - min) / max))
		}
		// Value�̌v�Z
		color.v = max;
	}
}, false);

// ���j���[�\��
var menu = function (divID) {
	var div = document.getElementById(divID);
	div.style.display = div.style.display == 'none' ? 'block' : 'none';
}
// ���͑����B��
var divHidden = function () {
	document.getElementById(inputDiv).hidden = !document.getElementById(inputDiv).hidden;
}
menu.all = function () {
	var count = 0;
	var div = [];
	div[0] = document.getElementById('siki');
	div[1] = document.getElementById('edge');
	div[2] = document.getElementById('pix');
	div[3] = document.getElementById('hsv');
	div[4] = document.getElementById('kido');
	div[5] = document.getElementById('kika');
	div[6] = document.getElementById('custom');
	div[7] = document.getElementById('histogram');
	var button = [];
	button[0] = document.getElementById('Msiki');
	button[1] = document.getElementById('Medge');
	button[2] = document.getElementById('Mpix');
	button[3] = document.getElementById('Mhsv');
	button[4] = document.getElementById('Mkido');
	button[5] = document.getElementById('Mkika');
	button[6] = document.getElementById('Mcustom');
	button[7] = document.getElementById('Mhistogram');

	// none�̌�������
	for (var i = 0; i < div.length; i++) {
		if (div[i].style.display == 'none') {
			count++;
		}
	}
	// none����ł���������S��block�A�����łȂ���ΑS��none�ɂ���
	if (count > 0) {
		for (var i = 0; i < div.length; i++) {
			div[i].style.display = 'block';
			button[i].checked = true;
		}
	} else {
		for (var i = 0; i < div.length; i++) {
			div[i].style.display = 'none';
			button[i].checked = false;
		}
	}
	document.getElementById('histogram').height = document.getElementById('cont').height;
}

window.addEventListener('load', function () {
	// �h���b�O���h���b�v�ɑΉ�
	document.getElementById(inputDiv).addEventListener("dragover", onCancel, false);
	document.getElementById(inputDiv).addEventListener("dragenter", onCancel, false);
	document.getElementById(inputDiv).addEventListener("drop", onDropFile, false);
	document.getElementById(outputDiv).addEventListener("dragover", onCancel, false);
	document.getElementById(outputDiv).addEventListener("dragenter", onCancel, false);
	document.getElementById(outputDiv).addEventListener("drop", onDropFile, false);

	// �f�t�H���g�摜
	CV.setImage("HSV_cone.jpg", inputDiv, outputDiv);

	// �e�f�t�H���g�l
	document.getElementById('threshold').value = 190;
	document.getElementById('thresholdContrast').value = 70;
	document.getElementById('course').value = 8;
	document.getElementById('sharpValue').value = 1;
	document.getElementById("gammaValue").value = 1.5;
	document.getElementById('brightValue').value = 150;
	document.getElementById('opacity').value = 245;

	// HSV
	document.getElementById('hueValue').value = 45;
	document.getElementById('satValue').value = 20;
	document.getElementById('volValue').value = 20;

	// �F���o�p
	document.getElementById('hueStart').value = 80;
	document.getElementById('hueEnd').value = 180;
	document.getElementById('satStart').value = 100;
	document.getElementById('satEnd').value = 255;
	document.getElementById('volStart').value = 80;
	document.getElementById('volEnd').value = 255;
	document.getElementById('convHValue').value = 45;
	document.getElementById('convSValue').value = 20;
	document.getElementById('convVValue').value = 20;

	document.getElementById("change").checked = false;
	document.getElementById("resize").checked = true;
	document.getElementById("copy").checked = true;

	// ���j���[�p
	document.getElementById("Msiki").checked = true;
	document.getElementById("Medge").checked = false;
	document.getElementById("Mpix").checked = true;
	document.getElementById("Mhsv").checked = true;
	document.getElementById("Mkido").checked = true;
	document.getElementById("Mkika").checked = false;
	document.getElementById("Mhistogram").checked = true;
	document.getElementById("Mcustom").checked = true;

	document.getElementById("divHidden").checked = false;
}, false);
