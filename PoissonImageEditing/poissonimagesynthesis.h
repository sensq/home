#ifndef POISSONIMAGESYNTHESIS_H
#define POISSONIMAGESYNTHESIS_H

#include <iostream>
#include <opencv2/opencv.hpp>
#include <QtWidgets/QWidget>
#include "ui_poissonimagesynthesis.h"

// OpenCV�̃o�[�W�������擾����pragma���Ń��C�u������ǂݍ���
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
	cv::Mat dst[2];	//!< �o�͉摜�iImport��Mixing��2�j
	int lMax;	//!< ���[�v�񐔁iGUI���Őݒ�j
	bool rev;	//!< �x�[�X�ƃu�����h�摜�����ւ���t���O

	void poissonSolver(int lMax, cv::Mat &base, cv::Mat &blend, cv::Mat &dst, cv::Mat &mask = cv::Mat(), bool mix = false, cv::Point2i offset = cv::Point2i(0, 0), bool init = true);
	void drawForQtLabel(cv::Mat &src, QLabel *label, bool autoResize);
	Ui::PoissonImageSynthesisClass ui;
};

#endif // POISSONIMAGESYNTHESIS_H
