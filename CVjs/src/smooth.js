
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
