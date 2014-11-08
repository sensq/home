/* Qtのイベントなどを書いたクラス */

#include "qt_gl.h"

extern GLfloat m_dif[4];
extern GLfloat m_amb[4];
extern GLfloat m_spe[4];
extern GLfloat m_emi[4];
extern GLfloat m_shi;

extern GLfloat eye_x;
extern GLfloat eye_y;
extern GLfloat eye_z;

extern GLfloat m[16];

extern void MakeWindow();
extern void initCallFunc();
extern void initQuaternion();

Ui::Qt_GLClass ui;

Qt_GL::Qt_GL(QWidget *parent)
	: QMainWindow(parent)
{
	ui.setupUi(this);

	// 表示値の初期化
	ui.eye_x_Value->setText(QString::number(eye_x));
	ui.eye_y_Value->setText(QString::number(eye_y));
	ui.eye_z_Value->setText(QString::number(eye_z));
	ui.eye_x_Slider->setSliderPosition(eye_x);
	ui.eye_y_Slider->setSliderPosition(eye_y);
	ui.eye_z_Slider->setSliderPosition(eye_z);

	ui.d_r_Value->setText(QString::number(m_dif[0]));
	ui.d_g_Value->setText(QString::number(m_dif[1]));
	ui.d_b_Value->setText(QString::number(m_dif[2]));
	ui.d_r_Slider->setSliderPosition(m_dif[0]*255);
	ui.d_g_Slider->setSliderPosition(m_dif[1]*255);
	ui.d_b_Slider->setSliderPosition(m_dif[2]*255);

	ui.a_r_Value->setText(QString::number(m_amb[0]));
	ui.a_g_Value->setText(QString::number(m_amb[1]));
	ui.a_b_Value->setText(QString::number(m_amb[2]));
	ui.a_r_Slider->setSliderPosition(m_amb[0]*255);
	ui.a_g_Slider->setSliderPosition(m_amb[1]*255);
	ui.a_b_Slider->setSliderPosition(m_amb[2]*255);

	ui.e_r_Value->setText(QString::number(m_emi[0]));
	ui.e_g_Value->setText(QString::number(m_emi[1]));
	ui.e_b_Value->setText(QString::number(m_emi[2]));
	ui.e_r_Slider->setSliderPosition(m_emi[0]*255);
	ui.e_g_Slider->setSliderPosition(m_emi[1]*255);
	ui.e_b_Slider->setSliderPosition(m_emi[2]*255);
}

Qt_GL::~Qt_GL()
{

}

// ボタンを押したら色々と初期化
void Qt_GL::on_pushButton_clicked(){
	GLfloat dif[4] = {0.0,       0.50980392,0.50980392,1.0};
	GLfloat amb[4] = {0.0,   0.1,    0.06,    1.0};
	GLfloat spe[4] = {0.50196078,0.50196078,0.50196078,1.0};
	GLfloat emi[4] = {0.0, 0.0, 0.0, 1.0};
	GLfloat shi = 32;
	for(int i=0; i<4; i++){
		m_dif[i] = dif[i];
		m_amb[i] = amb[i];
		m_spe[i] = spe[i];
		m_emi[i] = emi[i];
	}
	m_shi = shi;
	
	ui.eye_x_Slider->setSliderPosition(1);
	ui.eye_y_Slider->setSliderPosition(1);
	ui.eye_z_Slider->setSliderPosition(3);

	ui.d_r_Slider->setSliderPosition(m_dif[0]*255);
	ui.d_g_Slider->setSliderPosition(m_dif[1]*255);
	ui.d_b_Slider->setSliderPosition(m_dif[2]*255);

	ui.a_r_Slider->setSliderPosition(m_amb[0]*255);
	ui.a_g_Slider->setSliderPosition(m_amb[1]*255);
	ui.a_b_Slider->setSliderPosition(m_amb[2]*255);

	ui.e_r_Slider->setSliderPosition(m_emi[0]*255);
	ui.e_g_Slider->setSliderPosition(m_emi[1]*255);
	ui.e_b_Slider->setSliderPosition(m_emi[2]*255);

	initQuaternion();
}

//-----スライダー変化時に呼ばれる関数-----
void Qt_GL::setSlider(GLfloat* color, int value, QLineEdit* str){
	GLfloat orthoVal = value / 255.0;
	*color = orthoVal;
	str->setText(QString::number(orthoVal));
}
// 視点位置用
void Qt_GL::on_eye_x_Slider_valueChanged(int value){
	eye_x = value;
	ui.eye_x_Value->setText(QString::number(value));
}
void Qt_GL::on_eye_y_Slider_valueChanged(int value){
	eye_y = value;
	ui.eye_y_Value->setText(QString::number(value));
}
void Qt_GL::on_eye_z_Slider_valueChanged(int value){
	eye_z = value;
	ui.eye_z_Value->setText(QString::number(value));
}
// Diffuse用
void Qt_GL::on_d_r_Slider_valueChanged(int value){
	setSlider(&m_dif[0], value, ui.d_r_Value);
}
void Qt_GL::on_d_g_Slider_valueChanged(int value){
	setSlider(&m_dif[1], value, ui.d_g_Value);
}
void Qt_GL::on_d_b_Slider_valueChanged(int value){
	setSlider(&m_dif[2], value, ui.d_b_Value);
}
// Ambient用
void Qt_GL::on_a_r_Slider_valueChanged(int value){
	setSlider(&m_amb[0], value, ui.a_r_Value);
}
void Qt_GL::on_a_g_Slider_valueChanged(int value){
	setSlider(&m_amb[1], value, ui.a_g_Value);
}
void Qt_GL::on_a_b_Slider_valueChanged(int value){
	setSlider(&m_amb[2], value, ui.a_b_Value);
}
// Emission用
void Qt_GL::on_e_r_Slider_valueChanged(int value){
	setSlider(&m_emi[0], value, ui.e_r_Value);
}
void Qt_GL::on_e_g_Slider_valueChanged(int value){
	setSlider(&m_emi[1], value, ui.e_g_Value);
}
void Qt_GL::on_e_b_Slider_valueChanged(int value){
	setSlider(&m_emi[2], value, ui.e_b_Value);
}
//-----ここまでスライダーイベント用関数-----



// glutMainLoop実行するだけのサブスレッドを作るクラス
MainLoopThread::MainLoopThread(QObject* parent) : QThread(parent)
{
}
// デストラクタ
MainLoopThread::~MainLoopThread()
{
}
// この中が実行される
void MainLoopThread::run()
{
	// 普通にmainで呼ぶとGLの処理だけが無限ループしてGUIが使えなくなるので、
	// サブスレッドで呼ばせる
	MakeWindow();
	initCallFunc();
	glutMainLoop();
}
