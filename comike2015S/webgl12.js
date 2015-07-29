document.write('<script type="text/javascript" src="../util/myTemplate.js"></script>');
var x, y, z;
var vx, vy, vz;
var dt;
var loop = 0;
var type = 0;

var img_floor = './gray.jpg';
texture_floor = new THREE.ImageUtils.loadTexture(img_floor);

// カメラの設定
function initCamera2() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(0, 0, cam_pos_z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, renderer.domElement);
}

// 光源の設定
function initLight2() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(10, -40, 20);
	scene.add(light);
	Hemilight = new THREE.HemisphereLight(0x555555, 0x222222);
	Hemilight.position = new THREE.Vector3(10, -40, 20);
	scene.add(Hemilight);
	ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);
}

// オブジェクトの設定
function initObject() {
	var geometry, material;
	geometry = new THREE.SphereGeometry(0.3, 25, 25);
	material = new THREE.MeshPhongMaterial({
		color: 0x00ff99,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	point_mesh = new THREE.Mesh(geometry, material);
	point_mesh.scale = new THREE.Vector3(p_sc, p_sc, p_sc);
	scene.add(point_mesh);
	
	geometry = new THREE.SphereGeometry(2000, 25, 25);
	material = new THREE.MeshPhongMaterial({
		color: 0x00aaff,
		ambient: 0xaaaaaa,
		specular: 0x000000,
		shininess: 90,
		metal: true,
		side: 2
	});
	sky_mesh = new THREE.Mesh(geometry, material);
	scene.add(sky_mesh);
	
	geometry = new THREE.CubeGeometry(100, 100, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0xaaaaaa,
		ambient: 0xaaaaaa,
		specular: 0x555555,
		shininess: 90,
		metal: true,
		side: 2,
		map: texture_floor
	});
	floor_mesh = new THREE.Mesh(geometry, material);
	floor_mesh.rotation.x = -1;
	floor_mesh.position = new THREE.Vector3(0, -20, 0);
	scene.add(floor_mesh);
}

// ルンゲクッタに使う初期値を変数に代入
function runge_kutta_start() {
	loop = 0;
	target = document.getElementById("x");
	x = Number(target.value);
	document.getElementById("var_x").value = target;
	target = document.getElementById("y");
	y = Number(target.value);
	document.getElementById("var_y").value = y;
	target = document.getElementById("z");
	z = Number(target.value);
	document.getElementById("var_z").value = z;
	target = document.getElementById("vx");
	vx = Number(target.value);
	document.getElementById("var_vx").value = vx;
	target = document.getElementById("vy");
	vy = Number(target.value);
	document.getElementById("var_vy").value = vy;
	target = document.getElementById("vz");
	vz = Number(target.value);
	document.getElementById("var_vz").value = vz;
	target = document.getElementById("dt");
	dt = Number(target.value);
	target = document.getElementById("gamm");
	gamm = Number(target.value);
	target = document.getElementById("spr");
	spr = Number(target.value);
	initCamera2();
	initScene();
	initLight2();
	initObject();
	renderer.clear();
	render();
}

// ルンゲクッタの計算
function runge_kutta() {
	loop += 1;
	var ax = new Array(5);
	var ay = new Array(5);
	var az = new Array(5);
	var bvx = new Array(5);
	var bvy = new Array(5);
	var bvz = new Array(5);
	// 1次の項の計算
	ax[1] = Fx(x, y, z, vx, vy, vz) * dt;
	ay[1] = Fy(x, y, z, vx, vy, vz) * dt;
	az[1] = Fz(x, y, z, vx, vy, vz) * dt;
	bvx[1] = Gx(x, y, z, vx, vy, vz) * dt;
	bvy[1] = Gy(x, y, z, vx, vy, vz) * dt;
	bvz[1] = Gz(x, y, z, vx, vy, vz) * dt;
	// 2次の項の計算
	ax[2] = Fx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	ay[2] = Fy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	az[2] = Fz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvx[2] = Gx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvy[2] = Gy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvz[2] = Gz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	// 3次の項の計算
	ax[3] = Fx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	ay[3] = Fy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	az[3] = Fz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvx[3] = Gx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvy[3] = Gy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvz[3] = Gz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	// 4次の項の計算
	ax[4] = Fx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	ay[4] = Fy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	az[4] = Fz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvx[4] = Gx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvy[4] = Gy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvz[4] = Gz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	// 位置と速度の次の値を計算
	x = x + (bvx[1] + 2 * bvx[2] + 2 * bvx[3] + bvx[4]) / 6;
	y = y + (bvy[1] + 2 * bvy[2] + 2 * bvy[3] + bvy[4]) / 6;
	z = z + (bvz[1] + 2 * bvz[2] + 2 * bvz[3] + bvz[4]) / 6;
	vx = vx + (ax[1] + 2 * ax[2] + 2 * ax[3] + ax[4]) / 6;
	vy = vy + (ay[1] + 2 * ay[2] + 2 * ay[3] + ay[4]) / 6;
	vz = vz + (az[1] + 2 * az[2] + 2 * az[3] + az[4]) / 6;
	document.getElementById("var_x").value = x.toFixed(6);
	document.getElementById("var_y").value = y.toFixed(6);
	document.getElementById("var_z").value = z.toFixed(6);
	document.getElementById("var_vx").value = vx.toFixed(6);
	document.getElementById("var_vy").value = vy.toFixed(6);
	document.getElementById("var_vz").value = vz.toFixed(6);
	document.getElementById("loop").value = loop;
}

// ローレンツ方程式の定数
var Lorenz_Const = function(){
	this.p = 10;
	this.r = 28;
	this.b = 8.0/3.0;
};
lorenz_const = new Lorenz_Const();

// ここからルンゲクッタで使う関数
function Fx(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			return 0;
		break;
		
		case 1:
			var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			return vy - x / (r * r * r);
		break;
		
		case 2:
			return -spr*x-gamm*vx;
		break;
	}
}
function Fy(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			return 0;
		break;
		
		case 1:
			var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			return -vx - y / (r * r * r);
		break;
		
		case 2:
			return -spr*y-gamm*vy;
		break;
	}
}
function Fz(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			return 0;
		break;
		
		case 1:
			var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			return -z / (r * r * r);
		break;
		
		case 2:
			return -spr*z-gamm*vz;
		break;
	}
}
function Gx(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			var p = lorenz_const.p;
			return -p*x+p*y;
		break;
		
		case 1:
			return vx;
		break;
		
		case 2:
			return vx;
		break;
	}
}
function Gy(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			var r = lorenz_const.r;
			return -x*z+r*x-y;
		break;
		
		case 1:
			return vy;
		break;
		
		case 2:
			return vy;
		break;
	}
}
function Gz(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			var b = lorenz_const.b;
			return x*y-b*z;
		break;
		
		case 1:
			return vz;
		break;
		
		case 2:
			return vz;
		break;
	}
}

// レンダリング
function render() {
	var skip = document.getElementById("skip").value;
	requestAnimationFrame(render);
	controls.update(); // マウス操作用
	stats.update();
	
	// 軌跡を描画する
	var geometry = new THREE.Geometry();
	
	// skipの値分だけ描画をスキップ（dtを大きくするのとは意味が違う）
	for(i=0; i<skip; i++){
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));    // 始点
		
		runge_kutta(x, y, z, vx, vy, vz, dt);
		
		point_mesh.position = new THREE.Vector3(x, y, z);
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));  // 終点
		var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	}
	
	var line = new THREE.Line(geometry, material)
	scene.add(line);
	renderer.render(scene, camera);
}

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera2(0, 0, cam_pos_z);	// カメラ初期化
	initScene();	// シーン初期化
	initLight2();	// ライト初期化
	initObject();	// オブジェクト初期化
	renderer.clear();	// レンダラー初期化
	render();		// レンダリング
};

// 微分方程式の種類を変える
function Button_type(flag) {
	switch(flag){
		case 'Lorenz_equation':
			setLorenz_equation();
			type = 0;
		break;
		
		case 'Lorentz_force':
			setLorentz_force();
			type = 1;
		break;
		
		case 'damped_vibration':
			setvibration();
			type = 2;
		break;
	}
	runge_kutta_start();
}

// 最適な値にセット
function setLorenz_equation() {
	cam_pos_z = 90;	// カメラの位置を変更
	p_sc = 3;	// スフィアのサイズを変更
	document.getElementById("x").value = 1.0;
	document.getElementById("y").value = 1.0;
	document.getElementById("z").value = 1.0;
	document.getElementById("vx").value = 0.0;
	document.getElementById("vy").value = 0.0;
	document.getElementById("vz").value = 0.0;
	document.getElementById("dt").value = 0.05;
}
function setLorentz_force() {
	cam_pos_z = 10;
	p_sc = 0.7;
	document.getElementById("x").value = 1.0;
	document.getElementById("y").value = 1.0;
	document.getElementById("z").value = 0.5;
	document.getElementById("vx").value = 0.0;
	document.getElementById("vy").value = 0.0;
	document.getElementById("vz").value = 0.5;
	document.getElementById("dt").value = 0.1;
}
function setvibration() {
	cam_pos_z = 4;
	p_sc = 0.3;
	document.getElementById("x").value = 1.0;
	document.getElementById("y").value = 1.0;
	document.getElementById("z").value = 0.5;
	document.getElementById("vx").value = 1.0;
	document.getElementById("vy").value = 0.0;
	document.getElementById("vz").value = 0.5;
	document.getElementById("dt").value = 0.1;
	document.getElementById("gamm").value = 0.1;
	document.getElementById("spr").value = 1.0;
}

/*
** キーボード押下時のイベント
*/
document.onkeydown = function(e) { 
	// 押下したキーのキーコードを取得 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90（0~9, a~z）の場合は文字に変換
		keycode = String.fromCharCode(keycode).toUpperCase();
	};

	switch(keycode){
		case "Z":
		changeScreen();
		break;
	};
};

// 初期値を入力&フォーカスを合わせる
window.addEventListener('load', function() {
	document.getElementById("skip").value = 1;
	setLorenz_equation();
	runge_kutta_start();
}, false);