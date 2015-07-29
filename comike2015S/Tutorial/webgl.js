//変数（省略可）
var Width,Height;
var renderer;
var camera;
var scene;
var light,ambient;
var geometry,material,mesh;
 
// 描画領域の設定
function Init() {
	// 幅と高さ
    Width = 400;
    Height = 400;
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(Width, Height);
    document.body.appendChild(renderer.domElement);
    // 背景色
    renderer.setClearColorHex(0xFFFFFF, 1.0);
}
 
// カメラの設定
function Camera() {
	// 画角、アス比、表示する手前の限界値、奥の最大値
    camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
    // 視点の位置
    camera.position = new THREE.Vector3(100, 20, 50);
    // 見る方向
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}
 
// 画面初期化
function Scene() {   
    scene = new THREE.Scene();
}
 
// 光源の設定
function Light() {
	// 平行光源
    light = new THREE.DirectionalLight(0xcccccc);
    // 光源の位置
    light.position = new THREE.Vector3(0.577, 0.577, 0);
    scene.add(light);
 
	// 環境光
    ambient = new THREE.AmbientLight(0x333333);
    scene.add(ambient);
}
 
//オブジェクトの設定
function Object() {
	// トーラス形状
    geometry = new THREE.TorusGeometry(30, 10, 20, 40);
    // 材質
    material = new THREE.MeshPhongMaterial({
        color: 0xff9900, ambient: 0x888888,
        specular: 0xcccccc, shininess:90, metal:true});
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}
 
//実行する関数
function three() {
    Init();
    Camera();
    Scene();
    Light();
    Object();
    renderer.clear();
    renderer.render(scene, camera);
}