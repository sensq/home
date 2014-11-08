#include "poissonimagesynthesis.h"
#include <QtWidgets/QApplication>

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	PoissonImageSynthesis w;
	w.show();
	return a.exec();
}
