#ifndef QT_TEST2_H
#define QT_TEST2_H

// OpenCVのヘッダファイル
#include <opencv2/opencv.hpp>

// Qtのヘッダファイル
#include <QtWidgets/QWidget>
#include <QtGui/Qimage>
#include <QDropEvent>
#include <QMimeData>
#include <QTextCodec>
#include <Qpaintdevice>
#include "ui_qt_test2.h"

// OpenCVのライブラリのpragma文（だいたいこの4つ入れとけば動く）
#ifdef _DEBUG
#pragma comment(lib,"opencv_core244d.lib")
#pragma comment(lib,"opencv_highgui244d.lib")
#pragma comment(lib,"opencv_imgproc244d.lib")
#pragma comment(lib,"opencv_contrib244d.lib")
#else _REREASE
#pragma comment(lib,"opencv_core244.lib")
#pragma comment(lib,"opencv_highgui244.lib")
#pragma comment(lib,"opencv_imgproc244.lib")
#pragma comment(lib,"opencv_contrib244.lib")
#endif


class Qt_test2 : public QWidget
{
	Q_OBJECT

public:
	Qt_test2(QWidget *parent = 0);
	// デストラクタ
	~Qt_test2();
	// 読み込んだ生画像
	cv::Mat image_;
	// 現在表示されている画像
	cv::Mat now_;
	// 画像を表示するウィンドウのタイトル
	std::string resultWindow;

	// ボタンクリック時などに呼ぶ関数
	public slots:
		void on_save_clicked();
		void on_LINEAR_clicked();
		void on_AREA_clicked();
		void on_NEAREST_clicked();
		void on_LANCZOS4_clicked();
		void on_CUBIC_clicked();

private:
	// 作成したUIのクラス
	Ui::Qt_test2Class ui;
	// ドラッグドロップに対応させる関数
	void dragEnterEvent(QDragEnterEvent *e);
	void dropEvent(QDropEvent *e);

	bool resizeRate(double*);
	void drawForQtLabel();
};

#endif // QT_TEST2_H
