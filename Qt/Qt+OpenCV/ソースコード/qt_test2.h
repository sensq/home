#ifndef QT_TEST2_H
#define QT_TEST2_H

// OpenCV�̃w�b�_�t�@�C��
#include <opencv2/opencv.hpp>

// Qt�̃w�b�_�t�@�C��
#include <QtWidgets/QWidget>
#include <QtGui/Qimage>
#include <QDropEvent>
#include <QMimeData>
#include <QTextCodec>
#include <Qpaintdevice>
#include "ui_qt_test2.h"

// OpenCV�̃��C�u������pragma���i������������4����Ƃ��Γ����j
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
	// �f�X�g���N�^
	~Qt_test2();
	// �ǂݍ��񂾐��摜
	cv::Mat image_;
	// ���ݕ\������Ă���摜
	cv::Mat now_;
	// �摜��\������E�B���h�E�̃^�C�g��
	std::string resultWindow;

	// �{�^���N���b�N���ȂǂɌĂԊ֐�
	public slots:
		void on_save_clicked();
		void on_LINEAR_clicked();
		void on_AREA_clicked();
		void on_NEAREST_clicked();
		void on_LANCZOS4_clicked();
		void on_CUBIC_clicked();

private:
	// �쐬����UI�̃N���X
	Ui::Qt_test2Class ui;
	// �h���b�O�h���b�v�ɑΉ�������֐�
	void dragEnterEvent(QDragEnterEvent *e);
	void dropEvent(QDropEvent *e);

	bool resizeRate(double*);
	void drawForQtLabel();
};

#endif // QT_TEST2_H
