#include "poissonimagesynthesis.h"

PoissonImageSynthesis::PoissonImageSynthesis(QWidget *parent)
	: QWidget(parent)
{
	ui.setupUi(this);
	base = cv::imread("base.png");
	blend = cv::imread("blend.png");
	mask = cv::imread("mask.png", 0);
	ui.spinBox->setValue(1);

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);

	poisson();
}

PoissonImageSynthesis::~PoissonImageSynthesis()
{
}

void PoissonImageSynthesis::on_checkBox_clicked()
{
	cv::Mat tmp = base.clone();
	base = blend.clone();
	blend = tmp.clone();

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);
	poisson();
}

void PoissonImageSynthesis::on_setButton_1_clicked()
{
	base = cv::imread("base_test1.png");
	blend = cv::imread("blend_test1.png");
	mask = cv::imread("mask_test1.png", 0);

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);
	poisson();
}

void PoissonImageSynthesis::on_setButton_2_clicked()
{
	base = cv::imread("base_test2.png");
	blend = cv::imread("blend_test2.png");
	mask = cv::imread("mask_test2.png", 0);

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);
	poisson();
}

void PoissonImageSynthesis::on_setButton_3_clicked()
{
	base = cv::imread("base.png");
	blend = cv::imread("blend.png");
	mask = cv::imread("mask.png", 0);

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);
	poisson();
}

void PoissonImageSynthesis::on_setButton_4_clicked()
{
	base = cv::imread("base_test3.png");
	blend = cv::imread("blend_test3.png");
	mask = cv::imread("mask_test3.png", 0);

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);
	poisson();
}

// 1回の呼び出しで行う計算回数
void PoissonImageSynthesis::poissonSolver(int lMax, cv::Mat &base, cv::Mat &blend, cv::Mat &dst, cv::Mat &mask, bool mix, cv::Point2i offset, bool init)
{
	// 処理時間計測用
	double f = 1000.0/cv::getTickFrequency();
	int64 time = cv::getTickCount();

	// 許容誤差
	static const double EPS = 0.00005;
	// 隣接画素数（上下左右だけとするので4つで固定）
	static const int NUM_NEIGHBOR = 4;

	float error, sum_f, sum_vpq, sum_vpq1, sum_vpq2, fp;

	// マスク指定しない場合は全画素を処理
	if(mask.data == NULL)
		mask = cv::Mat(blend.rows, blend.cols, CV_8UC1, cv::Scalar::all(255));
	// エラー処理
	if(blend.channels() == 4)
		cv::cvtColor(blend, blend, cv::COLOR_BGRA2BGR);
	if(base.channels() == 4)
		cv::cvtColor(base, base, cv::COLOR_BGRA2BGR);
	if(mask.channels() == 3)
		cv::cvtColor(mask, mask, cv::COLOR_BGR2GRAY);
	else if(mask.channels() == 4)
		cv::cvtColor(mask, mask, cv::COLOR_BGRA2GRAY);

	// 注目画素の上下左右の画素
	static const int naddr[NUM_NEIGHBOR][2] = {{-1,0}, {0,-1}, {0,1}, {1,0}};
	// 計算用行列
	cv::Mat next = cv::Mat_<double>(blend.rows, blend.cols);

	// 出力画像の初期化
	if(init)
		dst = base.clone();

	// チャンネルごとに処理
	for (int c = 0; c < blend.channels(); c++){
		// double型のMatに入れ替え（0～255以外の値も使うため）
		for(int y=0; y<blend.rows; y++)
			for(int x=0; x<blend.cols; x++)
				next.at<double>(y, x) = (double)dst.data[y*dst.step + x*dst.elemSize() + c];

		// ガウス・ザイデル法でポアソン方程式を解く
		for(int loop=0; loop<lMax; loop++){
			// 収束判定用の変数
			bool ok = true;
			for(int y=0; y <mask.rows; y++){
				for(int x=0; x <mask.cols; x++){
					// マスクの領域のみ処理
					if((int)mask.data[y*mask.step + x*mask.elemSize()] > 0){
						// 初期化
						sum_f = 0.0;
						sum_vpq = 0.0;
						sum_vpq1 = 0.0;
						sum_vpq2 = 0.0;
						for(int neighbor=0; neighbor<NUM_NEIGHBOR; neighbor++){
							// 注目画素が入力画像をはみ出していないかの判定
							if(y+offset.x+naddr[neighbor][0] >= 0
								&& x+offset.y+naddr[neighbor][1] >= 0
								&& y+offset.x+naddr[neighbor][0] < blend.rows
								&& x+offset.y+naddr[neighbor][1] < blend.cols)
							{
								// 隣接画素の合計値
								sum_f += next.at<double>(y+offset.x+naddr[neighbor][0], x+offset.y+naddr[neighbor][1]);
								// 注目画素と隣接画素の勾配∇f
								sum_vpq1 = base.data[y*base.step + x*base.elemSize() + c] - base.data[(y+naddr[neighbor][0])*base.step + (x+naddr[neighbor][1])*base.elemSize() + c];
								sum_vpq2 = blend.data[y*blend.step + x*blend.elemSize() + c] - blend.data[(y+naddr[neighbor][0])*blend.step + (x+naddr[neighbor][1])*blend.elemSize() + c];

								// 上下左右4つ分を加算
								// Mixing（絶対値が大きい方を加算）
								if(mix){
									if(abs(sum_vpq1) > abs(sum_vpq2))
										sum_vpq += sum_vpq1;
									else
										sum_vpq += sum_vpq2;
								}
								// Importing（必ずbaseの勾配を加算）
								else{
									sum_vpq += sum_vpq2;
								}
							}
						}
						// 隣接画素値と勾配4つ分の合計 / 隣接画素数
						fp = (sum_f + sum_vpq)/NUM_NEIGHBOR;
						// 今回のfpと前回のfpが許容誤差に収まるまで繰り返す
						error = fabs(fp - next.at<double>(y+offset.x,x+offset.y));
						// 注目画素の収束判定
						if(ok && error>EPS*(1+fabs(fp)) ){
							ok = false;
						}
						// 値を更新
						next.at<double>(y+offset.x, x+offset.y) = fp;
					}
				}
			}
			// 収束判定（全画素が収束判定を満たしたら終了）
			if(ok)
				break;

			// saturate（0以下は0, 255以上は255にする）
			for(int y=0; y<dst.rows; y++)
				for(int x=0; x<dst.cols; x++)
					dst.data[y*dst.step + x*dst.elemSize() + c] = cv::saturate_cast<uchar>(next.at<double>(y, x));
		}
	}

	// 処理時間
	std::cout<<(cv::getTickCount()-time)*f<<" [ms]"<<std::endl;
}

// 画像をポアソン合成
void PoissonImageSynthesis::poisson()
{
	//cv::resize(base, base, cv::Size(), 0.5, 0.5, cv::INTER_AREA);
	//cv::resize(blend, blend, cv::Size(), 0.5, 0.5, cv::INTER_AREA);
	//cv::resize(mask, mask, cv::Size(), 0.5, 0.5, cv::INTER_AREA);
	cv::Point2i offset(0, 0);

	lMax = ui.spinBox->value();

	poissonSolver(lMax, base, blend, dst[0], mask, true, offset, true);
	drawForQtLabel(dst[0], ui.labelMix, true);
	cv::imwrite("結果-Mix.png", dst[0]);

	poissonSolver(lMax, base, blend, dst[1], mask, false, offset, true);
	drawForQtLabel(dst[1], ui.labelImp, true);
	cv::imwrite("結果-Import.png", dst[1]);
}

// リセットボタン
void PoissonImageSynthesis::on_resetButton_clicked()
{
	poissonSolver(1, base, blend, dst[0], mask, true);
	drawForQtLabel(dst[0], ui.labelMix, true);

	poissonSolver(1, base, blend, dst[1], mask, false);
	drawForQtLabel(dst[1], ui.labelImp, true);
}

// 更新ボタン
void PoissonImageSynthesis::on_iterateButton_clicked()
{
	cv::Point2i offset(0, 0);

	lMax = ui.spinBox->value();

	poissonSolver(lMax, base, blend, dst[0], mask, true, offset, false);
	drawForQtLabel(dst[0], ui.labelMix, true);
	cv::imwrite("結果-Mix.png", dst[0]);

	poissonSolver(lMax, base, blend, dst[1], mask, false, offset, false);
	drawForQtLabel(dst[1], ui.labelImp, true);
	cv::imwrite("結果-Import.png", dst[1]);
}

// 画像をラベルに描画
void PoissonImageSynthesis::drawForQtLabel(cv::Mat &src, QLabel *label, bool autoResize)
{
	// エラー処理
	if(src.data == NULL)
		return;

	// 3ch画像は4ch画像に変換
	cv::Mat dst = src.clone();
	if(src.channels() == 3)
		cv::cvtColor(dst, dst, CV_BGR2BGRA);

	// 縮小するサイズを求める
	double size[2];
	double r;
	// ラベルのサイズを取得
	if(autoResize){
		int labelWidth = label->geometry().width();
		int labelHeight = label->geometry().height();
		size[0] = labelWidth/(double)dst.cols;
		size[1] = labelHeight/(double)dst.rows;
		// 縮小率が小さい方を使ってアス比維持して縮小する
		r = (size[0] < size[1]) ? size[0] : size[1];
		// リサイズ
		cv::resize(dst, dst, cv::Size(), r, r, cv::INTER_AREA);
	}

	// Qtの画像用の型に渡す
	QImage image;
	switch(dst.channels()){
	case 1:
		// 白黒画像
		image = QImage(dst.data, dst.cols, dst.rows, QImage::Format_Indexed8);
		break;
	case 4:
		// カラー画像
		image = QImage(dst.data, dst.cols, dst.rows, QImage::Format_ARGB32);
		break;
	default:
		// たぶんここは呼ばれないはず
		std::cout << "ERROR" << std::endl;
		return;
	}

	// ラベルの色を画像のピクセルの色に塗り替える
	label->setPixmap(QPixmap::fromImage(image));
}