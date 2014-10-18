#include "hist.h"

// 日本語を文字化けしないようにする
QTextCodec* tc = QTextCodec::codecForLocale();
// フィルタの設定（小文字と大文字は区別されない）
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
@brief ドラッグ＆ドロップを受け付ける<br>
これがないと受付られない
*/
void HIST::dragEnterEvent(QDragEnterEvent *e)
{
	if(e->mimeData()->hasFormat("text/uri-list"))
		e->acceptProposedAction();
}

/**
@brief dragEnterEventの直後に呼ばれるイベント
*/
void HIST::dropEvent(QDropEvent *e)
{
	// toLocal8Bitで渡すとパスに日本語含んでるファイルも読み込める
	std::string url = e->mimeData()->urls().first().toLocalFile().toLocal8Bit();
	QFileInfo fileInfo =  QFileInfo(e->mimeData()->urls().first().toLocalFile());

	// ディレクトリを入れたらそのディレクトリの中をカレントディレクトリとして使う
	std::string currentDir;
	if(fileInfo.isDir()){
		currentDir = url;
		currentDir.append("/");
	}
	// ファイルを入れたらそのファイルのある場所をカレントディレクトリとして使う
	else{
		currentDir = url.substr(0, url.rfind('/')+1);
	}

	// リストを作成
	QFileInfoList list;
	if (e->mimeData()->hasUrls()){
		for (int i = 0; i < e->mimeData()->urls().size(); i++){
			QFileInfo info = e->mimeData()->urls()[i].toLocalFile();
			list.push_back(info);
		}
	}

	// 入力前の個数（現在の行数）
	int prev = item.size();
	// 入力ファイルをすべてitemにpush
	for ( int i = 0; i < list.size(); i++ ){
		item.push_back( new QTableWidgetItem(list[i].absoluteFilePath()) );
	}
	// 行数を個数に合わせる
	ui.tableWidget->setRowCount(item.size());
	// テーブルにset
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
@param currentRow, currentColumn 選択した列, 行
@param previousRow, previousColumn 前に選択していた列, 行
*/
void HIST::on_tableWidget_currentCellChanged(int currentRow, int currentColumn, int previousRow, int previousColumn)
{
	// 左上のセルに何も無かったら何も行わない
	if(ui.tableWidget->item(0, 0)->text() != ""){
		// 文字化けによる読み込みエラーを防ぐため、一旦QByteArrayに変換
		QByteArray byteArray = ui.tableWidget->item(currentRow, 0)->text().toLocal8Bit();
		// クリックした画像のフルパスを取得
		std::string nowItem = byteArray;
		cv::Mat nowImg = cv::imread(nowItem, 1);
		calcHistgram(nowImg);
		calcHistgramHue(nowImg);
		drawForQtLabel(nowImg, ui.label);
	}
}

/**
@brief Mat型をQImage型に変換し、ラベルに画像を表示する
@param src 描画する画像
@param label 画像を描画するラベル
@param autoResize ラベルに合わせて画像をリサイズするかどうか
*/
void HIST::drawForQtLabel(cv::Mat &src, QLabel *label, bool autoResize)
{
	// エラー処理
	if(src.data == NULL)
		return;

	// 3ch画像は4ch画像に変換
	cv::Mat dst = src.clone();
	if(src.channels() == 3)
		cv::cvtColor(dst, dst, CV_BGR2BGRA);

	// 縮小するサイズを求める
	double size[2];
	double r;
	// ラベルのサイズを取得
	if(autoResize){
		int labelWidth = label->geometry().width();
		int labelHeight = label->geometry().height();
		size[0] = labelWidth/(double)dst.cols;
		size[1] = labelHeight/(double)dst.rows;
		// 縮小率が小さい方を使ってアス比維持して縮小する
		r = (size[0] < size[1]) ? size[0] : size[1];
		// リサイズ
		cv::resize(dst, dst, cv::Size(), r, r, cv::INTER_AREA);
	}

	// Qtの画像用の型に渡す
	QImage image;
	switch(dst.channels()){
	case 1:
		// 白黒画像
		image = QImage(dst.data, dst.cols, dst.rows, QImage::Format_Indexed8);
		break;
	case 4:
		// カラー画像
		image = QImage(dst.data, dst.cols, dst.rows, QImage::Format_ARGB32);
		break;
	default:
		// たぶんここは呼ばれないはず
		std::cout << "ERROR" << std::endl;
		return;
	}

	// ラベルの色を画像のピクセルの色に塗り替える
	label->setPixmap(QPixmap::fromImage(image));
}

/**
@brief RGBのヒストグラムを計算する
@param src ヒストグラムを計算する画像
*/
void HIST::calcHistgram(cv::Mat &src)
{
	if(src.data == NULL)
		return;
	
	// グラフのデータ間の距離
	step = (double)ui.histgramRGB->width()/256;

	int count[256][3];
	int max = 0;

	// 初期化
	for (int i = 0; i < 256; i++)
		for (int c = 0; c < 3; c++)
			count[i][c] = 0;

	// RGBごとに輝度の個数を取得
	for (int j = 0; j < src.cols; j++)
		for (int i = 0; i < src.rows; i++)
			for (int c = 0; c < 3; c++)
				count[src.data[i * src.step + j * src.elemSize() + c]][c]++;

	// 0と255はだいたい極端に多くなるので無視する
	for (int c = 0; c < 3; c++)
		count[0][c] = count[255][c] = 0;

	// スケーリング定数（一番多い輝度の個数）の取得
	for (int i = 0; i < 256; i++)
		for (int c = 0; c < 3; c++)
			if(max < count[i][c])
				max = count[i][c];

	// スケーリング
	double histgram[256][3];
	for (int i = 0; i < 256; i++)
		for (int c = 0; c < 3; c++)
			histgram[i][c] = (double)count[i][c] / max * 200;


	/** 簡易グラフ作成 **/
	int gWidth = 256 * step;
	int gHeight = 200;
	// 格子画像
	cv::Mat baseGraph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));
	// RGBごとのヒストグラム画像
	cv::Mat rgbGraph[3] = {
		cv::Mat(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255)),
		cv::Mat(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255)),
		cv::Mat(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255))
	};
	// 上記4つを乗算ブレンディングした最終的に描画する画像
	cv::Mat graph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));

	// 横のメモリ
	for (int i = 0; i < 20; i++)
		if(!(i%4))
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(180, 180, 180), 2);
		else
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(200, 200, 200), 1);
	// 縦のメモリ
	for (int i = 0; i < 5; i++)
		cv::line(baseGraph, cv::Point(i*50*step, 0), cv::Point(i*50*step, gHeight), cv::Scalar(180, 180, 180), 2);
	// RGBごとのグラフ
	for (int i = 0; i < 256; i++){
		cv::line(rgbGraph[0], cv::Point(i*step, 0), cv::Point(i*step, (int)histgram[i][0]), cv::Scalar(255, 200, 200), 2);
		cv::line(rgbGraph[1], cv::Point(i*step, 0), cv::Point(i*step, (int)histgram[i][1]), cv::Scalar(200, 255, 200), 2);
		cv::line(rgbGraph[2], cv::Point(i*step, 0), cv::Point(i*step, (int)histgram[i][2]), cv::Scalar(200, 200, 255), 2);
	}
	// 折れ線
	for (int i = 0; i < 255; i++){
		cv::line(rgbGraph[0], cv::Point(i*step, (int)histgram[i][0]), cv::Point((i+1)*step, (int)histgram[i+1][0]), cv::Scalar(255, 30, 30), 2, CV_AA);
		cv::line(rgbGraph[1], cv::Point(i*step, (int)histgram[i][1]), cv::Point((i+1)*step, (int)histgram[i+1][1]), cv::Scalar(30, 255, 30), 2, CV_AA);
		cv::line(rgbGraph[2], cv::Point(i*step, (int)histgram[i][2]), cv::Point((i+1)*step, (int)histgram[i+1][2]), cv::Scalar(30, 30, 255), 2, CV_AA);
	}
	// 合成
	cv::Mat tmp;
	blend(rgbGraph[0], rgbGraph[1], tmp, blendType::MULTI);
	blend(tmp, rgbGraph[2], tmp, blendType::MULTI);
	blend(baseGraph, tmp, graph, blendType::MULTI);
	// 上下を反転
	cv::flip(graph, graph, 0);

	drawForQtLabel(graph, ui.histgramRGB, false);
}

/**
@brief 色相だけのヒストグラムを計算する
@param src ヒストグラムを計算する画像
*/
void HIST::calcHistgramHue(cv::Mat &src)
{
	if(src.data == NULL)
		return;
	
	// グラフのデータ間の距離
	stepH = (double)ui.histgramH->width()/180;

	cv::cvtColor(src, src, cv::COLOR_BGR2HSV);
	int count[180];
	int max = 0;

	// 初期化
	for (int i = 0; i < 180; i++)
		count[i] = 0;

	// 色相の各値の個数を取得
	for (int j = 0; j < src.cols; j++)
		for (int i = 0; i < src.rows; i++)
			// ほぼ白（彩度≒0）は無視
				if(src.data[i * src.step + j * src.elemSize() + 1] > 3)
					count[src.data[i * src.step + j * src.elemSize()]]++;
	cv::cvtColor(src, src, cv::COLOR_HSV2BGR);

	// スケーリング定数（一番多い個数）の取得
	for (int i = 0; i < 180; i++)
		if(max < count[i])
			max = count[i];

	// スケーリング
	double histgram[180];
	for (int i = 0; i < 180; i++)
		histgram[i] = (double)count[i] / max * 200;


	/** 簡易グラフ作成 **/
	int gWidth = 180 * stepH;
	int gHeight = 200;
	// 格子画像
	cv::Mat baseGraph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));
	// 色相のヒストグラム画像
	cv::Mat hueGraph(gHeight, gWidth, CV_8UC3, cv::Scalar(255, 255, 255));
	// 上記2つを乗算ブレンディングした最終的に描画する画像
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
	// 横のメモリ
	for (int i = 0; i < 20; i++)
		if(!(i%4))
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(180, 180, 180), 2);
		else
			cv::line(baseGraph, cv::Point(0, i*10), cv::Point(gWidth, i*10), cv::Scalar(200, 200, 200), 1);
	// 色相のグラフ
	for (int i = 0; i < 180; i++)
		cv::line(hueGraph, cv::Point((int)(i*stepH), 0), cv::Point((int)(i*stepH), (int)histgram[i]), cv::Scalar(180, 180, 180), 2);
	// 折れ線
	for (int i = 0; i < 180; i++)
		cv::line(hueGraph, cv::Point((int)(i*stepH), (int)histgram[i]), cv::Point((int)((i+1)*stepH), (int)histgram[i+1]), cv::Scalar(90, 90, 90), 2, CV_AA);
	// 合成
	blend(baseGraph, hueGraph, graph, blendType::MULTI);
	// 上下を反転
	cv::flip(graph, graph, 0);

	drawForQtLabel(graph, ui.histgramH, false);
}

/**
@brief 2つの画像を合成する
@warning 他は不要だったので乗算合成のみ実装
@param base ベースとする画像
@param blend 合成する画像
@param dst 結果画像
@param blendType 合成方法（未実装）
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
@brief 乗算合成の計算
@param baseValue ベース画像の画素値
@param blendValue ブレンド画像の画素値
@return 計算結果
*/
int HIST::multi(int baseValue, int blendtValue)
{
	return ((double)baseValue * (double)blendtValue / 255);
}
