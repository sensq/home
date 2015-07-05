

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