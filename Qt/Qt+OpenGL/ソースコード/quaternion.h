/*
** ����y�ɃN�H�[�^�j�I�����������ă}�E�X�h���b�O�ŉ�]�ł���悤�ɂ���w�b�_(?)�t�@�C��
** ��{�I�ɂ́A�ȉ��̃y�[�W�̃R�[�h��ėp�I�Ɏg���񂹂�悤�Ɋ֐����������̂ł��B
** natural science VisualC++ ���g���� OpenGL ����
** http://www.natural-science.or.jp/article/20091124233406.php
**
** 2014/03/17
** @���j ��t
*/

#ifndef MATH_H
#define MATH_H
#include <math.h>
#endif

//freeglut�����Ė����ꍇ�͂������R�����g�A�E�g
//freeglut���ƃz�C�[���̉�]���F���ł���
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

//****�����ȊO�͊�{���������Ȃ�****************//
double Radius=10.0;	//���_����̋����̏����l
double dR=1.0;		//�z�C�[�����񂵂��Ƃ��ɓ�������
//**********************************************//

#ifndef PI
#define PI (4.0 * atan(1.0))  //�~����
#endif

#define SCALE (2.0 * PI)  // �}�E�X�̑��Έʒu����]�p�̊��Z�W��
int cx, cy;                // �h���b�O�J�n�ʒu
double dt = 0.1;
double sx, sy;              // �}�E�X�̐�Έʒu���E�B���h�E���ł̑��Έʒu�̊��Z�W��
double cq[4] = { 1.0, 0.0, 0.0, 0.0 };  // ��]�̏����l (�N�H�[�^�j�I��)
double tq[4];              // �h���b�O���̉�] (�N�H�[�^�j�I��)
double rt[16];              // ��]�̕ϊ��s��

unsigned int listNumber;

//------------------
// �v���g�^�C�v�錾
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
//�Ăяo���֐�
//------------
void quaternion(void){
	glutIdleFunc(Idle);
	Initialize();
}

//-----------------
// �����ݒ�̊֐�
//-----------------
void Initialize(void){
	glClearColor(1.0, 1.0, 1.0, 1.0); //�w�i�F
	glEnable(GL_DEPTH_TEST);//�f�v�X�o�b�t�@���g�p�FglutInitDisplayMode() �� GLUT_DEPTH ���w�肷��

	// �f�B�X�v���C���X�g���쐬
	listNumber = glGenLists(1);
	glNewList( listNumber, GL_COMPILE );

	glEndList();
	//--------------------------------------
	// �}�E�X�|�C���^�ʒu�̃E�B���h�E���̑��ΓI�ʒu�ւ̊��Z�p
	sx = 1.0 / (double)WindowWidth;
	sy = 1.0 / (double)WindowHeight;

	// ��]�s��̏�����
	qrot(rt, cq);
	//--------------------------------------

	//�����ϊ��s��̐ݒ�------------------------------
	glMatrixMode(GL_PROJECTION);//�s�񃂁[�h�̐ݒ�iGL_PROJECTION : �����ϊ��s��̐ݒ�AGL_MODELVIEW�F���f���r���[�ϊ��s��j
	glLoadIdentity();//�s��̏�����
	gluPerspective(30.0, (double)WindowWidth/(double)WindowHeight, 0.1, 1000.0); //�������e�@�̎��̐�gluPerspactive(th, w/h, near, far);
}
//----------------------------------------------------
// �A�C�h�����ɌĂяo�����֐�
//----------------------------------------------------
void Idle(){
	glutPostRedisplay(); //glutDisplayFunc()���P����s����
}

//----------------------------------------------------
// �}�E�X�h���b�O��
//----------------------------------------------------
void mouse_motion(int x, int y){
	double dx, dy, a;

	// �}�E�X�|�C���^�̈ʒu�̃h���b�O�J�n�ʒu����̕ψ�
	dx = (x - cx) * sx;
	dy = (y - cy) * sy;

	// �}�E�X�|�C���^�̈ʒu�̃h���b�O�J�n�ʒu����̋���
	a = sqrt(dx * dx + dy * dy);

	if( a != 0.0 )
	{
		// �}�E�X�̃h���b�O�ɔ�����]�̃N�H�[�^�j�I�� dq �����߂�
		double ar = a * SCALE * 0.5;
		double as = sin(ar) / a;
		double dq[4] = { cos(ar), dy * as, dx * as, 0.0 };

		// ��]�̏����l cq �� dq ���|���ĉ�]������
		qmul(tq, dq, cq);

		// �N�H�[�^�j�I�������]�̕ϊ��s������߂�
		qrot(rt, tq);
	}
}
//----------------------------------------------------
// �}�E�X�N���b�N��
//----------------------------------------------------
void mouse_on(int button, int state, int x, int y)
{
	switch (button) {
	case 0:
		switch (state) {
		case 0:
			// �h���b�O�J�n�_���L�^
			cx = x;
			cy = y;
			break;
		case 1:
			// ��]�̕ۑ�
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
// �}�E�X�h���b�O�ɂ���]
//////////////////////////////////////////////////////////////////////////
// �N�H�[�^�j�I���̐� r <- p x q
static void qmul(double r[], const double p[], const double q[])
{
	r[0] = p[0] * q[0] - p[1] * q[1] - p[2] * q[2] - p[3] * q[3];
	r[1] = p[0] * q[1] + p[1] * q[0] + p[2] * q[3] - p[3] * q[2];
	r[2] = p[0] * q[2] - p[1] * q[3] + p[2] * q[0] + p[3] * q[1];
	r[3] = p[0] * q[3] + p[1] * q[2] - p[2] * q[1] + p[3] * q[0];
}

// ��]�̕ϊ��s�� r <- �N�H�[�^�j�I�� q
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

// �}�E�X�z�C�[���Ŋg��k��
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

// ������ĂԂƍŏ��̌����ɖ߂�
void initQuaternion(void)
{
	/* �P�ʃN�H�[�^�[�j�I�� */
	cq[0] = 1.0;
	cq[1] = 0.0;
	cq[2] = 0.0;
	cq[3] = 0.0;

	/* ��]�s��̏����� */
	qrot(rt, cq);
}