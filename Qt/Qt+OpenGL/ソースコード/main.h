// OpenGL
#include <GL/freeglut.h>

// その他
#include <iostream>
#include <math.h>

// イベント時に変化させる変数
// 面倒なのでグローバルに置いて初期化
GLfloat m_dif[4] = {0.0,       0.50980392,0.50980392,1.0};
GLfloat m_amb[4] = {0.0,   0.1,    0.06,    1.0};
GLfloat m_spe[4] = {0.50196078,0.50196078,0.50196078,1.0};
GLfloat m_emi[4] = {0.0, 0.0, 0.0, 1.0};
GLfloat m_shi = 32;

GLfloat eye_x = 1.0;
GLfloat eye_y = 1.0;
GLfloat eye_z = 3.0;


// プロトタイプ宣言
void display();
void init();
void printModelMatrix(GLfloat* m);