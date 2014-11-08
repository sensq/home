#ifndef QT_GL_H
#define QT_GL_H

// Qt関連
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QSlider>
#include <QThread>
#include <Qtimer>
#include "ui_qt_gl.h"

// OpenGL
#include <GL/freeglut.h>

// その他
#include <iostream>
#include <math.h>

extern void quaternion();


class Qt_GL : public QMainWindow
{
	Q_OBJECT

public:
	Qt_GL(QWidget *parent = 0);
	~Qt_GL();

	public slots:
		void on_pushButton_clicked();
		void on_eye_x_Slider_valueChanged(int);
		void on_eye_y_Slider_valueChanged(int);
		void on_eye_z_Slider_valueChanged(int);
		void on_d_r_Slider_valueChanged(int);
		void on_d_g_Slider_valueChanged(int);
		void on_d_b_Slider_valueChanged(int);
		void on_a_r_Slider_valueChanged(int);
		void on_a_g_Slider_valueChanged(int);
		void on_a_b_Slider_valueChanged(int);
		void on_e_r_Slider_valueChanged(int);
		void on_e_g_Slider_valueChanged(int);
		void on_e_b_Slider_valueChanged(int);

private:
	void setSlider(GLfloat*, int, QLineEdit*);
};


// glutMainLoopを実行するクラス
class MainLoopThread : public QThread
{
	Q_OBJECT

public:
	MainLoopThread(QObject* parent=0);
	~MainLoopThread();

protected:
	void run();
};


#endif // QT_GL_H
