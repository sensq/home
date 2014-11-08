#include "poissonimagesynthesis.h"

PoissonImageSynthesis::PoissonImageSynthesis(QWidget *parent)
	: QWidget(parent)
{
	ui.setupUi(this);
	base = cv::imread("test1_base.png");
	blend = cv::imread("test1_blend.png");
	mask = cv::imread("test1_mask.png", 0);
	ui.spinBox->setValue(1);

	rev = false;

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);

	poisson();
}

PoissonImageSynthesis::~PoissonImageSynthesis()
{
}

/// �x�[�X�摜�ƃu�����h�摜�����ւ�
void PoissonImageSynthesis::on_checkBox_clicked()
{
	cv::Mat tmp = base.clone();
	base = blend.clone();
	blend = tmp.clone();
	rev = !rev;

	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);
	poisson();
}

/// �摜�Z�b�g1�`5�ǂݍ���
void PoissonImageSynthesis::on_setButton_1_clicked()
{
	base = cv::imread("test1_base.png");
	blend = cv::imread("test1_blend.png");
	mask = cv::imread("test1_mask.png", 0);
	
	commonButtonFunction();
}
void PoissonImageSynthesis::on_setButton_2_clicked()
{
	base = cv::imread("test2_base.png");
	blend = cv::imread("test2_blend.png");
	mask = cv::imread("test2_mask.png", 0);
	
	commonButtonFunction();
}
void PoissonImageSynthesis::on_setButton_3_clicked()
{
	base = cv::imread("test3_base.png");
	blend = cv::imread("test3_blend.png");
	mask = cv::imread("test3_mask.png", 0);
	
	commonButtonFunction();
}
void PoissonImageSynthesis::on_setButton_4_clicked()
{
	base = cv::imread("test4_base.png");
	blend = cv::imread("test4_blend.png");
	mask = cv::imread("test4_mask.png", 0);
	
	commonButtonFunction();
}
void PoissonImageSynthesis::on_setButton_5_clicked()
{
	base = cv::imread("test5_base.png");
	blend = cv::imread("test5_blend.png");
	mask = cv::imread("test5_mask.png", 0);

	commonButtonFunction();
}

/// �摜�Z�b�g�ǂݍ��ނƂ��ɋ��ʂ��čs������
void PoissonImageSynthesis::commonButtonFunction()
{
	// ���]�Ƀ`�F�b�N�����Ă���x�[�X�ƃu�����h�摜�����ւ�
	if(rev){
		cv::Mat tmp = base.clone();
		base = blend.clone();
		blend = tmp.clone();
	}
	// �x�[�X�ƃu�����h�摜�����x���ɕ`��
	drawForQtLabel(base, ui.labelBase, true);
	drawForQtLabel(blend, ui.labelBlend, true);
	poisson();
}

/*
@brief �|�A�\���������������֐�
@param lMax 1��̌Ăяo���ōs���v�Z��
@param base, blend, mask �x�[�X�摜�A�u�����h�摜�A�}�X�N�摜
@param mix true��Mixing�Afalse��Import
@param offset �E�Ɖ������ւ̂���
@param init false���ƑO��̍�������(dst)����͂Ƃ��Ďg��
*/
void PoissonImageSynthesis::poissonSolver(int lMax, cv::Mat &base, cv::Mat &blend, cv::Mat &dst, cv::Mat &mask, bool mix, cv::Point2i offset, bool init)
{
	// �������Ԍv���p
	double f = 1000.0/cv::getTickFrequency();
	int64 time = cv::getTickCount();

	// ���e�덷
	static const double EPS = 0.00001;
	// �אډ�f���i�㉺���E�����Ƃ���̂�4�ŌŒ�j
	static const int NUM_NEIGHBOR = 4;

	float error, sum_f, sum_vpq, sum_vpq1, sum_vpq2, fp;

	// �}�X�N�w�肵�Ȃ��ꍇ�͑S��f������
	if(mask.data == NULL)
		mask = cv::Mat(blend.rows, blend.cols, CV_8UC1, cv::Scalar::all(255));
	// �G���[����
	if(blend.channels() == 4)
		cv::cvtColor(blend, blend, cv::COLOR_BGRA2BGR);
	if(base.channels() == 4)
		cv::cvtColor(base, base, cv::COLOR_BGRA2BGR);
	if(mask.channels() == 3)
		cv::cvtColor(mask, mask, cv::COLOR_BGR2GRAY);
	else if(mask.channels() == 4)
		cv::cvtColor(mask, mask, cv::COLOR_BGRA2GRAY);

	// ���ډ�f�̏㉺���E�̉�f
	static const int naddr[NUM_NEIGHBOR][2] = {{-1,0}, {0,-1}, {0,1}, {1,0}};
	// �v�Z�p�s��
	cv::Mat next = cv::Mat_<double>(blend.rows, blend.cols);

	// �o�͉摜�̏�����
	if(init)
		dst = base.clone();

	/* SOR�@�̃p�����[�^
	2�ȏ�ɂ���Ǝ������Ȃ��Ȃ�
	1�������ƒx���Ȃ邯�ǃK�E�X�U�C�f���Ŏ������Ȃ��ꍇ�ɂ�������������
	��������ƕ������Ă���ꍇ��1.9���悭�g����i�H�j */
	double omega = ui.SORSpinBox->value();	// GUI������l���擾

	// �`�����l�����Ƃɏ���
	for (int c = 0; c < blend.channels(); c++){
		// double�^��Mat�ɓ���ւ��i0�`255�ȊO�̒l���g�����߁j
		for(int y=0; y<blend.rows; y++)
			for(int x=0; x<blend.cols; x++)
				next.at<double>(y, x) = (double)dst.data[y*dst.step + x*dst.elemSize() + c];

		// �K�E�X�E�U�C�f���@�Ń|�A�\��������������
		for(int loop=0; loop<lMax; loop++){
			// ��������p�̕ϐ�
			bool ok = true;
			for(int y=0; y <mask.rows; y++){
				for(int x=0; x <mask.cols; x++){
					// �}�X�N�̗̈�̂ݏ���
					if((int)mask.data[y*mask.step + x*mask.elemSize()] > 0){
						// ������
						sum_f = 0.0;
						sum_vpq = 0.0;
						sum_vpq1 = 0.0;
						sum_vpq2 = 0.0;
						for(int neighbor=0; neighbor<NUM_NEIGHBOR; neighbor++){
							// ���ډ�f�����͉摜���͂ݏo���Ă��Ȃ����̔���
							if(y+offset.x+naddr[neighbor][0] >= 0
								&& x+offset.y+naddr[neighbor][1] >= 0
								&& y+offset.x+naddr[neighbor][0] < blend.rows
								&& x+offset.y+naddr[neighbor][1] < blend.cols)
							{
								// �אډ�f�̍��v�l
								sum_f += next.at<double>(y+offset.x+naddr[neighbor][0], x+offset.y+naddr[neighbor][1]);
								// ���ډ�f�Ɨאډ�f�̌��z��f
								sum_vpq1 = base.data[y*base.step + x*base.elemSize() + c] - base.data[(y+naddr[neighbor][0])*base.step + (x+naddr[neighbor][1])*base.elemSize() + c];
								sum_vpq2 = blend.data[y*blend.step + x*blend.elemSize() + c] - blend.data[(y+naddr[neighbor][0])*blend.step + (x+naddr[neighbor][1])*blend.elemSize() + c];

								// �㉺���E4�������Z
								// Mixing�i��Βl���傫���������Z�j
								if(mix){
									if(abs(sum_vpq1) > abs(sum_vpq2))
										sum_vpq += sum_vpq1;
									else
										sum_vpq += sum_vpq2;
								}
								// Importing�i�K��base�̌��z�����Z�j
								else{
									sum_vpq += sum_vpq2;
								}
							}
						}
						// �אډ�f�l�ƌ��z4���̍��v / �אډ�f��
						fp = (sum_f + sum_vpq)/NUM_NEIGHBOR;
						/// SOR�@( omega=1 �̂Ƃ��̓K�E�X�U�C�f���Ɠ����Ȃ̂Ŗ����j
						if(omega != 1.0){
							fp = next.at<double>(y+offset.x, x+offset.y) + omega * (fp-next.at<double>(y+offset.x, x+offset.y));
						}

						// �����fp�ƑO���fp�����e�덷�Ɏ��܂�܂ŌJ��Ԃ�
						error = fabs(fp - next.at<double>(y+offset.x,x+offset.y));
						// ���ډ�f�̎�������
						if(ok && error>EPS*(1+fabs(fp)) ){
							ok = false;
						}
						// �l���X�V
						next.at<double>(y+offset.x, x+offset.y) = fp;
					}
				}
			}
			// ��������i�S��f����������𖞂�������I���j
			if(ok){
				break;
			}

			// saturate�i0�ȉ���0, 255�ȏ��255�ɂ���j
			for(int y=0; y<dst.rows; y++)
				for(int x=0; x<dst.cols; x++)
					dst.data[y*dst.step + x*dst.elemSize() + c] = cv::saturate_cast<uchar>(next.at<double>(y, x));
		}
	}

	// ��������
	std::cout<<(cv::getTickCount()-time)*f<<" [ms]"<<std::endl;
}

/// �摜�ǂݍ��񂾂Ƃ��ŏ��Ɏ��s����֐�
void PoissonImageSynthesis::poisson()
{
	cv::Point2i offset(0, 0);

	lMax = ui.spinBox->value();

	poissonSolver(lMax, base, blend, dst[0], mask, true, offset, true);
	drawForQtLabel(dst[0], ui.labelMix, true);
	cv::imwrite("����-Mix.png", dst[0]);

	poissonSolver(lMax, base, blend, dst[1], mask, false, offset, true);
	drawForQtLabel(dst[1], ui.labelImp, true);
	cv::imwrite("����-Import.png", dst[1]);
}

/// ���Z�b�g�{�^��
void PoissonImageSynthesis::on_resetButton_clicked()
{
	// ���[�v1�񂾂���
	poissonSolver(1, base, blend, dst[0], mask, true);
	drawForQtLabel(dst[0], ui.labelMix, true);
	// ���[�v1�񂾂���
	poissonSolver(1, base, blend, dst[1], mask, false);
	drawForQtLabel(dst[1], ui.labelImp, true);
}

/// �X�V�{�^��
void PoissonImageSynthesis::on_iterateButton_clicked()
{
	cv::Point2i offset(0, 0);

	lMax = ui.spinBox->value();

	poissonSolver(lMax, base, blend, dst[0], mask, true, offset, false);
	drawForQtLabel(dst[0], ui.labelMix, true);
	cv::imwrite("����-Mix.png", dst[0]);

	poissonSolver(lMax, base, blend, dst[1], mask, false, offset, false);
	drawForQtLabel(dst[1], ui.labelImp, true);
	cv::imwrite("����-Import.png", dst[1]);
}

/// �摜�����x���ɕ`��
void PoissonImageSynthesis::drawForQtLabel(cv::Mat &src, QLabel *label, bool autoResize)
{
	// �G���[����
	if(src.data == NULL)
		return;

	// 3ch�摜��4ch�摜�ɕϊ�
	cv::Mat dst = src.clone();
	if(src.channels() == 3)
		cv::cvtColor(dst, dst, CV_BGR2BGRA);

	// �k������T�C�Y�����߂�
	double size[2];
	double r;
	// ���x���̃T�C�Y���擾
	if(autoResize){
		int labelWidth = label->geometry().width();
		int labelHeight = label->geometry().height();
		size[0] = labelWidth/(double)dst.cols;
		size[1] = labelHeight/(double)dst.rows;
		// �k�����������������g���ăA�X��ێ����ďk������
		r = (size[0] < size[1]) ? size[0] : size[1];
		// ���T�C�Y
		cv::resize(dst, dst, cv::Size(), r, r, cv::INTER_AREA);
	}

	// Qt�̉摜�p�̌^�ɓn��
	QImage image;
	switch(dst.channels()){
	case 1:
		// �����摜
		image = QImage(dst.data, dst.cols, dst.rows, QImage::Format_Indexed8);
		break;
	case 4:
		// �J���[�摜
		image = QImage(dst.data, dst.cols, dst.rows, QImage::Format_ARGB32);
		break;
	default:
		// ���Ԃ񂱂��͌Ă΂�Ȃ��͂�
		std::cout << "ERROR" << std::endl;
		return;
	}

	// ���x���̐F���摜�̃s�N�Z���̐F�ɓh��ւ���
	label->setPixmap(QPixmap::fromImage(image));
}