/*
** お手軽にクォータニオンを実装してマウスドラッグで回転できるようにするヘッダ(?)ファイル
** 基本的には、以下のページのコードを汎用的に使い回せるように関数化したものです。
** natural science VisualC++ を使った OpenGL 入門
** http://www.natural-science.or.jp/article/20091124233406.php
**
** 2014/03/17
** @小針 千春
*/

#ifndef MATH_H
#define MATH_H
#include <math.h>
#endif

//freeglutを入れて無い場合はここをコメントアウト
//freeglutだとホイールの回転が認識できる
#ifndef GLUT_H
#define GLUT_H
#define FREEGLUT_H
#include <GL/freeglut.h>
#endif

#ifndef GLUT_H
#define GLUT_H
#include <GL/glut.h>
#endif


using namespace std;

//****ここ以外は基本書き換えない****************//
double Radius=10.0;	//原点からの距離の初期値
double dR=1.0;		//ホイールを回したときに動く距離
//**********************************************//

#ifndef PI
#define PI (4.0 * atan(1.0))  //円周率
#endif

#define SCALE (2.0 * PI)  // マウスの相対位置→回転角の換算係数
int cx, cy;                // ドラッグ開始位置
double dt = 0.1;
double sx, sy;              // マウスの絶対位置→ウィンドウ内での相対位置の換算係数
double cq[4] = { 1.0, 0.0, 0.0, 0.0 };  // 回転の初期値 (クォータニオン)
double tq[4];              // ドラッグ中の回転 (クォータニオン)
double rt[16];              // 回転の変換行列

unsigned int listNumber;

//------------------
// プロトタイプ宣言
//------------------
void Initialize(void);
void Idle(void);
void quaternion(void);

void qmul(double r[], const double p[], const double q[]);
void qrot(double r[], double q[]);

void mouse_motion(int x, int y);
void mouse_on(int button, int state, int x, int y);
void MouseWheel(int wheel_number, int direction, int x, int y);
void initQuaternion(void);

//------------
//呼び出す関数
//------------
void quaternion(void){
	glutIdleFunc(Idle);
	Initialize();
}

//-----------------
// 初期設定の関数
//-----------------
void Initialize(void){
	glClearColor(1.0, 1.0, 1.0, 1.0); //背景色
	glEnable(GL_DEPTH_TEST);//デプスバッファを使用：glutInitDisplayMode() で GLUT_DEPTH を指定する

	// ディスプレイリストを作成
	listNumber = glGenLists(1);
	glNewList( listNumber, GL_COMPILE );

	glEndList();
	//--------------------------------------
	// マウスポインタ位置のウィンドウ内の相対的位置への換算用
	sx = 1.0 / (double)WindowWidth;
	sy = 1.0 / (double)WindowHeight;

	// 回転行列の初期化
	qrot(rt, cq);
	//--------------------------------------

	//透視変換行列の設定------------------------------
	glMatrixMode(GL_PROJECTION);//行列モードの設定（GL_PROJECTION : 透視変換行列の設定、GL_MODELVIEW：モデルビュー変換行列）
	glLoadIdentity();//行列の初期化
	gluPerspective(30.0, (double)WindowWidth/(double)WindowHeight, 0.1, 1000.0); //透視投影法の視体積gluPerspactive(th, w/h, near, far);
}
//----------------------------------------------------
// アイドル時に呼び出される関数
//----------------------------------------------------
void Idle(){
	glutPostRedisplay(); //glutDisplayFunc()を１回実行する
}

//----------------------------------------------------
// マウスドラッグ時
//----------------------------------------------------
void mouse_motion(int x, int y){
	double dx, dy, a;

	// マウスポインタの位置のドラッグ開始位置からの変位
	dx = (x - cx) * sx;
	dy = (y - cy) * sy;

	// マウスポインタの位置のドラッグ開始位置からの距離
	a = sqrt(dx * dx + dy * dy);

	if( a != 0.0 )
	{
		// マウスのドラッグに伴う回転のクォータニオン dq を求める
		double ar = a * SCALE * 0.5;
		double as = sin(ar) / a;
		double dq[4] = { cos(ar), dy * as, dx * as, 0.0 };

		// 回転の初期値 cq に dq を掛けて回転を合成
		qmul(tq, dq, cq);

		// クォータニオンから回転の変換行列を求める
		qrot(rt, tq);
	}
}
//----------------------------------------------------
// マウスクリック時
//----------------------------------------------------
void mouse_on(int button, int state, int x, int y)
{
	switch (button) {
	case 0:
		switch (state) {
		case 0:
			// ドラッグ開始点を記録
			cx = x;
			cy = y;
			break;
		case 1:
			// 回転の保存
			cq[0] = tq[0];
			cq[1] = tq[1];
			cq[2] = tq[2];
			cq[3] = tq[3];
			break;
		default:
			break;
		}
		break;
	default:
		break;
	}
}

//////////////////////////////////////////////////////////////////////////
// マウスドラッグによる回転
//////////////////////////////////////////////////////////////////////////
// クォータニオンの積 r <- p x q
static void qmul(double r[], const double p[], const double q[])
{
	r[0] = p[0] * q[0] - p[1] * q[1] - p[2] * q[2] - p[3] * q[3];
	r[1] = p[0] * q[1] + p[1] * q[0] + p[2] * q[3] - p[3] * q[2];
	r[2] = p[0] * q[2] - p[1] * q[3] + p[2] * q[0] + p[3] * q[1];
	r[3] = p[0] * q[3] + p[1] * q[2] - p[2] * q[1] + p[3] * q[0];
}

// 回転の変換行列 r <- クォータニオン q
static void qrot(double r[], double q[]){
	double x2 = q[1] * q[1] * 2.0;
	double y2 = q[2] * q[2] * 2.0;
	double z2 = q[3] * q[3] * 2.0;
	double xy = q[1] * q[2] * 2.0;
	double yz = q[2] * q[3] * 2.0;
	double zx = q[3] * q[1] * 2.0;
	double xw = q[1] * q[0] * 2.0;
	double yw = q[2] * q[0] * 2.0;
	double zw = q[3] * q[0] * 2.0;

	r[ 0] = 1.0 - y2 - z2;
	r[ 1] = xy + zw;
	r[ 2] = zx - yw;
	r[ 4] = xy - zw;
	r[ 5] = 1.0 - z2 - x2;
	r[ 6] = yz + xw;
	r[ 8] = zx + yw;
	r[ 9] = yz - xw;
	r[10] = 1.0 - x2 - y2;
	r[ 3] = r[ 7] = r[11] = r[12] = r[13] = r[14] = 0.0;
	r[15] = 1.0;
}

// マウスホイールで拡大縮小
void MouseWheel(int wheel_number, int direction, int x, int y)
{
	switch(direction)
	{
	case +1:
		if(Radius<=0){
			break;
		}
		Radius-=dR;
		break;
	case -1:
		Radius+=dR;
		break;
	}
}

// これを呼ぶと最初の向きに戻る
void initQuaternion(void)
{
	/* 単位クォーターニオン */
	cq[0] = 1.0;
	cq[1] = 0.0;
	cq[2] = 0.0;
	cq[3] = 0.0;

	/* 回転行列の初期化 */
	qrot(rt, cq);
}