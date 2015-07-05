/*
** 画像処理用の処理を集めたライブラリ
** 使い方, 説明, コメントはこちらへ
** http://www47.atpages.jp/sensq/blog/2014/01/25/603/
** 
** 2014/02/23
** @S_SenSq
*/

// オブジェクト作成
var CV = function () { };
// 履歴格納用
CV.history = [];
CV.historyR = [];
// 読み込んだ画像格納用（スケーリング無くせばグローバルにする必要無い）
CV.image;
// 画像のサイズ格納用
CV.width = 0;
CV.height = 0;
