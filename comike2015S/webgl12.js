document.write('<script type="text/javascript" src="../util/myTemplate.js"></script>');
var x, y, z;
var vx, vy, vz;
var dt;
var loop = 0;
var type = 0;

var img_floor = './gray.jpg';
texture_floor = new THREE.ImageUtils.loadTexture(img_floor);

// �J�����̐ݒ�
function initCamera2() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(0, 0, cam_pos_z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, renderer.domElement);
}

// �����̐ݒ�
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

// �I�u�W�F�N�g�̐ݒ�
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

// �����Q�N�b�^�Ɏg�������l��ϐ��ɑ��
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

// �����Q�N�b�^�̌v�Z
function runge_kutta() {
	loop += 1;
	var ax = new Array(5);
	var ay = new Array(5);
	var az = new Array(5);
	var bvx = new Array(5);
	var bvy = new Array(5);
	var bvz = new Array(5);
	// 1���̍��̌v�Z
	ax[1] = Fx(x, y, z, vx, vy, vz) * dt;
	ay[1] = Fy(x, y, z, vx, vy, vz) * dt;
	az[1] = Fz(x, y, z, vx, vy, vz) * dt;
	bvx[1] = Gx(x, y, z, vx, vy, vz) * dt;
	bvy[1] = Gy(x, y, z, vx, vy, vz) * dt;
	bvz[1] = Gz(x, y, z, vx, vy, vz) * dt;
	// 2���̍��̌v�Z
	ax[2] = Fx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	ay[2] = Fy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	az[2] = Fz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvx[2] = Gx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvy[2] = Gy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvz[2] = Gz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	// 3���̍��̌v�Z
	ax[3] = Fx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	ay[3] = Fy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	az[3] = Fz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvx[3] = Gx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvy[3] = Gy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvz[3] = Gz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	// 4���̍��̌v�Z
	ax[4] = Fx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	ay[4] = Fy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	az[4] = Fz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvx[4] = Gx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvy[4] = Gy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvz[4] = Gz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	// �ʒu�Ƒ��x�̎��̒l���v�Z
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

// ���[�����c�������̒萔
var Lorenz_Const = function(){
	this.p = 10;
	this.r = 28;
	this.b = 8.0/3.0;
};
lorenz_const = new Lorenz_Const();

// �������烋���Q�N�b�^�Ŏg���֐�
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

// �����_�����O
function render() {
	var skip = document.getElementById("skip").value;
	requestAnimationFrame(render);
	controls.update(); // �}�E�X����p
	stats.update();
	
	// �O�Ղ�`�悷��
	var geometry = new THREE.Geometry();
	
	// skip�̒l�������`����X�L�b�v�idt��傫������̂Ƃ͈Ӗ����Ⴄ�j
	for(i=0; i<skip; i++){
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));    // �n�_
		
		runge_kutta(x, y, z, vx, vy, vz, dt);
		
		point_mesh.position = new THREE.Vector3(x, y, z);
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));  // �I�_
		var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	}
	
	var line = new THREE.Line(geometry, material)
	scene.add(line);
	renderer.render(scene, camera);
}

/*
** ���ŏ��Ɉ�x�������s����֐�
*/
function threeStart() {
	initThree();	// �����_���[���쐬
	viewFPS();		// FPS�̕\��
	initCamera2(0, 0, cam_pos_z);	// �J����������
	initScene();	// �V�[��������
	initLight2();	// ���C�g������
	initObject();	// �I�u�W�F�N�g������
	renderer.clear();	// �����_���[������
	render();		// �����_�����O
};

// �����������̎�ނ�ς���
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

// �œK�Ȓl�ɃZ�b�g
function setLorenz_equation() {
	cam_pos_z = 90;	// �J�����̈ʒu��ύX
	p_sc = 3;	// �X�t�B�A�̃T�C�Y��ύX
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
** �L�[�{�[�h�������̃C�x���g
*/
document.onkeydown = function(e) { 
	// ���������L�[�̃L�[�R�[�h���擾 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90�i0~9, a~z�j�̏ꍇ�͕����ɕϊ�
		keycode = String.fromCharCode(keycode).toUpperCase();
	};

	switch(keycode){
		case "Z":
		changeScreen();
		break;
	};
};

// �����l�����&�t�H�[�J�X�����킹��
window.addEventListener('load', function() {
	document.getElementById("skip").value = 1;
	setLorenz_equation();
	runge_kutta_start();
}, false);