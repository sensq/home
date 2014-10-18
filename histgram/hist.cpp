#include "hist.h"

// ���{��𕶎��������Ȃ��悤�ɂ���
QTextCodec* tc = QTextCodec::codecForLocale();
// �t�B���^�̐ݒ�i�������Ƒ啶���͋�ʂ���Ȃ��j
QStringList strlFilter;

HIST::HIST(QWidget *parent)
	: QWidget(parent)
{
	ui.setupUi(this);
	setAcceptDrops(true);
	strlFilter << "*.png" << "*.bmp" << "*.jpg" << "*.jpeg" << "*.tif" << "*.tiff";

	
	cv::Mat defaultImage = cv::imread("fruits.jpg", 1);
	calcHistgram(defaultImage);
	calcHistgramHue(defaultImage);
	drawForQtLabel(defaultImage, ui.label);
}

HIST::~HIST()
{

}

/**
@brief �h���b�O���h���b�v���󂯕t����<br>
���ꂪ�Ȃ��Ǝ�t���Ȃ�
*/
void HIST::dragEnterEvent(QDragEnterEvent *e)
{
	if(e->mimeData()->hasFormat("text/uri-list"))
		e->acceptProposedAction();
}

/**
@brief dragEnterEvent�̒���ɌĂ΂��C�x���g
*/
void HIST::dropEvent(QDropEvent *e)
{
	// toLocal8Bit�œn���ƃp�X�ɓ��{��܂�ł�t�@�C�����ǂݍ��߂�
	std::string url = e->mimeData()->urls().first().toLocalFile().toLocal8Bit();
	QFileInfo fileInfo =  QFileInfo(e->mimeData()->urls().first().toLocalFile());

	// �f�B���N�g������ꂽ�炻�̃f�B���N�g���̒����J�����g�f�B���N�g���Ƃ��Ďg��
	std::string currentDir;
	if(fileInfo.isDir()){
		currentDir = url;
		currentDir.append("/");
	}
	// �t�@�C������ꂽ�炻�̃t�@�C���̂���ꏊ���J�����g�f�B���N�g���Ƃ��Ďg��
	else{
		currentDir = url.substr(0, url.rfind('/')+1);
	}

	// ���X�g���쐬
	QFileInfoList list;
	if (e->mimeData()->hasUrls()){
		for (int i = 0; i < e->mimeData()->urls().size(); i++){
			QFileInfo info = e->mimeData()->urls()[i].toLocalFile();
			list.push_back(info);
		}
	}

	// ���͑O�̌��i���݂̍s���j
	int prev = item.size();
	// ���̓t�@�C�������ׂ�item��push
	for ( int i = 0; i < list.size(); i++ ){
		item.push_back( new QTableWidgetItem(list[i].absoluteFilePath()) );
	}
	// �s�������ɍ��킹��
	ui.tableWidget->setRowCount(item.size());
	// �e�[�u����set
	for ( int i = 0; i < list.size(); i++ ){
		ui.tableWidget->setItem(prev+i, 0, item.at(prev+i) );
	}
	ui.tableWidget->resizeColumnsToContents();

	std::string nowItem = url;
	cv::Mat nowImg = cv::imread(nowItem, 1);

	calcHistgram(nowImg);
	calcHistgramHue(nowImg);
	drawForQtLabel(nowImg, ui.label);
}

/**
@param currentRow, currentColumn �I��������, �s
@param previousRow, previousColumn �O�ɑI�����Ă�����, �s
*/
void HIST::on_tableWidget_currentCellChanged(int currentRow, int currentColumn, int previousRow, int previousColumn)
{
	// ����̃Z���ɉ������������牽���s��Ȃ�
	if(ui.tableWidget->item(0, 0)->text() != ""){
		// ���������ɂ��ǂݍ��݃G���[��h�����߁A��UQByteArray�ɕϊ�
		QByteArray byteArray = ui.tableWidget->item(currentRow, 0)->text().toLocal8Bit();
		// �N���b�N�����摜�̃t���p�X���擾
		std::string nowItem = byteArray;
		cv::Mat nowImg = cv::imread(nowItem, 1);
		calcHistgram(nowImg);
		calcHistgramHue(nowImg);
		drawForQtLabel(nowImg, ui.label);
	}
}

/**
@brief Mat�^��QImage�^�ɕϊ����A���x���ɉ摜��\������
@param src �`�悷��摜
@param label �摜��`�悷�郉�x��
@param autoResize ���x���ɍ��킹�ĉ摜�����T�C�Y���邩�ǂ���
*/
void HIST::drawForQtLabel(cv::Mat &src, QLabel *label, bool autoResize)
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

/**
@brief RGB�̃q�X�g�O�������v�Z����
@param src �q�X�g�O�������v�Z����摜
*/
void HIST::calcHistgram(cv::Mat &src)
{
	if(src.data == NULL)
		return;
	
	// �O���t�̃f�[�^�Ԃ̋���
	step = (double)ui.histgramRGB->width()/256;

	int count[256][3];
	int max = 0;

	// ������
	for (int i = 0; i < 256; i++)
		for (int c = 0; c < 3; c++)
			count[i][c] = 0;

	// RGB���ƂɋP�x�̌����擾
	for (int j = 0; j < src.cols; j++)
		for (int i = 0; i < src.rows; i++)
			for (int c = 0; c < 3; c++)
				count[src.data[i * src.step + j * src.elemSize() + c]][c]++;

	// 0��255�͂��������ɒ[�ɑ����Ȃ�̂Ŗ�������
	for (int c = 0; c < 3; c++)
		count[0][c] = count[255][c] = 0;

	// �X�P�[�����O�萔�i��ԑ����P�x�̌��j�̎擾
	for (int i = 0; i < 256; i++)
		for (int c = 0; c < 3; c++)
			if(max < count[i][c])
				max = count[i][c];

	// �X�P�[�����O
	double histgram[256][3];
	for (int i = 0; i < 256; i++)
		for (int c = 0; c < 3; c++)
			histgram[i][c] = (double)count[i][c] / max * 200;


	/** �ȈՃO���t�쐬 **/
	int gWidth = 256 * step;
	int gHeight = 200;
	// �i�q�摜
	cv::Mat baseGraph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));
	// RGB���Ƃ̃q�X�g�O�����摜
	cv::Mat rgbGraph[3] = {
		cv::Mat(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255)),
		cv::Mat(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255)),
		cv::Mat(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255))
	};
	// ��L4����Z�u�����f�B���O�����ŏI�I�ɕ`�悷��摜
	cv::Mat graph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));

	// ���̃�����
	for (int i = 0; i < 20; i++)
		if(!(i%4))
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(180, 180, 180), 2);
		else
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(200, 200, 200), 1);
	// �c�̃�����
	for (int i = 0; i < 5; i++)
		cv::line(baseGraph, cv::Point(i*50*step, 0), cv::Point(i*50*step, gHeight), cv::Scalar(180, 180, 180), 2);
	// RGB���Ƃ̃O���t
	for (int i = 0; i < 256; i++){
		cv::line(rgbGraph[0], cv::Point(i*step, 0), cv::Point(i*step, (int)histgram[i][0]), cv::Scalar(255, 200, 200), 2);
		cv::line(rgbGraph[1], cv::Point(i*step, 0), cv::Point(i*step, (int)histgram[i][1]), cv::Scalar(200, 255, 200), 2);
		cv::line(rgbGraph[2], cv::Point(i*step, 0), cv::Point(i*step, (int)histgram[i][2]), cv::Scalar(200, 200, 255), 2);
	}
	// �܂��
	for (int i = 0; i < 255; i++){
		cv::line(rgbGraph[0], cv::Point(i*step, (int)histgram[i][0]), cv::Point((i+1)*step, (int)histgram[i+1][0]), cv::Scalar(255, 30, 30), 2, CV_AA);
		cv::line(rgbGraph[1], cv::Point(i*step, (int)histgram[i][1]), cv::Point((i+1)*step, (int)histgram[i+1][1]), cv::Scalar(30, 255, 30), 2, CV_AA);
		cv::line(rgbGraph[2], cv::Point(i*step, (int)histgram[i][2]), cv::Point((i+1)*step, (int)histgram[i+1][2]), cv::Scalar(30, 30, 255), 2, CV_AA);
	}
	// ����
	cv::Mat tmp;
	blend(rgbGraph[0], rgbGraph[1], tmp, blendType::MULTI);
	blend(tmp, rgbGraph[2], tmp, blendType::MULTI);
	blend(baseGraph, tmp, graph, blendType::MULTI);
	// �㉺�𔽓]
	cv::flip(graph, graph, 0);

	drawForQtLabel(graph, ui.histgramRGB, false);
}

/**
@brief �F�������̃q�X�g�O�������v�Z����
@param src �q�X�g�O�������v�Z����摜
*/
void HIST::calcHistgramHue(cv::Mat &src)
{
	if(src.data == NULL)
		return;
	
	// �O���t�̃f�[�^�Ԃ̋���
	stepH = (double)ui.histgramH->width()/180;

	cv::cvtColor(src, src, cv::COLOR_BGR2HSV);
	int count[180];
	int max = 0;

	// ������
	for (int i = 0; i < 180; i++)
		count[i] = 0;

	// �F���̊e�l�̌����擾
	for (int j = 0; j < src.cols; j++)
		for (int i = 0; i < src.rows; i++)
			// �قڔ��i�ʓx��0�j�͖���
				if(src.data[i * src.step + j * src.elemSize() + 1] > 3)
					count[src.data[i * src.step + j * src.elemSize()]]++;
	cv::cvtColor(src, src, cv::COLOR_HSV2BGR);

	// �X�P�[�����O�萔�i��ԑ������j�̎擾
	for (int i = 0; i < 180; i++)
		if(max < count[i])
			max = count[i];

	// �X�P�[�����O
	double histgram[180];
	for (int i = 0; i < 180; i++)
		histgram[i] = (double)count[i] / max * 200;


	/** �ȈՃO���t�쐬 **/
	int gWidth = 180 * stepH;
	int gHeight = 200;
	// �i�q�摜
	cv::Mat baseGraph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));
	// �F���̃q�X�g�O�����摜
	cv::Mat hueGraph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));
	// ��L2����Z�u�����f�B���O�����ŏI�I�ɕ`�悷��摜
	cv::Mat graph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));

	cv::cvtColor(hueGraph, hueGraph, cv::COLOR_BGR2HSV);
	for (int j = 0; j < hueGraph.rows; j++){
		for (int i = 0; i < hueGraph.cols; i++){
			hueGraph.data[j * hueGraph.step + i * hueGraph.elemSize() + 0] = (int)((double)i/stepH);
			hueGraph.data[j * hueGraph.step + i * hueGraph.elemSize() + 1] = 220;
			hueGraph.data[j * hueGraph.step + i * hueGraph.elemSize() + 2] = 180;
		}
	}
	cv::cvtColor(hueGraph, hueGraph, cv::COLOR_HSV2BGR);
	// ���̃�����
	for (int i = 0; i < 20; i++)
		if(!(i%4))
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(180, 180, 180), 2);
		else
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(200, 200, 200), 1);
	// �F���̃O���t
	for (int i = 0; i < 180; i++)
		cv::line(hueGraph, cv::Point((int)(i*stepH), 0), cv::Point((int)(i*stepH), (int)histgram[i]), cv::Scalar(180, 180, 180), 2);
	// �܂��
	for (int i = 0; i < 180; i++)
		cv::line(hueGraph, cv::Point((int)(i*stepH), (int)histgram[i]), cv::Point((int)((i+1)*stepH), (int)histgram[i+1]), cv::Scalar(90, 90, 90), 2, CV_AA);
	// ����
	blend(baseGraph, hueGraph, graph, blendType::MULTI);
	// �㉺�𔽓]
	cv::flip(graph, graph, 0);

	drawForQtLabel(graph, ui.histgramH, false);
}

/**
@brief 2�̉摜����������
@warning ���͕s�v�������̂ŏ�Z�����̂ݎ���
@param base �x�[�X�Ƃ���摜
@param blend ��������摜
@param dst ���ʉ摜
@param blendType �������@�i�������j
*/
void HIST::blend(cv::Mat &base, cv::Mat &blend, cv::Mat &dst, int blendType)
{
	dst = base.clone();
	for (int j = 0; j < base.rows; j++){
		for (int i = 0; i < base.cols; i++){
			for (int c = 0; c < 3; c++){
				int baseValue = base.data[j * base.step + i * base.elemSize() + c];
				int blendValue = blend.data[j * blend.step + i * blend.elemSize() + c];
				dst.data[j * dst.step + i * dst.elemSize() + c] = multi(baseValue, blendValue);
			}
		}
	}
}

/**
@brief ��Z�����̌v�Z
@param baseValue �x�[�X�摜�̉�f�l
@param blendValue �u�����h�摜�̉�f�l
@return �v�Z����
*/
int HIST::multi(int baseValue, int blendtValue)
{
	return ((double)baseValue * (double)blendtValue / 255);
}
