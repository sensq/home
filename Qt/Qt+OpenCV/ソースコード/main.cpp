/*
** QtとOpenCVを組み合わせたサンプルです
** 画像をドラッグアンドドロップで読み込み, 倍率を指定してリサイズできます
** 手法による結果の違いが見れます
** 2014/03/25
** @小針 千春
*/
#include "qt_test2.h"
#include <QtWidgets/QApplication>

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	Qt_test2 w;

	// ウィンドウタイトルとサイズと初期位置
	w.setWindowTitle("test");
	w.setMaximumHeight(290);
	w.move(0, 200);

	w.show();
	return a.exec();
}
