#ifndef POISSONIMAGESYNTHESIS_H
#define POISSONIMAGESYNTHESIS_H

#include <iostream>
#include <opencv2/opencv.hpp>
#include <QtWidgets/QWidget>
#include "ui_poissonimagesynthesis.h"

// OpenCVのバージョンを取得してpragma文でライブラリを読み込む
#define CV_VERSION_STR CVAUX_STR(CV_MAJOR_VERSION) CVAUX_STR(CV_MINOR_VERSION) CVAUX_STR(CV_SUBMINOR_VERSION)

#ifdef _DEBUG
#define CV_EXT_STR "d.lib"
#else _REREASE
#define CV_EXT_STR ".lib"
#endif

#pragma comment(lib,"opencv_core" CV_VERSION_STR CV_EXT_STR)
#pragma comment(lib,"opencv_imgproc" CV_VERSION_STR CV_EXT_STR)
#pragma comment(lib,"opencv_highgui" CV_VERSION_STR CV_EXT_STR)
#pragma comment(lib,"opencv_video" CV_VERSION_STR CV_EXT_STR)
#pragma comment(lib,"opencv_features2d" CV_VERSION_STR CV_EXT_STR)

class PoissonImageSynthesis : public QWidget
{
	Q_OBJECT

public:
	PoissonImageSynthesis(QWidget *parent = 0);
	~PoissonImageSynthesis();
	void poisson();
	void commonButtonFunction();
	public slots:
		void on_setButton_1_clicked();
		void on_setButton_2_clicked();
		void on_setButton_3_clicked();
		void on_setButton_4_clicked();
		void on_setButton_5_clicked();
		void on_resetButton_clicked();
		void on_iterateButton_clicked();
		void on_checkBox_clicked();

private:
	cv::Mat base, blend, mask;
	cv::Mat dst[2];	//!< 出力画像（ImportとMixingで2つ）
	int lMax;	//!< ループ回数（GUI側で設定）
	bool rev;	//!< ベースとブレンド画像を入れ替えるフラグ

	void poissonSolver(int lMax, cv::Mat &base, cv::Mat &blend, cv::Mat &dst, cv::Mat &mask = cv::Mat(), bool mix = false, cv::Point2i offset = cv::Point2i(0, 0), bool init = true);
	void drawForQtLabel(cv::Mat &src, QLabel *label, bool autoResize);
	Ui::PoissonImageSynthesisClass ui;
};

#endif // POISSONIMAGESYNTHESIS_H
