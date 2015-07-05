
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