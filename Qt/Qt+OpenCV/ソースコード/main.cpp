/*
** Qt��OpenCV��g�ݍ��킹���T���v���ł�
** �摜���h���b�O�A���h�h���b�v�œǂݍ���, �{�����w�肵�ă��T�C�Y�ł��܂�
** ��@�ɂ�錋�ʂ̈Ⴂ������܂�
** 2014/03/25
** @���j ��t
*/
#include "qt_test2.h"
#include <QtWidgets/QApplication>

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	Qt_test2 w;

	// �E�B���h�E�^�C�g���ƃT�C�Y�Ə����ʒu
	w.setWindowTitle("test");
	w.setMaximumHeight(290);
	w.move(0, 200);

	w.show();
	return a.exec();
}
