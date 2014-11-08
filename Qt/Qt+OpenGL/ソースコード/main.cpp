/*
** Qt��OpenGL��g�ݍ��킹���T���v���ł�
** �X���C�_�[�ŐF��ύX, �}�E�X�h���b�O�ŉ�]���̍s���\���Ƃ������Ƃ����Ă��܂�
** 2014/03/25
** @���j ��t
*/

#include "qt_gl.h"
#include "main.h"

// �E�B���h�E�̒萔
#define WindowPositionX (50)  //��������E�B���h�E�ʒu��X���W
#define WindowPositionY (50)  //��������E�B���h�E�ʒu��Y���W
#define WindowWidth (500)    //��������E�B���h�E�̕�
#define WindowHeight (500)    //��������E�B���h�E�̍���
#define WindowTitle ("�䂽�Ă��[�ۂ���")  //�E�B���h�E�̃^�C�g��
#include "quaternion.h"

extern Ui::Qt_GLClass ui;

void MakeWindow();
void initCallFunc();
void display();

int main(int argc, char *argv[])
{
	glutInit(&argc, argv);	//���̏�����

	// Qt���g���ꍇ�������s�����i1�s�ڂ�include�������Ƃ��̒������������j
#ifdef QT_GL_H
	// �T�u�X���b�h�ŌĂяo����Qt�E�B���h�E�̕\��
	QApplication a(argc, argv);
	MainLoopThread m;
	m.start();	// �T�u�X���b�h��glutMainLoop()�����s
	Qt_GL w;
	w.show();	// Qt�̃E�B���h�E�\��

	return a.exec();
#endif

	// Qt���g��Ȃ��ꍇ�������s�����
	// Qt���g���ꍇ�́���return�ŏI�����Ă����͖��������
	MakeWindow();
	initCallFunc();
	glutMainLoop();
	return 0;
}

// �E�B���h�E�̐ݒ�
void MakeWindow(){
	glutInitDisplayMode(GLUT_RGBA | GLUT_DEPTH | GLUT_DOUBLE); //�\�����[�h
	glutInitWindowPosition(WindowPositionX, WindowPositionY); //�E�B���h�E�̈ʒu�̎w��
	glutInitWindowSize(WindowWidth, WindowHeight); //�E�B���h�E�T�C�Y�̎w��
	glutCreateWindow(WindowTitle); //�E�B���h�E�̖��O
}

// �ŏ������Ă΂��֐�
void initCallFunc()
{
	glutDisplayFunc(display);	//�`�掞�ɌĂяo�����֐����w�肷��
	glutMouseFunc(mouse_on);	//�}�E�X�N���b�N���ɌĂяo�����֐�
	glutMotionFunc(mouse_motion);	//�}�E�X�h���b�O�������ɌĂяo�����֐�
	quaternion(); //�N�H�[�^�j�I���Ăяo��
	

	// �J���[�o�b�t�@�̏�����
	glClearColor(1.0, 1.0, 1.0, 0.0);
}

// ���t���[���Ă΂��֐�
void display()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);	//�o�b�t�@�N���A

	// �����ɒu���ƃ}�E�X�Ō����𓮂�����
	//glMultMatrixd(rt);
	
	//�������e�ϊ�
	glMatrixMode(GL_PROJECTION);//�s�񃂁[�h�̐ݒ�iGL_PROJECTION : �����ϊ��s��̐ݒ�AGL_MODELVIEW�F���f���r���[�ϊ��s��j
	glLoadIdentity();//�s��̏�����
	gluPerspective(30.0, WindowWidth / WindowHeight, 1.0, 100.0);
	// �����ȍ~�ɒu���ƃJ���������̏�ŉ�]��������
	//glMultMatrixd(rt);
	
	//�����̐ݒ�
	GLfloat l_pos[4] = {1.0f, 1.0f, 1.0f, 1.0f};
	glLightfv(GL_LIGHT0, GL_POSITION, l_pos);

	//���f���r���[�ϊ��s��̐ݒ�
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();	//�s��̏�����
	glViewport(0, 0, WindowWidth, WindowHeight);	//�`��T�C�Y�Œ艻

	//���_�̐ݒ�
	gluLookAt(
		eye_x, eye_y, eye_z,	// ���_�̈ʒux,y,z;
		0.0, 0.0, 0.0,		// ���E�̒��S�ʒu�̎Q�Ɠ_���Wx,y,z
		0.0, 1.0, 0.0);		//���E�̏�����̃x�N�g��x,y,z

	// ON
	glEnable(GL_LIGHTING);
	glEnable(GL_LIGHT0);
	glEnable(GL_DEPTH_TEST);

	// �s����擾����z��
	GLfloat m[16];

	// �e�B�[�|�b�g�`��
	glPushMatrix();
	// Push��Pop�̒��ɒu���Ƃ��̒��̃I�u�W�F�N�g�݂̂���]��������
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

	// �o�b�t�@�����o��
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
