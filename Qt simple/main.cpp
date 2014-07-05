#include "simple.h"
#include <QtWidgets/QApplication>

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	simple w;
	// ウィンドウサイズの最大値
	w.setMaximumWidth(270);
	w.setMaximumHeight(160);
	w.show();
	return a.exec();
}
