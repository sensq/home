/*
** 画像処理用の処理を集めたライブラリ
** 使い方, 説明, コメントはこちらへ
** http://www47.atpages.jp/sensq/blog/2014/01/25/603/
** 
** 2014/02/23
** @S_SenSq
*/

// オブジェクト作成
var CV = function () { };
// 履歴格納用
CV.history = [];
CV.historyR = [];
// 読み込んだ画像格納用（スケーリング無くせばグローバルにする必要無い）
CV.image;
// 画像のサイズ格納用
CV.width = 0;
CV.height = 0;

// 読み込んだ画像を描画
CV.setImage = function (img, iDiv, oDiv) {
	var canvas = document.getElementById(iDiv);
	var context = canvas.getContext('2d');
	// 履歴初期化
	CV.history = [];
	CV.historyR = [];
	// 画像読み込み
	CV.image = new Image();
	CV.image.src = img;
	// 読み込み終了を待つ
	CV.image.onload = function () {
		// 描画領域を画像のサイズにリサイズ
		// width>500 or height>400の場合は強制的に500に縮小
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
		// 画像描画
		context.drawImage(CV.image, 0, 0);
		// 画素データ読み込みとサイズ取得
		var input = context.getImageData(0, 0, canvas.width, canvas.height);
		CV.width = input.width;
		CV.height = input.height;
		// 最初の状態を履歴に保存
		CV.history.push(input);
		CV.init(oDiv);
	}
}

// 入力したCanvas要素を初期化
CV.init = function (canv) {
	// 履歴初期化（最初の状態は残す）
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
	// ヒストグラム計算・描画
	var hist = CV.histogram(img);	// 計算のみ
	CV.histogramGraph(hist);			// グラフ描画
}

// 戻る
CV.undo = function () {
	var history = CV.history;
	var outImg = CV.createTmpCanvas();
	var pre = history.length - 2;	// -1が今表示されているもの、-2が一つ前に表示していたもの
	if (pre > 0) {
		CV.historyR.push(history[pre + 1]);	// 今表示されているものをRedo用履歴に保存
		for (var y = 0; y < CV.height; y++) {
			for (var x = 0; x < CV.width; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y * CV.width + x) * 4 + c;
					outImg.data[i] = history[pre].data[i];
				}
			}
		}
		// "戻る前"に表示されていた履歴を消去
		history.pop();
	}
	else if (pre == 0) {
		/**********************************************
		** この時点で見た目は最初の状態に戻っているが、
		** 履歴には戻る前の状態がまだ残っているので取り出す操作だけする
		** 最初の状態だけが履歴に残る
		***********************************************/
		CV.historyR.push(history[pre + 1]);
		history.pop();
	}
	return outImg;
}

// やり直す
CV.redo = function () {
	var historyR = CV.historyR;
	var outImg = CV.createTmpCanvas();
	var next = historyR.length - 1;	// -1が戻る前に表示されていたもの
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
		// "進む前"に表示されていた履歴を消去
		historyR.pop();
		return outImg;
	}
	else
		return -1;	// エラー
}

// 入れ替え
CV.change = function (canv1, canv2) {
	// 一つ目のCanvas要素の情報を取得
	var canvas1 = document.getElementById(canv1);
	var context1 = document.getElementById(canv1).getContext('2d');
	var img1 = context1.getImageData(0, 0, canvas1.width, canvas1.height);

	// 二つ目のCanvas要素の情報を取得
	var canvas2 = document.getElementById(canv2);
	var context2 = document.getElementById(canv2).getContext('2d');
	var img2 = context2.getImageData(0, 0, canvas2.width, canvas2.height);

	// 入れ替えて再描画
	context1.putImageData(img2, 0, 0);
	context2.putImageData(img1, 0, 0);
}

// 変換用に元の画像と同サイズのCanvas要素を作成
CV.createTmpCanvas = function () {
	var canvas = document.createElement("canvas");
	var context = canvas.getContext('2d');
	// 入力画像と同サイズの画像データを作成
	var outImg = context.createImageData(CV.width, CV.height);
	// 初期化
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

// 基本形
CV.sample = function (inImg) {
	// 空の変換用Canvasを作成
	var outImg = CV.createTmpCanvas();
	// 全画素ループ
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// 入力画像のそれぞれの画素値に何かしら処理を加えて出力画像を作る
			// この場合は何もしていないのでただ画像をコピーしているだけ
			outImg.data[i + 0] = inImg.data[i + 0];
			outImg.data[i + 1] = inImg.data[i + 1];
			outImg.data[i + 2] = inImg.data[i + 2];
			outImg.data[i + 3] = inImg.data[i + 3];
		}
	}
	// 作成した画像データを返す
	return outImg;
}
///////////////
// ブレンディング //
///////////////

// 基本形
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
// 加算
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
// 減算
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
// 除外
CV.blend.exclusion = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		// 相加相乗平均
		var value = base + blend - 2 * base * blend / 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// 差の絶対値
CV.blend.abs = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value = Math.abs(base - blend);
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// 乗算
CV.blend.multi = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		var value = base * blend / 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// 焼き込み
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
// スクリーン
CV.blend.screen = function (inImg1, inImg2) {
	var calc = function (base, blend) {
		// 反転色で乗算して反転
		var value = 255 - ((255 - base) * (255 - blend)) / 255;
		return value;
	}
	var outImg = CV.blend.loop(calc, inImg1, inImg2);
	return outImg;
}
// 覆い焼き
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
// オーバーレイ
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
// ソフトライト
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
// ハードライト
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
// リニアライト
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
// ピンライト
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
// ビビッドライト
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
/////////////
// エッジ検出 //
/////////////

// エッジ検出（8近傍ラプラシアン）
CV.edge = function (inImg) {
	var outImg = CV.createTmpCanvas();
	outImg = CV.sobel(inImg, 5);
	return outImg;
}

// エッジ検出（4近傍ラプラシアン）
CV.edge2 = function (inImg) {
	var outImg = CV.createTmpCanvas();
	outImg = CV.sobel(inImg, 0);
	return outImg;
}

// ソーベル（第二引数に0を渡すと4近傍、5を渡すと8近傍ラプラシアン）
CV.sobel = function (inImg, course) {
	var outImg = CV.createTmpCanvas();
	switch (course) {
		case 0: var S = [0, 1, 0, 1, -4, 1, 0, 1, 0]; break;	// 4近傍
		case 1: var S = [0, -1, -2, 1, 0, -1, 2, 1, 0]; break;
		case 2: var S = [-1, -2, -1, 0, 0, 0, 1, 2, 1]; break;
		case 3: var S = [-2, -1, 0, -1, 0, 1, 0, 1, 2]; break;
		case 4: var S = [1, 0, -1, 2, 0, -2, 1, 0, -1]; break;
		case 5: var S = [1, 1, 1, 1, -8, 1, 1, 1, 1]; break;	// 8近傍
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
// RGBとHSVの相互変換 //
/////////////////////

// RGB→HSV変換
CV.RGB2HSV = function (inImg) {
	var colorIndex = []
	// colorに値を格納
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
	// HSVの値を計算して格納
	for (var i = 0; i < colorIndex.length; i++) {
		var max = Math.max(colorIndex[i].r, Math.max(colorIndex[i].g, colorIndex[i].b));
		var min = Math.min(colorIndex[i].r, Math.min(colorIndex[i].g, colorIndex[i].b));
		// Hueの計算
		if (max == min) {
			colorIndex[i].h = 0;
		} else if (max == colorIndex[i].r) {
			colorIndex[i].h = (60 * (colorIndex[i].g - colorIndex[i].b) / (max - min) + 360) % 360;
		} else if (max == colorIndex[i].g) {
			colorIndex[i].h = (60 * (colorIndex[i].b - colorIndex[i].r) / (max - min)) + 120;
		} else if (max == colorIndex[i].b) {
			colorIndex[i].h = (60 * (colorIndex[i].r - colorIndex[i].g) / (max - min)) + 240;
		}
		// Saturationの計算
		if (max == 0) {
			colorIndex[i].s = 0;
		} else {
			colorIndex[i].s = (255 * ((max - min) / max))
		}
		// Valueの計算
		colorIndex[i].v = max;
	}
	return colorIndex;
}

// HSV→RGB変換
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

// HSV変換
CV.hsv = function () { }
// 色相変換
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
// 彩度変換
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
// 明度変換
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
// 抽出領域以外をカット
CV.hsv.cutConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsvのそれぞれの範囲（StartとEnd）を指定
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
			// hueSが負だったときの処理
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
// 抽出領域を透過
CV.hsv.transConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsvのそれぞれの範囲（StartとEnd）を指定
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
// 抽出領域を白色化
CV.hsv.whiteConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsvのそれぞれの範囲（StartとEnd）を指定
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
// 抽出領域を黒色化
CV.hsv.blackConvert = function (inImg, hueS, hueE, satS, satE, volS, volE) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsvのそれぞれの範囲（StartとEnd）を指定
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
// 抽出領域の色相を変換
CV.hsv.extractH = function (inImg, hueS, hueE, satS, satE, volS, volE, partH) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsvのそれぞれの範囲（StartとEnd）を指定
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
// 抽出領域の彩度を変換
CV.hsv.extractS = function (inImg, hueS, hueE, satS, satE, volS, volE, partS) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsvのそれぞれの範囲（StartとEnd）を指定
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
// 抽出領域の明度を変換
CV.hsv.extractV = function (inImg, hueS, hueE, satS, satE, volS, volE, partV) {
	var colorIndex = CV.RGB2HSV(inImg);
	for (var i = 0; i < colorIndex.length; i++) {
		// hsvのそれぞれの範囲（StartとEnd）を指定
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
// 最終的な変換処理
CV.hsv.convert = function (colorIndex) {
	var outImg = CV.createTmpCanvas();
	colorIndex = CV.HSV2RGB(colorIndex);
	// 変換処理
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

// 入力されたCanvas要素の情報を読み込んで返す
CV.read = function (canv) {
	var canvas = document.getElementById(canv);
	var context = canvas.getContext('2d');
	var input = context.getImageData(0, 0, canvas.width, canvas.height);
	return input;
}

// 入力されたCanvas要素に画像を描画
CV.draw = function (canv, outImg) {
	var canvas = document.getElementById(canv);
	var context = canvas.getContext('2d');
	context.putImageData(outImg, 0, 0);
	// 履歴を作る
	CV.history.push(outImg);
}

// 画像保存
// 参考にしました → http://jsdo.it/Yukisuke/p311
CV.save = function () {
	var canvas;
	if (!document.getElementById("change").checked) {
		canvas = document.getElementById(outputDiv);
	} else {
		canvas = document.getElementById("img");
	}
	var base64 = canvas.toDataURL();	// firefoxならtoblobで直接blobにして保存できます。
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
		if ( /*@cc_on ! @*/ false) {	// IEの場合
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


// ヒストグラム計算
CV.histogram = function (inImg) {
	// RGBの各輝度の画素数を保存しておく配列を作って初期化
	var hist = {
		r: [],
		g: [],
		b: []
	};
	for (var i = 0; i < 256; i++) {
		hist.r[i] = hist.g[i] = hist.b[i] = 0;
	}
	// 各色の輝度ごとの画素数を求める
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			i = (y * CV.width + x) * 4;
			hist.r[inImg.data[i + 0]]++;
			hist.g[inImg.data[i + 1]]++;
			hist.b[inImg.data[i + 2]]++;
		}
	}
	// 全画素数に対する輝度ごとの画素の割合を求める
	var max = CV.width * CV.height;
	for (var i = 0; i < 256; i++) {
		hist.r[i] = hist.r[i] / max * 100;
		hist.g[i] = hist.g[i] / max * 100;
		hist.b[i] = hist.b[i] / max * 100;
	}
	// 輝度0と255は表示しない（表示するとだいたい0か255の割合が突出してグラフが見づらくなる）
	hist.r[0] = hist.r[255] = 0;
	hist.g[0] = hist.g[255] = 0;
	hist.b[0] = hist.b[255] = 0;

	return hist;
}
// ヒストグラムのグラフ描画（gRaphael.jsを読み込まないと使えません）
CV.histogramGraph = function (hist) {
	// 前回のグラフを消去
	document.getElementById('histogram').innerHTML = "";
	document.getElementById('histogram').style.backgroundColor = "#aaccff";
	var r = Raphael("histogram", 460, 170);	// 表示領域のサイズ
	var txtattr = { font: "15px sans-serif" };
	r.text(200, 12, "Color Histgram").attr(txtattr);
	r.text(20, 12, "[%]").attr(txtattr);
	r.text(430, 150, "輝度").attr(txtattr);

	var x = [];
	for (var i = 0; i <= 260; i++) {
		x[i] = i;
	}
	// 原点（左上）, width, height, xValue[], yValue[], opts
	var lines = r.linechart(10, 12, 400, 145,
		// 横
		[x],
		// 縦
		[hist.r, hist.g, hist.b],
		// オプション
		{
			nostroke: false,	// falseで点を繋ぐ
			axis: "0 0 1 1",	// 上, 右, 下, 左軸を表示
			axisxstep: 13,	// x軸の分割数（ラベル間隔に相当 260/13=20）
			axisystep: 5,	// y軸の分割数
			colors: ["#f00", "#0f0", "#00f"],	// 折れ線の色
			gutter: 15,	// padding
			shade: true,
			symbol: "circle",	// 点の形
			smooth: true
		}
	);
	var xlabel = lines.axis[0].text.items;
	var ylabel = lines.axis[1].text.items;
	lines.axis.attr({ "stroke-width": 3, });	// 軸の太さ
	// ラベルの文字サイズ変更
	for (var i = 0; i < xlabel.length; i++) {
		xlabel[i].attr(txtattr);
	}
	for (var i = 0; i < ylabel.length; i++) {
		ylabel[i].attr(txtattr);
	}
	// 点のサイズ変更
	lines.symbols.attr({ r: 1 });
}


// 先鋭化(3x3)
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
// 透過処理 //
/////////////

// 透過
CV.transparent = function (inImg, threshold) {
	var outImg = CV.createTmpCanvas();
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			// グレースケールの定数
			var gray =
				+0.299 * inImg.data[i]
				+ 0.587 * inImg.data[i + 1]
				+ 0.114 * inImg.data[i + 2];
			outImg.data[i + 0] = inImg.data[i + 0];
			outImg.data[i + 1] = inImg.data[i + 1];
			outImg.data[i + 2] = inImg.data[i + 2];
			outImg.data[i + 3] = inImg.data[i + 3];
			// 一定輝度以上のピクセルを透過
			if (gray >= threshold) {
				outImg.data[i + 3] = 0;
			}
		}
	}
	return outImg;
}
// 垂直反転
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

// 水平反転
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

// 拡縮（未完成）
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
// ぼかし //
//////////

// ランダム入れ替え(NxN)
CV.shuffle = function (inImg, N) {
	var outImg = CV.createTmpCanvas();
	var size = Math.pow(N, 2);
	// 位置を入れ替えるための配列
	var number = [];
	for (var i = 0; i < size; i++) {
		number[i] = []
	}
	// 配列の要素をランダムに入れ替える（Fisher-Yates）
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
			// カーネル内の画素ごとのRGBを格納
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
			// ランダムに入れ替えた画素を代入
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

// メディアン
CV.median = function (inImg) {
	var outImg = CV.createTmpCanvas();
	// 中央値を求めるための配列
	var number = [];
	// クイックセレクト（k番目の値だけ正しくなるソート）
	// 中央値（左から5番目）が欲しいだけなので、すべてソートする必要は無い
	Array.prototype.quickselect = function (k, l, r) {
		var v, i, j, t;
		var l = l || 0;	// 開始位置
		var r = r || this.length - 1;	// 終了位置
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
	// メディアンフィルタの処理
	for (var y = 1; y < CV.height - 1; y++) {
		for (var x = 1; x < CV.width - 1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				// 3x3のデータを格納（この入れ方が一番速かった）
				number[0] = inImg.data[i - CV.width * 4 - 4];
				number[1] = inImg.data[i - CV.width * 4];
				number[2] = inImg.data[i - CV.width * 4 + 4];
				number[3] = inImg.data[i - 4];
				number[4] = inImg.data[i];
				number[5] = inImg.data[i + 4];
				number[6] = inImg.data[i + CV.width * 4 - 4];
				number[7] = inImg.data[i + CV.width * 4];
				number[8] = inImg.data[i + CV.width * 4 + 4];
				// デフォルトのソート（たぶんクイックソート）
				// number.sort(
				// 	function(a,b){
				// 		if( a < b ) return -1;
				// 		if( a > b ) return 1;
				// 		return 0;
				// 	}
				// );
				// クイックセレクト版
				number.quickselect(5);
				// 中央値を代入
				outImg.data[i] = number[4];
			}
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}

// 平滑化(NxN)
CV.smoothing = function (inImg, N) {
	N = N || 5;
	var outImg = CV.createTmpCanvas();
	var smooth = Math.pow(N, -2);
	// 全画素ループ
	var offset = (N - 1) / 2;
	for (var y = offset; y < CV.height - offset; y++) {
		for (var x = offset; x < CV.width - offset; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y * CV.width + x) * 4 + c;
				var sum = 0;
				// カーネル全ループ
				for (var dy = 0; dy < N; dy++) {
					for (var dx = 0; dx < N; dx++) {
						var horizon = CV.width * (-(N - 1) / 2 * 4 + 4 * dx);
						var vertical = -(N - 1) / 2 * 4 + 4 * dy;
						// 輝度値計算
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

// ガウシアン(3x3)
// NxNは二項定理が必要で重くなりそうだから作らない
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

// ガウシアン(5x5)
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

// モザイク(NxN)
CV.pixelization = function (inImg, N) {
	N = N || 5;
	var outImg = CV.createTmpCanvas();
	var offset = (N - 1) / 2;
	var count, r, g, b;
	// 全画素ループ
	for (var y = offset; y < CV.height; y += N) {
		for (var x = offset; x < CV.width; x += N) {
			var i = (y * CV.width + x) * 4;
			count = r = g = b = 0;
			// 入力用カーネル全ループ
			for (var dy = 0; dy < N; dy++) {
				for (var dx = 0; dx < N; dx++) {
					var horizon = -(N - 1) / 2 * 4 + 4 * dx;
					var vertical = -(N - 1) / 2 * 4 + 4 * dy;
					// 画像の範囲外は無視する
					if (
						((x + horizon) < 0) ||
						(CV.width <= (x + horizon)) ||
						((y + vertical) < 0) ||
						(CV.height <= (y + vertical))
					) {
						continue;
					}
					// 輝度値の合計を取得
					r += inImg.data[i + CV.width * horizon + vertical + 0];
					g += inImg.data[i + CV.width * horizon + vertical + 1];
					b += inImg.data[i + CV.width * horizon + vertical + 2];
					// 取得した画素の個数
					count++;
				}
			}
			// 平均輝度値を計算
			r = Math.round(r / count);
			g = Math.round(g / count);
			b = Math.round(b / count);
			// 出力用カーネル全ループ
			for (var dy = 0; dy < N; dy++) {
				for (var dx = 0; dx < N; dx++) {
					var horizon = -(N - 1) / 2 * 4 + 4 * dx;
					var vertical = -(N - 1) / 2 * 4 + 4 * dy;
					// 輝度値代入
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

// ブラー(NxN)
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
	// 全画素ループ
	for (var y = 0; y < CV.height; y++) {
		for (var x = 0; x < CV.width; x++) {
			var i = (y * CV.width + x) * 4;
			count = r = g = b = 0;
			// 入力用カーネル全ループ
			for (var dx = 0; dx < N; dx++) {
				if (course == "horizon") {
					var vertical = -(N - 1) / 2 * 4 + 4 * dx;
					var horizon = 0;
				} else {
					var horizon = -(N - 1) / 2 * 4 + 4 * dx;
					var vertical = H * horizon;
				}
				// 画像の範囲外は無視する
				if (
					((x + horizon) < 0) ||
					(CV.width <= (x + horizon)) ||
					((y + vertical) < 0) ||
					(CV.height <= (y + vertical))
				) {
					continue;
				}
				// 輝度値の合計を取得
				r += inImg.data[i + CV.width * horizon + vertical + 0];
				g += inImg.data[i + CV.width * horizon + vertical + 1];
				b += inImg.data[i + CV.width * horizon + vertical + 2];
				// 取得した画素の個数
				count++;
			}
			// 平均輝度値を計算
			r = Math.round(r / count);
			g = Math.round(g / count);
			b = Math.round(b / count);
			// 輝度値代入
			outImg.data[i + 0] = r;
			outImg.data[i + 1] = g;
			outImg.data[i + 2] = b;
			outImg.data[(y * CV.width + x) * 4 + 3] = inImg.data[(y * CV.width + x) * 4 + 3]; // alpha
		}
	}
	return outImg;
}
