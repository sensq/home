// グラフ作成用ライブラリ
document.write('<script type="text/javascript" src="raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.line-min.js"></script>');
document.write('<script type="text/javascript" src="../build/CV.js"></script>');

var inputDiv = "img";
var outputDiv = "outputImg";

// 初期化
var init = function () {
	CV.init(outputDiv);
}
// ヒストグラム
var histogram = function () {
	var inImg = CV.read(outputDiv);
	var hist = CV.histogram(inImg);	// 計算のみ
	CV.histogramGraph(hist);			// グラフ描画
}
// 戻る
var undo = function () {
	var outImg = CV.undo();
	// CV.drawだと戻ったときの状態で再び履歴を作ってしまうのでダメ
	var canvas = document.getElementById(outputDiv);
	var context = canvas.getContext('2d');
	context.putImageData(outImg, 0, 0);
}
// 戻る
var redo = function () {
	var outImg = CV.redo();
	// CV.drawだと戻ったときの状態で再び履歴を作ってしまうのでダメ
	if (outImg != -1) {
		var canvas = document.getElementById(outputDiv);
		var context = canvas.getContext('2d');
		context.putImageData(outImg, 0, 0);
	}
}
// 画像の読み込み
var Read = function () {
	// 重ね掛けする場合
	if (document.getElementById("copy").checked)
		return CV.read(outputDiv);
		// 重ね掛けしない場合
	else
		return CV.read(inputDiv);
}

// 色調
// ネガポジ
var negaposi = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.negaposi(inImg);
	CV.draw(outputDiv, outImg);
}
// グレースケール
var gray = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.gray(inImg);
	CV.draw(outputDiv, outImg);
}
// セピア
var sepia = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.sepia(inImg);
	CV.draw(outputDiv, outImg);
}
// コントラスト
var contrast = function () {
	var inImg = Read(outputDiv);
	var threshold = document.getElementById('thresholdContrast').value;
	var outImg = CV.contrast(inImg, threshold);
	CV.draw(outputDiv, outImg);
}
// 二値化
var binary = function () {
	var inImg = Read(outputDiv);
	var threshold = document.getElementById('threshold').value;
	var outImg = CV.binary(inImg, threshold);
	CV.draw(outputDiv, outImg);
}
// 減色
var decreaseColor = function () {
	var bit = Number(colorBit.options[colorBit.selectedIndex].value);
	var inImg = Read(outputDiv);
	var outImg = CV.decreaseColor(inImg, bit);
	CV.draw(outputDiv, outImg);
}
// RGB抽出
var rgb = function (mode) {
	var inImg = Read(outputDiv);
	var outImg = CV.rgb(inImg, mode);
	CV.draw(outputDiv, outImg);
}
// カスタムフィルタ
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
// エッジ検出
// 4近傍ラプラシアン
var edge = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.sobel(inImg, 0);
	CV.draw(outputDiv, outImg);
}
// 8近傍ラプラシアン
var edge2 = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.sobel(inImg, 5);
	CV.draw(outputDiv, outImg);
}
// ソーベル
var sobel = function () {
	var inImg = Read(outputDiv);
	var course = parseInt(document.getElementById('course').value);
	// 第二引数に0を渡すと4近傍、5を渡すと8近傍ラプラシアン
	var outImg = CV.sobel(inImg, course);
	CV.draw(outputDiv, outImg);
}
// 平滑化
// メディアン
var median = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.median(inImg);
	CV.draw(outputDiv, outImg);
}
// 平滑化(NxN)
var smoothing = function (N) {
	var inImg = Read(outputDiv);
	var outImg = CV.smoothing(inImg, N);
	CV.draw(outputDiv, outImg);
}
// ガウシアン(3x3)
var gaussian = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.gaussian(inImg);
	CV.draw(outputDiv, outImg);
}
// ガウシアン(5x5)
var gaussian2 = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.gaussian2(inImg);
	CV.draw(outputDiv, outImg);
}
// ランダム入れ替え(NxN)
var shuffle = function (N) {
	var inImg = Read(outputDiv);
	var outImg = CV.shuffle(inImg, N);
	CV.draw(outputDiv, outImg);
}
// モザイク(NxN)
var pixelization = function (N) {
	var inImg = Read(outputDiv);
	var outImg = CV.pixelization(inImg, N);
	CV.draw(outputDiv, outImg);
}
// ブラー(NxN)
var motionblur = function (N, course) {
	var inImg = Read(outputDiv);
	var outImg = CV.motionblur(inImg, N, course);
	CV.draw(outputDiv, outImg);
}
// 先鋭化(3x3)
var sharp = function () {
	var inImg = Read(outputDiv);
	// 強さ
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

// 輝度
// ガンマ補正
var gamma = function () {
	var inImg = Read(outputDiv);
	// ガンマ値
	var g = document.getElementById('gammaValue').value;
	var outImg = CV.gammaLUT(inImg, g);
	CV.draw(outputDiv, outImg);
}
// 明度変更
var bright = function () {
	var inImg = Read(outputDiv);
	// 割合
	var rate = document.getElementById('brightValue').value;
	var outImg = CV.bright(inImg, rate);
	CV.draw(outputDiv, outImg);
}
// 透過
var transparent = function () {
	var inImg = Read(outputDiv);
	// ガンマ値
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
	if (mode == "add")	// 加算
		outImg = CV.blend.add(inImg1, inImg2);
	else if (mode === "diff")	// 減算
		outImg = CV.blend.diff(inImg1, inImg2);
	else if (mode == "exclusion")	// 除外
		outImg = CV.blend.exclusion(inImg1, inImg2);
	else if (mode == "abs")		// 差の絶対値
		outImg = CV.blend.abs(inImg1, inImg2);
	else if (mode == "multi")	// 乗算
		outImg = CV.blend.multi(inImg1, inImg2);
	else if (mode == "burn")	// 焼き込み
		outImg = CV.blend.burn(inImg1, inImg2);
	else if (mode == "screen")	// スクリーン
		outImg = CV.blend.screen(inImg1, inImg2);
	else if (mode == "dodge")	// 焼き込み
		outImg = CV.blend.dodge(inImg1, inImg2);
	else if (mode == "overlay")	// オーバーレイ
		outImg = CV.blend.overlay(inImg1, inImg2);
	else if (mode == "soft")	// ソフトライト
		outImg = CV.blend.soft(inImg1, inImg2);
	else if (mode == "hard")	// ハードライト
		outImg = CV.blend.hard(inImg1, inImg2);
	else if (mode == "linear")	// リニアライト
		outImg = CV.blend.linear(inImg1, inImg2);
	else if (mode == "pin")	// ピンライト
		outImg = CV.blend.pin(inImg1, inImg2);

	CV.draw(outputDiv, outImg);
}

// 幾何
// 水平反転
var hmirror = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.hmirror(inImg);
	CV.draw(outputDiv, outImg);
}
// 垂直反転
var vmirror = function () {
	var inImg = Read(outputDiv);
	var outImg = CV.vmirror(inImg);
	CV.draw(outputDiv, outImg);
}
// 拡大縮小
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
** 画像読み込み関連のメソッド
***********************/

// 画像を読み込み
function loadImg() {
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		// ファイル名と拡張子を別々に取得
		var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
		info = { name: name[1], type: name[2], size: img.size };
		var property = "NAME『" + img.name +
			"』, SIZE『" + img.size + "byte (" + (img.size / 1024).toFixed(0) + "KB)』";
		document.getElementById('list').innerSTML = property;
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			CV.setImage(e.target.result, inputDiv, outputDiv);
		}
		fr.readAsDataURL(img);
	} else {
		alert("画像ファイルを指定して下さい");
	}
}

// ドラッグ＆ドロップで読み込み
function onDropFile(e) {
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	// ファイル名と拡張子を別々に取得
	var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
	info = { name: name[1], type: name[2], size: img.size };
	var property = "NAME『" + img.name +
		"』, SIZE『" + img.size + "byte (" + (img.size / 1024).toFixed(0) + "KB)』";
	document.getElementById('list').innerHTML = property;
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			CV.setImage(e.target.result, inputDiv, outputDiv);
		}
		fr.readAsDataURL(img);
	} else {
		alert("画像ファイルを指定して下さい");
	}
}

// デフォルト処理をキャンセル
function onCancel(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	return false;
};

/*************
** その他のメソッド
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
** 任意の要素のオフセットを取得する関数 （描画領域のオフセット位置取得用）
** マウス座標を正しく取得するために必要
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
** マウス移動時のイベント
*/
document.addEventListener('mousemove', function (e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = { r: 0, g: 0, b: 0, a: 0, h: 0, s: 0, v: 0 };
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ここからイベント実装 */
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
		info = "R:" + rgba[0] + "　G:" + rgba[1] + "　B:" + rgba[2] + "　A:" + rgba[3] + "　　H:" + hsv[0] + "　S:" + hsv[1] + "　V:" + hsv[2];
		document.getElementById('info').innerHTML = info;
	}

	function rgb2hsv(color) {
		var max = Math.max(color.r, Math.max(color.g, color.b));
		var min = Math.min(color.r, Math.min(color.g, color.b));
		// Hueの計算
		if (max == min) {
			color.h = 0;
		} else if (max == color.r) {
			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
		} else if (max == color.g) {
			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
		} else if (max == color.b) {
			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
		}
		// Saturationの計算
		if (max == 0) {
			color.s = 0;
		} else {
			color.s = (255 * ((max - min) / max))
		}
		// Valueの計算
		color.v = max;
	}
}, false);

/*
** マウスクリック時のイベント（正確には離した時））
*/
document.addEventListener('click', function (e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = { r: 0, g: 0, b: 0, a: 0, h: 0, s: 0, v: 0 };
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ここからイベント実装 */
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
		// Hueの計算
		if (max == min) {
			color.h = 0;
		} else if (max == color.r) {
			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
		} else if (max == color.g) {
			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
		} else if (max == color.b) {
			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
		}
		// Saturationの計算
		if (max == 0) {
			color.s = 0;
		} else {
			color.s = (255 * ((max - min) / max))
		}
		// Valueの計算
		color.v = max;
	}
}, false);

// メニュー表示
var menu = function (divID) {
	var div = document.getElementById(divID);
	div.style.display = div.style.display == 'none' ? 'block' : 'none';
}
// 入力側を隠す
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

	// noneの個数数える
	for (var i = 0; i < div.length; i++) {
		if (div[i].style.display == 'none') {
			count++;
		}
	}
	// noneが一つでもあったら全部block、そうでなければ全部noneにする
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
	// ドラッグ＆ドロップに対応
	document.getElementById(inputDiv).addEventListener("dragover", onCancel, false);
	document.getElementById(inputDiv).addEventListener("dragenter", onCancel, false);
	document.getElementById(inputDiv).addEventListener("drop", onDropFile, false);
	document.getElementById(outputDiv).addEventListener("dragover", onCancel, false);
	document.getElementById(outputDiv).addEventListener("dragenter", onCancel, false);
	document.getElementById(outputDiv).addEventListener("drop", onDropFile, false);

	// デフォルト画像
	CV.setImage("HSV_cone.jpg", inputDiv, outputDiv);

	// 各デフォルト値
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

	// 色抽出用
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

	// メニュー用
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
