
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