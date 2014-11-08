/*
** QtとOpenGLを組み合わせたサンプルです
** スライダーで色を変更, マウスドラッグで回転時の行列を表示ということをしています
** 2014/03/25
** @小針 千春
*/

#include "qt_gl.h"
#include "main.h"

// ウィンドウの定数
#define WindowPositionX (50)  //生成するウィンドウ位置のX座標
#define WindowPositionY (50)  //生成するウィンドウ位置のY座標
#define WindowWidth (500)    //生成するウィンドウの幅
#define WindowHeight (500)    //生成するウィンドウの高さ
#define WindowTitle ("ゆたてぃーぽっと")  //ウィンドウのタイトル
#include "quaternion.h"

extern Ui::Qt_GLClass ui;

void MakeWindow();
void initCallFunc();
void display();

int main(int argc, char *argv[])
{
	glutInit(&argc, argv);	//環境の初期化

	// Qtを使う場合だけ実行される（1行目のincludeを消すとこの中が無視される）
#ifdef QT_GL_H
	// サブスレッドで呼び出しとQtウィンドウの表示
	QApplication a(argc, argv);
	MainLoopThread m;
	m.start();	// サブスレッドでglutMainLoop()を実行
	Qt_GL w;
	w.show();	// Qtのウィンドウ表示

	return a.exec();
#endif

	// Qtを使わない場合だけ実行される
	// Qtを使う場合は↑のreturnで終了してここは無視される
	MakeWindow();
	initCallFunc();
	glutMainLoop();
	return 0;
}

// ウィンドウの設定
void MakeWindow(){
	glutInitDisplayMode(GLUT_RGBA | GLUT_DEPTH | GLUT_DOUBLE); //表示モード
	glutInitWindowPosition(WindowPositionX, WindowPositionY); //ウィンドウの位置の指定
	glutInitWindowSize(WindowWidth, WindowHeight); //ウィンドウサイズの指定
	glutCreateWindow(WindowTitle); //ウィンドウの名前
}

// 最初だけ呼ばれる関数
void initCallFunc()
{
	glutDisplayFunc(display);	//描画時に呼び出される関数を指定する
	glutMouseFunc(mouse_on);	//マウスクリック時に呼び出される関数
	glutMotionFunc(mouse_motion);	//マウスドラッグ解除時に呼び出される関数
	quaternion(); //クォータニオン呼び出し
	

	// カラーバッファの初期化
	glClearColor(1.0, 1.0, 1.0, 0.0);
}

// 毎フレーム呼ばれる関数
void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);	//バッファクリア

	// ここに置くとマウスで光源を動かせる
	//glMultMatrixd(rt);
	
	//透視投影変換
	glMatrixMode(GL_PROJECTION);//行列モードの設定（GL_PROJECTION : 透視変換行列の設定、GL_MODELVIEW：モデルビュー変換行列）
	glLoadIdentity();//行列の初期化
	gluPerspective(30.0, WindowWidth / WindowHeight, 1.0, 100.0);
	// ここ以降に置くとカメラをその場で回転させられる
	//glMultMatrixd(rt);
	
	//光源の設定
	GLfloat l_pos[4] = {1.0f, 1.0f, 1.0f, 1.0f};
	glLightfv(GL_LIGHT0, GL_POSITION, l_pos);

	//モデルビュー変換行列の設定
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();	//行列の初期化
	glViewport(0, 0, WindowWidth, WindowHeight);	//描画サイズ固定化

	//視点の設定
	gluLookAt(
		eye_x, eye_y, eye_z,	// 視点の位置x,y,z;
		0.0, 0.0, 0.0,		// 視界の中心位置の参照点座標x,y,z
		0.0, 1.0, 0.0);		//視界の上方向のベクトルx,y,z

	// ON
	glEnable(GL_LIGHTING);
	glEnable(GL_LIGHT0);
	glEnable(GL_DEPTH_TEST);

	// 行列を取得する配列
	GLfloat m[16];

	// ティーポット描画
	glPushMatrix();
	// PushとPopの中に置くとその中のオブジェクトのみを回転させられる
	glMultMatrixd(rt);
	glGetFloatv(GL_MODELVIEW_MATRIX, m);
	glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT, m_amb);
	glMaterialfv(GL_FRONT_AND_BACK, GL_DIFFUSE, m_dif);
	glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, m_spe);
	glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, m_emi);
	glMaterialfv(GL_FRONT_AND_BACK, GL_SHININESS, &m_shi);
	glutSolidTeapot(0.5);
	glPopMatrix();

	// OFF
	glDisable(GL_LIGHTING);
	glDisable(GL_DEPTH_TEST);

	printModelMatrix(m);

	// バッファ書き出し
	glutSwapBuffers();
}

void printModelMatrix(GLfloat* m)
{
	ui.m11->setText(QString::number(m[0]));
	ui.m21->setText(QString::number(m[1]));
	ui.m31->setText(QString::number(m[2]));
	ui.m41->setText(QString::number(m[3]));
	ui.m12->setText(QString::number(m[4]));
	ui.m22->setText(QString::number(m[5]));
	ui.m32->setText(QString::number(m[6]));
	ui.m42->setText(QString::number(m[7]));
	ui.m13->setText(QString::number(m[8]));
	ui.m23->setText(QString::number(m[9]));
	ui.m33->setText(QString::number(m[10]));
	ui.m43->setText(QString::number(m[11]));
	ui.m14->setText(QString::number(m[12]));
	ui.m24->setText(QString::number(m[13]));
	ui.m34->setText(QString::number(m[14]));
	ui.m44->setText(QString::number(m[15]));
}
