#ifndef SIMPLE_H
#define SIMPLE_H

#include <QtWidgets/QWidget>
#include "ui_simple.h"

class simple : public QWidget
{
	Q_OBJECT

public:
	simple(QWidget *parent = 0);
	~simple();
	int now;

	public slots:
		void on_incrementB_clicked();
		void on_decrementB_clicked();
		void on_resetB_clicked();
		void on_horizontalSlider_valueChanged(int);
		void on_lineEdit_editingFinished();
		void on_lineEdit_2_editingFinished();

private:
	Ui::simpleClass ui;
	void textValueAdd();
};

#endif // SIMPLE_H
