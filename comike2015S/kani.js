var baseTime = +new Date();
var x;
var y;
var z;
var vx;
var vy;
var vz;
var dt;

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(50, 0, 0);
	scene.add(light);
	Hemilight = new THREE.HemisphereLight(0x555555, 0x222222);
	Hemilight.position = new THREE.Vector3(50, 0, 0);
	scene.add(Hemilight);
	ambient = new THREE.AmbientLight(0x888888);
	scene.add(ambient);
}

//オブジェクトの設定
function initObject() {
	geometry = new THREE.CubeGeometry(1, 1, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0xff9900,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}
// ルンゲクッタ

function runge_kutta_start() {
	target = document.getElementById("x");
	x = Number(target.value);
	target = document.getElementById("y");
	y = Number(target.value);
	target = document.getElementById("z");
	z = Number(target.value);
	target = document.getElementById("vx");
	vx = Number(target.value);
	target = document.getElementById("vy");
	vy = Number(target.value);
	target = document.getElementById("vz");
	vz = Number(target.value);
	target = document.getElementById("dt");
	dt = Number(target.value);
}

function runge_kutta() {
	var ax = new Array(5);
	var ay = new Array(5);
	var az = new Array(5);
	var bvx = new Array(5);
	var bvy = new Array(5);
	var bvz = new Array(5);
	//1次の項の計算
	ax[1] = this.Fx(x, y, z, vx, vy, vz) * dt;
	ay[1] = this.Fy(x, y, z, vx, vy, vz) * dt;
	az[1] = this.Fz(x, y, z, vx, vy, vz) * dt;
	bvx[1] = this.Gx(x, y, z, vx, vy, vz) * dt;
	bvy[1] = this.Gy(x, y, z, vx, vy, vz) * dt;
	bvz[1] = this.Gz(x, y, z, vx, vy, vz) * dt;
	//2次の項の計算
	ax[2] = this.Fx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	ay[2] = this.Fy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	az[2] = this.Fz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvx[2] = this.Gx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvy[2] = this.Gy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvz[2] = this.Gz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	//3次の項の計算
	ax[3] = this.Fx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	ay[3] = this.Fy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	az[3] = this.Fz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvx[3] = this.Gx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvy[3] = this.Gy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvz[3] = this.Gz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	//4次の項の計算
	ax[4] = this.Fx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	ay[4] = this.Fy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	az[4] = this.Fz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvx[4] = this.Gx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvy[4] = this.Gy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvz[4] = this.Gz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	//位置と速度の次の値を計算
	this.x = x + (bvx[1] + 2 * bvx[2] + 2 * bvx[3] + bvx[4]) / 6;
	this.y = y + (bvy[1] + 2 * bvy[2] + 2 * bvy[3] + bvy[4]) / 6;
	this.z = z + (bvz[1] + 2 * bvz[2] + 2 * bvz[3] + bvz[4]) / 6;
	this.vx = vx + (ax[1] + 2 * ax[2] + 2 * ax[3] + ax[4]) / 6;
	this.vy = vy + (ay[1] + 2 * ay[2] + 2 * ay[3] + ay[4]) / 6;
	this.vz = vz + (az[1] + 2 * az[2] + 2 * az[3] + az[4]) / 6;
	target = document.getElementById("x");
	target.value = x.toFixed(6);
	target = document.getElementById("y");
	target.value = y.toFixed(6);
	target = document.getElementById("z");
	target.value = z.toFixed(6);
	target = document.getElementById("vx");
	target.value = vx.toFixed(6);
	target = document.getElementById("vy");
	target.value = vy.toFixed(6);
	target = document.getElementById("vz");
	target.value = vz.toFixed(6);
}

function Fx(x, y, z, vx, vy, vz) {
	var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
	return vy - x / (r * r * r);
}

function Fy(x, y, z, vx, vy, vz) {
	var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
	return -vx - y / (r * r * r);
}

function Fz(x, y, z, vx, vy, vz) {
	var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
	return -z / (r * r * r);
}

function Gx(x, y, z, vx, vy, vz) {
	return vx;
}

function Gy(x, y, z, vx, vy, vz) {
	return vy;
}

function Gz(x, y, z, vx, vy, vz) {
	return vz;
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	stats.update();
	runge_kutta();
	mesh.rotation.y = 0.3 * (+new Date() - baseTime) / 1000; //回転
	mesh.position = new THREE.Vector3(x, y, z);
	renderer.render(scene, camera);
}

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(0, 0, 10);	// カメラ初期化
	initScene();	// シーン初期化
	initLight();	// ライト初期化
	initObject();	// オブジェクト初期化
	renderer.clear();	// レンダラー初期化
	render();		// レンダリング
};

//フォーカスを合わせる
window.addEventListener('load', function() {
	target = document.getElementById("x");
	target.value = 1.0;
	target.focus();
	target = document.getElementById("y");
	target.value = 1.0;
	target = document.getElementById("z");
	target.value = 0.5;
	target = document.getElementById("vx");
	target.value = 0.0;
	target = document.getElementById("vy");
	target.value = 0.0;
	target = document.getElementById("vz");
	target.value = 0.5;
	target = document.getElementById("dt");
	target.value = 0.05;
	runge_kutta_start();
}, false);