#include "simple.h"

// コンストラクタ
simple::simple(QWidget *parent)
	: QWidget(parent)
{
	ui.setupUi(this);
	// 初期化
	now = 0;
	ui.counter->setText(QString::number(now));
	ui.lineEdit->setText(QString::number(2));
	ui.lineEdit_2->setText(QString::number(3));
	ui.lineEdit_3->setText(QString::number(5));
	int a = 0;
}
// デストラクタ
simple::~simple()
{

}

// 各ボタンイベント
void simple::on_incrementB_clicked(){
	now++;
	ui.counter->setText(QString::number(now));
}
void simple::on_decrementB_clicked(){
	now--;
	ui.counter->setText(QString::number(now));
}
void simple::on_resetB_clicked(){
	now = 0;
	ui.counter->setText(QString::number(now));
}

// スライダーイベント
void simple::on_horizontalSlider_valueChanged(int value){
	ui.sliderV->setText(QString::number(value));
}

// テキストボックス
void simple::on_lineEdit_editingFinished(){
	textValueAdd();
}
void simple::on_lineEdit_2_editingFinished(){
	textValueAdd();
}
void simple::textValueAdd(){
	int left = ui.lineEdit->text().toInt();
	int right = ui.lineEdit_2->text().toInt();
	int total = left + right;
	ui.lineEdit_3->setText(QString::number(total));
}
