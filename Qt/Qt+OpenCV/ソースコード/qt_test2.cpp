#include "qt_test2.h"

// main�֐���show���s���Ɏ��s�����֐�
Qt_test2::Qt_test2(QWidget *parent)
	: QWidget(parent)
{
	// �����ݒ�Ƃ�����Ă���
	Qt_test2::resultWindow = "Result";
	ui.setupUi(this);
	setAcceptDrops(true);

	// �G���[�h�~�̂��߂̏�����
	image_ = cv::Mat::zeros(100, 100, CV_8UC3);
	now_ = cv::Mat::zeros(100, 100, CV_8UC3);
}

Qt_test2::~Qt_test2()
{
	// ��������Ȃ����ۂ��H
}

// �e�L�X�g�{�b�N�X����l���擾����
bool Qt_test2::resizeRate(double* rate){
	QString str;
	str = ui.lineEdit->text();
	rate[0] = str.toDouble();
	str = ui.lineEdit_2->text();
	rate[1] = str.toDouble();
	// 0�ȉ��̓��͂�1�ɂ���
	if(rate[0] <= 0 | rate[1] <= 0)
		rate[0] = rate[1] = 1.0;
	return true;
}

// ���ݕ\�����Ă���摜��ۑ�
void Qt_test2::on_save_clicked()
{
	cv::imwrite("result.png", now_);
}

// ���`��ԂŃ��T�C�Y���s���֐�
void Qt_test2::on_LINEAR_clicked()
{
	double rate[2];
	// �{�����擾
	resizeRate(rate);
	cv::Mat dst;
	// ���T�C�Y�isrc, dst, size, x�{��, y�{��, �g����@�j
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_LINEAR);
	// now_�ɃR�s�[
	now_ = dst.clone();
	// �\��
	cv::imshow(resultWindow, dst);
}
// �ȉ��͎�@���قȂ邾��
void Qt_test2::on_AREA_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_AREA);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}
void Qt_test2::on_NEAREST_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_NEAREST);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}
void Qt_test2::on_LANCZOS4_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_LANCZOS4);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}
void Qt_test2::on_CUBIC_clicked()
{
	double rate[2];
	resizeRate(rate);
	cv::Mat dst;
	cv::resize(image_, dst, cv::Size(), rate[0], rate[1], cv::INTER_CUBIC);
	now_ = dst.clone();
	cv::imshow(resultWindow, dst);
}

// �h���b�O���h���b�v���󂯕t����
// ���ꂪ�Ȃ��Ǝ�t���Ȃ��B
void Qt_test2::dragEnterEvent(QDragEnterEvent *e)
{
    if(e->mimeData()->hasFormat("text/uri-list"))
    {
        e->acceptProposedAction();
    }
}

// dragEnterEvent�̌�ɂ���C�x���g
// �h���b�v�̍ۂ̓�����L�q����
// e�ɐF�X��񂪓����Ă���
void Qt_test2::dropEvent(QDropEvent *e)
{
	// toLocal8Bit�œn���ƃp�X�ɓ��{��܂�ł�t�@�C�����ǂݍ��߂���ۂ�
	std::string url = e->mimeData()->urls().first().toLocalFile().toLocal8Bit();
	// ���x���Ȃǂɕ\������ꍇ��QString�^�̂܂ܓn���Ȃ��ƕ�����������
	ui.filename->setText(e->mimeData()->urls().first().toLocalFile());
	// �ǂݍ��񂾃t�@�C�����̉摜��ϐ��ɓ����
	Qt_test2::image_ = cv::imread(url, 1);
	// �𑜓x�����x���ɕ\��
	ui.resolutionX->setText(QString::number(Qt_test2::image_.cols));
	ui.resolutionY->setText(QString::number(Qt_test2::image_.rows));
	// �摜��\��
	cv::imshow(resultWindow, Qt_test2::image_);
	drawForQtLabel();
}

// Qt�̉�ʂɉ摜��\������
void Qt_test2::drawForQtLabel()
{
	// 4ch�摜�ɕϊ���R��B����ւ�
	cv::Mat dst;
	cv::cvtColor(Qt_test2::image_, dst, CV_RGB2BGRA);
	cv::Mat dst_rgba = dst.clone();
	int fromTo[] = { 0,2,  1,1,  2,0,  3,3 };
	cv::mixChannels(&dst, 1, &dst_rgba, 1, fromTo, 3);
	// �k������T�C�Y�����߂�i131�̓��x���̃T�C�Y�j
	double size[2];
	double r;
	int labelWidth = ui.label->geometry().width();
	int labelHeight = ui.label->geometry().height();
	size[0] = labelWidth/(double)dst_rgba.cols;
	size[1] = labelHeight/(double)dst_rgba.rows;
	// �����������g���ăA�X��ێ����ďk������
	if(size[0] < size[1])
		r = size[0];
	else
		r = size[1];
	// ���T�C�Y
	cv::resize(dst_rgba, dst_rgba, cv::Size(), r, r, cv::INTER_AREA);
	// Qt�̉摜�p�̌^�ɓn��
    QImage image(dst_rgba.data, 
                 dst_rgba.cols, dst_rgba.rows, 
                 QImage::Format_ARGB32);
	// ���x���̐F���摜�̃s�N�Z���̐F�ɓh��ւ���
	ui.label->setPixmap(QPixmap::fromImage(image));
}
