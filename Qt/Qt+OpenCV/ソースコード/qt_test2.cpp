#include "qt_test2.h"

// main関数のshow実行時に実行される関数
Qt_test2::Qt_test2(QWidget *parent)
	: QWidget(parent)
{
	// 初期設定とかやっておく
	Qt_test2::resultWindow = "Result";
	ui.setupUi(this);
	setAcceptDrops(true);

	// エラー防止のための初期化
	image_ = cv::Mat::zeros(100, 100, CV_8UC3);
	now_ = cv::Mat::zeros(100, 100, CV_8UC3);
}

Qt_test2::~Qt_test2()
{
	// 何もいらないっぽい？
}

// テキストボックスから値を取得する
bool Qt_test2::resizeRate(double* rate){
	QString str;
	str = ui.lineEdit->text();
	rate[0] = str.toDouble();
	str = ui.lineEdit_2->text();
	rate[1] = str.toDouble();
	// 0以下の入力は1にする
	if(rate[0] <= 0 | rate[1] <= 0)
		rate[0] = rate[1] = 1.0;
	return true;
}

// 現在表示している画像を保存
void Qt_test2::on_save_clicked()
{
	cv::imwrite("result.png", now_);
}

// 線形補間でリサイズを行う関数
void Qt_test2::on_LINEAR_clicked()
{
	double rate[2];
	// 倍率を取得
	resizeRate(rate);
	cv::Mat dst;
	// リサイズ（src, dst, size, x倍率, y倍率, 使う手法）
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_LINEAR);
	// now_にコピー
	now_ = dst.clone();
	// 表示
	cv::imshow(resultWindow, dst);
}
// 以下は手法が異なるだけ
void Qt_test2::on_AREA_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_AREA);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}
void Qt_test2::on_NEAREST_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_NEAREST);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}
void Qt_test2::on_LANCZOS4_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_LANCZOS4);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}
void Qt_test2::on_CUBIC_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_CUBIC);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}

// ドラッグ＆ドロップを受け付ける
// これがないと受付られない。
void Qt_test2::dragEnterEvent(QDragEnterEvent *e)
{
    if(e->mimeData()->hasFormat("text/uri-list"))
    {
        e->acceptProposedAction();
    }
}

// dragEnterEventの後にくるイベント
// ドロップの際の動作を記述する
// eに色々情報が入っている
void Qt_test2::dropEvent(QDropEvent *e)
{
	// toLocal8Bitで渡すとパスに日本語含んでるファイルも読み込めるっぽい
	std::string url = e->mimeData()->urls().first().toLocalFile().toLocal8Bit();
	// ラベルなどに表示する場合はQString型のまま渡さないと文字化けする
	ui.filename->setText(e->mimeData()->urls().first().toLocalFile());
	// 読み込んだファイル名の画像を変数に入れる
	Qt_test2::image_ = cv::imread(url, 1);
	// 解像度をラベルに表示
	ui.resolutionX->setText(QString::number(Qt_test2::image_.cols));
	ui.resolutionY->setText(QString::number(Qt_test2::image_.rows));
	// 画像を表示
	cv::imshow(resultWindow, Qt_test2::image_);
	drawForQtLabel();
}

// Qtの画面に画像を表示する
void Qt_test2::drawForQtLabel()
{
	// 4ch画像に変換→RとB入れ替え
	cv::Mat dst;
	cv::cvtColor(Qt_test2::image_, dst, CV_RGB2BGRA);
	cv::Mat dst_rgba = dst.clone();
	int fromTo[] = { 0,2,  1,1,  2,0,  3,3 };
	cv::mixChannels(&dst, 1, &dst_rgba, 1, fromTo, 3);
	// 縮小するサイズを求める（131はラベルのサイズ）
	double size[2];
	double r;
	int labelWidth = ui.label->geometry().width();
	int labelHeight = ui.label->geometry().height();
	size[0] = labelWidth/(double)dst_rgba.cols;
	size[1] = labelHeight/(double)dst_rgba.rows;
	// 小さい方を使ってアス比維持して縮小する
	if(size[0] < size[1])
		r = size[0];
	else
		r = size[1];
	// リサイズ
	cv::resize(dst_rgba, dst_rgba, cv::Size(), r, r, cv::INTER_AREA);
	// Qtの画像用の型に渡す
    QImage image(dst_rgba.data, 
                 dst_rgba.cols, dst_rgba.rows, 
                 QImage::Format_ARGB32);
	// ラベルの色を画像のピクセルの色に塗り替える
	ui.label->setPixmap(QPixmap::fromImage(image));
}
