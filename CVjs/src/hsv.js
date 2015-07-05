
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