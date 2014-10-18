#ifndef HIST_H
#define HIST_H

#include <QFileDialog>
#include <QListWidget>
#include <QTextCodec>
#include <QDropEvent>
#include <QMimeData>
#include <QPixmap>

#include <iostream>
#include <Windows.h>
#include <opencv2/opencv.hpp>


#include <QtWidgets/QWidget>
#include "ui_hist.h"

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

class HIST : public QWidget
{
	Q_OBJECT

public:
	HIST(QWidget *parent = 0);
	~HIST();

	/// �u�����h�^�C�v�̗񋓎q
	enum blendType{
		ADD = 0,
		DIFF = 1,
		EXCLUSION = 2,
		ABS = 3,
		MULTI = 4,
		BURN = 5,
		SCREEN = 6,
	};

	public slots:
		void on_tableWidget_currentCellChanged(int currentRow, int currentColumn, int previousRow, int previousColumn);

private:
	Ui::HISTClass ui;
	/// �e�[�u���̒��g
	std::vector<QTableWidgetItem*> item;
	double step;	//!< RGB�q�X�g�O�����̃������Ԋu
	double stepH;	//!< �F���q�X�g�O�����̃������Ԋu

	void dragEnterEvent(QDragEnterEvent *e);
	void dropEvent(QDropEvent *e);
	void drawForQtLabel(cv::Mat &src, QLabel *label, bool autoResize = true);
	void calcHistgram(cv::Mat &src);
	void calcHistgramHue(cv::Mat &src);
	void blend(cv::Mat &base, cv::Mat &blend, cv::Mat &dst, int blendType);
	int multi(int baseValue, int blendtValue);
};

#endif // HIST_H
