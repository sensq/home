// OpenGL
#include <GL/freeglut.h>

// ���̑�
#include <iostream>
#include <math.h>

// �C�x���g���ɕω�������ϐ�
// �ʓ|�Ȃ̂ŃO���[�o���ɒu���ď�����
GLfloat m_dif[4] = {0.0,       0.50980392,0.50980392,1.0};
GLfloat m_amb[4] = {0.0,   0.1,    0.06,    1.0};
GLfloat m_spe[4] = {0.50196078,0.50196078,0.50196078,1.0};
GLfloat m_emi[4] = {0.0, 0.0, 0.0, 1.0};
GLfloat m_shi = 32;

GLfloat eye_x = 1.0;
GLfloat eye_y = 1.0;
GLfloat eye_z = 3.0;


// �v���g�^�C�v�錾
void display();
void init();
void printModelMatrix(GLfloat* m);