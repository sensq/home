//=====================
// 必要なjsファイルの読み込み
document.write('<script type="text/javascript" src="./three61/three.js"></script>');
document.write('<script type="text/javascript" src="./three61/Detector.js"></script>');
document.write('<script type="text/javascript" src="./three61/TrackballControls.js"></script>');
document.write('<script type="text/javascript" src="./util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="./util/myObject.js"></script>');
//=====================

// 必須のグローバル変数
var DRAW_AREA;
var FULLSCREEN = false;	// falseにするとブラウザ画面全体に描画
var SWITCH_SHADOW = false;	// シャドーマッピングのON/OFF
var SHADOW = false;	// SWITCH_SHADOWを切り替えたときに変わるフラグ
var VISIBLE_LIGHT = true;	// シャドーマッピングON状態でtrueだと光を可視化
var stats;
var Width, Height;
var renderer, scene, light, camera, control;

//==================
// ここからはほぼ必須の関数
//==================

/*
** オブジェクトのプロパティの一覧を表示する関数
** デバッグ用
*/
function printProperties(obj, opt) {
	this.obj = obj;
	this.opt = opt || 0;
	this.properties = new String();
	// 第2引数に1を入れるとalertで表示される
	if(this.opt == 1){
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '無し';
			}
			this.properties += this.prop + "\n" + this.obj[this.prop] + "\n" + "\n";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		alert(this.properties);
	}else{
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '<i>無し</i>';
			}
		this.properties += "<font color='blue'><b>" + this.prop + "</b></font> =<br>" + this.obj[this.prop] + "<br><br>";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		// 別ページに表示される
		// 場所によってはFPS表示の枠などが表示されるのは仕様
		this.newWin = window.open(this.obj, this.obj, "width=400,height=600");
		this.newWin.document.open();
		this.newWin.document.write('<title>プロパティリスト</title>');
		this.newWin.document.write(this.properties);
		this.newWin.document.close();
	}
};

/*
** ☆描画領域の設定とレンダラーの作成
*/
function initThree(){
	// 描画領域とするブロック要素を指定
	this.DRAW_AREA = document.getElementById('draw_area');
	if(FULLSCREEN){
		// CSSを変更
		document.body.style.width = '100%';
		document.body.style.height = '70%';
		this.DRAW_AREA.style.width = '100%';
		this.DRAW_AREA.style.position = 'absolute';
	};

	this.renderer = new THREE.WebGLRenderer({antialias: true});
	// 描画領域のサイズを取得
	this.Width = this.DRAW_AREA.clientWidth;
	this.Height = this.DRAW_AREA.clientHeight;
	this.DRAW_AREA.appendChild(this.renderer.domElement);
	this.renderer.setSize(this.Width, this.Height);
	// デフォルトの背景色とα値
	this.renderer.setClearColorHex(0xFFFFFF, 1.0);
	if(SHADOW == true){
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapSoft = true;
	}else{
		this.renderer.shadowMapEnabled = false;
		this.renderer.shadowMapSoft = false;
	};
};

/*
** FPSの表示
*/
function viewFPS(){
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	if(FULLSCREEN){
		this.stats.domElement.style.top = '5px';
		this.stats.domElement.style.left = '5px';
	}else{
		this.stats.domElement.style.top = '11%';
		this.stats.domElement.style.left = '5.5%';
	};
	DRAW_AREA.appendChild(this.stats.domElement);
};

/*
** ☆カメラの設定
*/
function initCamera(posX, posY, posZ, tarX, tarY, tarZ) {
	var posX = posX || 0;
	var posY = posY || 0;
	var posZ = posZ || 0;
	var tarX = tarX || 0;
	var tarY = tarY || 0;
	var tarZ = tarZ || 0;
	// 透視投影（画角, アスペクト比, 表示される手前の限界距離, 表示される奥の限界距離）
	this.camera = new THREE.PerspectiveCamera(90, Width / Height, 1, 10000);
	// カメラの位置
	this.camera.position = new THREE.Vector3(posX, posY, posZ);
	// カメラを動かせるようにする（2つ目の引数はマウス入力を受け付けるdiv要素）
	this.controls = new THREE.TrackballControls(this.camera, renderer.domElement);
	// 各種オプション
	this.controls.noRotate = false;	// 回転禁止
	this.controls.noZoom = false;	// ズーム禁止
	this.controls.noPan = false;		// 平行移動禁止
	this.controls.dynamicDampingFactor = 0.3;	// 回転時の速度の減衰率
	this.controls.minDistance = 0;	// ズームイン最大値
	this.controls.maxDistance = Infinity;	// ズームアウト最大値

	// 向いている方向
	this.controls.target = new THREE.Vector3(tarX, tarY, tarZ)
};

/*
** ☆画面初期化
*/
function initScene() {
	this.scene = new THREE.Scene();
};

/*
** ☆光源の設定
** 場合によって試行錯誤が必要
*/
function initLight() {
	// 平行光源
	/* メイン光源に半球ライトを使うので必要ないが、*/
	/* シャドーマッピングは平行光源しか対応してないので黒にして置いとく */
	this.light = new THREE.DirectionalLight(0x888888);
	this.light.position = new THREE.Vector3(0, 0, 0);
	
	// シャドーマッピングを行う場合
	if(SHADOW == true){
		this.light.target.position.copy(scene.position);
		// 光源を可視化（主に確認用）
		if(VISIBLE_LIGHT){
			this.light.shadowCameraVisible = true;
		}
		this.light.castShadow = true;
		// 光線の範囲
		this.light.shadowCameraLeft = -120;
		this.light.shadowCameraRight = 120;
		this.light.shadowCameraTop = -120;
		this.light.shadowCameraBottom = 120;
		this.light.shadowCameraNear = -200;
		this.light.shadowCameraFar = 800;
		this.light.shadowBias = -.001;
		// 影の解像度
		var resolution = 2048;
		this.light.shadowMapWidth = this.light.shadowMapHeight = resolution;
		// 影の濃さ
		this.light.shadowDarkness = .7;
	};
	scene.add(this.light);
	
	// 環境光（位置を指定する必要はない）
	this.amb = 0x666666;
	this.ambient = new THREE.AmbientLight(this.amb);
	scene.add(this.ambient);

	// 半球ライト（メインの光源）
	this.Hemilight = new THREE.HemisphereLight(0xbbbbbb, this.amb);
	this.Hemilight.position = new THREE.Vector3(0, 0, 0);
	scene.add(this.Hemilight);
};

//========================
// ここからはテクスチャに関する関数
//========================

/*
** テクスチャをセットする関数
** デフォルトの関数が長くて面倒なので作成
*/
function setTexture(url){
	var texture = new THREE.ImageUtils.loadTexture(url);
	return texture;
};

/*
** 文字テクスチャを作成して返す関数
*/
function setCtxTexture(str, color, size, fonttype, bgsize, transparent){
	// 引数省略した場合のデフォルト値
	this.str = str || 'Test';
	this.color = color || 0x666666;
	this.size = size || 65;
	this.fonttype = fonttype || 'ＭＳ Ｐゴシック';
	this.bgsize = bgsize || 600;
	this.transparent = transparent || false;

	// 他と同様の16進数の形で色を指定できるようにするための処理
	var rgb = new String();
	this.color = this.color.toString(16);
	this.color = ('0000' + this.color).slice(-6);
	rgb = '#' + this.color;

	// canvas要素を取得
	var canvas = document.createElement('canvas');
	// 画像の解像度に相当
	canvas.width = 256; canvas.height = 256;
	var ctx = canvas.getContext('2d');
	// 背景色を擬似的に作成（サイズと位置は適当に調整する）
	if(!this.transparent){
		ctx.fillStyle = 'white';
		ctx.font = this.bgsize + 'px' + ' ' + 'ＭＳ Ｐゴシック';;
		ctx.textAlign = 'center';
		ctx.fillText('■', canvas.width/2, canvas.height + this.bgsize/4);
	};
	// 文字作成
	ctx.fillStyle = rgb;
	ctx.font = this.size + 'px' + ' ' + this.fonttype;;
	ctx.textAlign = 'center';
	ctx.fillText(this.str, canvas.width/2, canvas.height/2 + this.size/3);
	// テクスチャを作成
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
};

// ブレンダー読み込み
function loadBlender(filename, scale, x, y, z, rx, ry, rz){
	// 引数指定しない場合のデフォルト値
	var filename = filename;
	var scale = scale || 1;
	var x = x || 0;
	var y = y || 0;
	var z = z || 0;
	var rx = rx || 0;
	var ry = ry || 0;
	var rz = rz || 0;

	var geometry;
	var materials = [];
	this.callback = function(geometry, materials) {
		var material = new THREE.MeshFaceMaterial(materials);
		this.meshBlender = new THREE.SkinnedMesh(geometry, material);
		this.meshBlender.scale = new THREE.Vector3(scale, scale, scale);
		this.meshBlender.position = new THREE.Vector3(x, y, z);
		this.meshBlender.rotation = new THREE.Vector3(rx * Math.PI/180, ry * Math.PI/180, rz * Math.PI/180);
		this.meshBlender.castShadow = true;
		this.meshBlender.receiveShadow = true;
		for(i=0; i<materials.length; i++){
			// ambientが全部0になるらしいのでカラーの値を入れる
			materials[i].ambient = materials[i].color;
			materials[i].side = 2;
			// アニメーションを行えるようにする（上手くいってないので保留）
			// materials[i].morphTargets = true;
		};
		// どのフレームを表示するかを指定
		// this.meshBlender.morphTargetInfluences[0] = 1;
		scene.add(this.meshBlender);
	};
	var loader = new THREE.JSONLoader();
	loader.load(filename, this.callback);
};

// obj読み込み
function loadSoccer(scale, x, y, z, rx, ry, rz){
	// 引数指定しない場合のデフォルト値
	var scale = scale || 1;
	var x = x || 0;
	var y = y || 0;
	var z = z || 0;
	var rx = rx || 0;
	var ry = ry || 0;
	var rz = rz || 0;

	var loader = new THREE.OBJLoader();
	var geometry;
	loader.load('./s06.obj', function(geometry) {
		this.meshSoccer = geometry;
		//サッカーボール
		var c = this.meshSoccer.children[0].geometry.faces;
		for(i=0; i<c.length; i++){
			if(i<40){
				c[i].materialIndex = 0;	//六角形
			}else{
				c[i].materialIndex = 1;	//五角形
			}
		}
		this.meshSoccer.children[0].material = new THREE.MeshFaceMaterial([
			new THREE.MeshLambertMaterial({ color:0xdddddd, side:2 }),
			new THREE.MeshLambertMaterial({ color:0x000000, side:2 })
		]);
        this.meshSoccer.scale = new THREE.Vector3(scale, scale, scale);
		this.meshSoccer.position = new THREE.Vector3(x, y, z);
		this.meshBlender.rotation = new THREE.Vector3(rx * Math.PI/180, ry * Math.PI/180, rz * Math.PI/180);
		// 入れてるけどなぜか影が出ない
		this.meshSoccer.castShadow = true;
		this.meshSoccer.receiveShadow = true;
		scene.add(this.meshSoccer);
	});
};

//========================
// ここからはボタンなどに関する関数
//========================

/*
** 一括してシーンを作り直す関数
** 汎用性が高くて楽だけど若干遅い
*/
function updateScene() {
	if(SWITCH_SHADOW){
		SHADOW = true;
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
	}else{
		SHADOW = false
		renderer.shadowMapEnabled = false;
		renderer.shadowMapSoft = false;
	};
	initScene();
	initLight();
	initObject();
};

/*
** 描画領域をブラウザ全体か一部のみかに変更する関数
*/
function changeScreen(){
	// CSSを変更して位置調整
	if(FULLSCREEN == false){
		FULLSCREEN = true;
		// body全体を縮小して見えなくする
		document.body.style.width = '100%';
		document.body.style.height = '70%';
		// statsの位置調整
		stats.domElement.style.top = '5px';
		stats.domElement.style.left = '5px';
		// 描画領域を全体に拡大
		DRAW_AREA.style.width = '100%';
		DRAW_AREA.style.position = 'absolute';
	}else{
		FULLSCREEN = false;
		document.body.style.width = '98%';
		document.body.style.height = '98%';
		stats.domElement.style.top = '11%';
		stats.domElement.style.left = '5.5%';
		DRAW_AREA.style.width = '60%';
		DRAW_AREA.style.position = 'static';
	}
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	// リサイズ
	renderer.setSize(Width, Height);
	camera.aspect = Width / Height;
	camera.updateProjectionMatrix();
};

//======================
// ここからはイベントに関する関数
//======================

/*
** 任意の要素のオフセットを取得する関数 （描画領域のオフセット位置取得用）
** マウス座標を正しく取得するために必要
*/
function getElementPosition(element) {
        var top = left = 0;
        do {
            top  += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element =  element.offsetParent;
        }
        while (element);
        return {top: top, left: left};
};

/*
** マウス座標を取得して衝突したオブジェクトを返す関数
*/
var getIntersects = function(mouseX, mouseY){
	// マウス座標からRayを作成
	var projector = new THREE.Projector();
	var x =   (mouseX / renderer.domElement.width) * 2 - 1;
	var y = - (mouseY / renderer.domElement.height) * 2 + 1;
	var pos = new THREE.Vector3(x, y, 1);
	var ray = projector.pickingRay(pos, camera);
	// Rayが衝突したオブジェクトを取得
	var intersects = ray.intersectObjects(scene.children);
	if(intersects.length == 0){
		intersects[0] = 0;
	}
	return intersects;
};

/*
** ウィンドウのリサイズに対応
*/
window.addEventListener('resize', function() {
	// リサイズ時の描画領域のサイズ取得
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	// リサイズ実行
	renderer.setSize(Width, Height);
	camera.aspect = Width / Height;
	camera.updateProjectionMatrix();
}, false);