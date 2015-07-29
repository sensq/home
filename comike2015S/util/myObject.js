var myObj = function(){}

/*
** 床
*/
myObj.floor = function() {
	var geoFloor = new THREE.PlaneGeometry(300, 300);
	var matFloor = new THREE.MeshPhongMaterial({
		color: 0xcccccc,
		ambient: 0x999999,
		specular: 0x888888,
		side: 0,
	});
	var meshFloor = new THREE.Mesh(geoFloor, matFloor);
	meshFloor.rotation.x = -(Math.PI/2.0);
	meshFloor.position = new THREE.Vector3(0, -10, 0);
	meshFloor.castShadow = true;
	meshFloor.receiveShadow = true;
	return meshFloor;
}

/*
** スカイボックス（キューブ版）
*/
myObj.skyboxCube = function(){
	var matSky = new THREE.MeshPhongMaterial({
		color: 0x00aaff,
		ambient: 0xaaaaff,
		side: 2
	});
	var geoSky = new THREE.CubeGeometry(600, 600, 600);
	var meshSkyCube = new THREE.Mesh(geoSky, matSky);
	meshSkyCube.receiveShadow = true;
	return meshSkyCube;
}

/*
** スカイボックス（スフィア版）
*/
myObj.skyboxSphere = function(){
	var matSky = new THREE.MeshPhongMaterial({
		color: 0x00aaff,
		ambient: 0xaaaaff,
		side: 2
	});
	var geoSky = new THREE.SphereGeometry(600, 33, 33);
	var meshSkySphere = new THREE.Mesh(geoSky, matSky);
	meshSkySphere.receiveShadow = true;
	return meshSkySphere;
}

/*
** 平面分割
*/
myObj.segmentPlane = function(width, height, color1, color2){
	this.width = width || 5;	// 水平方向の数
	this.height = height || 5;	// 垂直方向の数
	this.color1 = color1 || 0xffffff;
	this.color2 = color2 || 0x000000;
	var geometry = new THREE.PlaneGeometry(this.width, this.height, this.width, this.height);
	var material = new THREE.MeshPhongMaterial({
		vertexColors: THREE.VertexColors,
		side: 2
	});
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	this.mesh = new THREE.Mesh(geometry, material);

	for(var j=0; j<this.height; j++){
		for(var i=0; i<2*this.width; i+=2){
			if((i%4==0 & j%2!=0) | (i%4!=0 & j%2==0)){
				this.mesh.geometry.faces[2*this.width*j + i].color.setHex(this.color2);
				this.mesh.geometry.faces[2*this.width*j + i+1].color.setHex(this.color2);
			}else{
				this.mesh.geometry.faces[2*this.width*j + i].color.setHex(this.color1);
				this.mesh.geometry.faces[2*this.width*j + i+1].color.setHex(this.color1);
			}
			this.mesh.geometry.colorsNeedUpdate = true;
		}
	}
	// 任意の位置の色を変える
	this.change = function(xNumber, yNumber, color, tri){
		this.color = color || 0x000000;
		this.tri = tri || false;
		this.mesh.geometry.faces[2*this.width*yNumber + 2*xNumber].color.setHex(this.color);
		if(!tri){
			this.mesh.geometry.faces[2*this.width*yNumber + 2*xNumber+1].color.setHex(this.color);
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	return this;
}

/*
** キューブ分割
*/
myObj.segmentCube = function(width, height, depth, widthSegments, heightSegments, depthSegments){
	this.width = width || 3;
	this.height = height || 3;
	this.depth = depth || 3;
	this.widthSegments = widthSegments || this.width;
	this.heightSegments = heightSegments || this.height;
	this.depthSegments = depthSegments || this.depth;

	var geometry = new THREE.CubeGeometry(this.width, this.height, this.depth, this.widthSegments, this.heightSegments, this.depthSegments);
	var material = new THREE.MeshPhongMaterial({
		vertexColors: THREE.VertexColors,
		side: 2
	});
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	this.mesh = new THREE.Mesh(geometry, material);

	// 一つの面を一色で塗り潰す
	this.fill = function(offset, jMax, iMax, color){
		this.color = color || 0x000000;
		for(var j=0; j<jMax; j++){
			for(var i=0; i<2*iMax; i+=2){
				this.mesh.geometry.faces[offset + 2*iMax*j + i].color.setHex(this.color);
				this.mesh.geometry.faces[offset + 2*iMax*j + i+1].color.setHex(this.color);
			}
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	// 右面
	var offset = 0;
	this.fill(offset, this.heightSegments, this.depthSegments, 0xff0000);
	// 左面
	offset = 2 * this.heightSegments * this.depthSegments;
	this.fill(offset, this.heightSegments, this.depthSegments, 0x00ff00);
	// 上面
	offset = 4 * this.heightSegments * this.depthSegments;
	this.fill(offset, this.depthSegments, this.widthSegments, 0x0000ff);
	// 下面
	offset = (4 * this.heightSegments * this.depthSegments) + (2 * this.widthSegments * this.depthSegments);
	this.fill(offset, this.depthSegments, this.widthSegments, 0xff00ff);
	// 前面
	offset = (4 * this.heightSegments * this.depthSegments) + (4 * this.widthSegments * this.depthSegments);
	this.fill(offset, this.heightSegments, this.widthSegments, 0xffff00);
	// 後面
	offset = (4 * this.heightSegments * this.depthSegments) + (4 * this.widthSegments * this.depthSegments) + (2 * this.widthSegments * this.heightSegments);
	this.fill(offset, this.heightSegments, this.widthSegments, 0x00ffff);

	// 任意の位置の色を変える
	this.change = function(faceNumber, xNumber, yNumber, color, tri){
		this.color = color || 0x000000;
		this.tri = tri || false;

		var offset, iMax;
		// 面によって補正
		switch(faceNumber){
			case 0:
			offset = 0;
			iMax = this.depthSegments;
			break;
			case 1:
			offset = 2 * this.heightSegments * this.depthSegments;
			iMax = this.depthSegments;
			break;
			case 2:
			offset = 4 * this.heightSegments * this.depthSegments;
			iMax = this.widthSegments;
			break;
			case 3:
			offset = (4 * this.heightSegments * this.depthSegments) + (2 * this.widthSegments * this.depthSegments);
			iMax = this.widthSegments;
			break;
			case 4:
			offset = (4 * this.heightSegments * this.depthSegments) + (4 * this.widthSegments * this.depthSegments);
			iMax = this.widthSegments;
			break;
			case 5:
			offset = (4 * this.heightSegments * this.depthSegments) + (4 * this.widthSegments * this.depthSegments) + (2 * this.widthSegments * this.heightSegments);
			iMax = this.widthSegments;
			break;
		}
		this.mesh.geometry.faces[offset + 2*iMax*yNumber + 2*xNumber].color.setHex(this.color);
		if(!tri){
			this.mesh.geometry.faces[offset + 2*iMax*yNumber + 2*xNumber+1].color.setHex(this.color);
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	return this;
}

/*
** スフィア分割
*/
segmentSphere = function(radius, widthSegments, heightSegments, color){
	this.color = color || 0x000000;
	this.radius = radius || 5;
	this.widthSegments = widthSegments || 30;
	this.heightSegments = heightSegments || 30;

	var geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
	var material = new THREE.MeshPhongMaterial({
		vertexColors: THREE.VertexColors,
		side: 2
	});
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	this.mesh = new THREE.Mesh(geometry, material);

	for(var j=0; j<this.heightSegments; j++){
		if(j==0){
			// 頂点
			for(var i=0; i<this.widthSegments; i+=2){
				this.mesh.geometry.faces[i].color.setHex(this.color);
				this.mesh.geometry.faces[i+1].color.setHex(this.color);
			}
		}else if(j<this.heightSegments-1){
			// 側面
			for(var i=0; i<2*this.widthSegments; i+=2){
				this.mesh.geometry.faces[(2*j-1)*this.widthSegments + i].color.setHex(this.color);
				this.mesh.geometry.faces[(2*j-1)*this.widthSegments + i+1].color.setHex(this.color);
			}
		}else{
			// 底面
			for(var i=0; i<this.widthSegments; i+=2){
				this.mesh.geometry.faces[(2*j-1)*this.widthSegments + i].color.setHex(this.color);
				if(this.widthSegments%2){
					this.mesh.geometry.faces[(2*j-1)*this.widthSegments + i-1].color.setHex(this.color);
				}else{
					this.mesh.geometry.faces[(2*j-1)*this.widthSegments + i+1].color.setHex(this.color);
				}
			}
		}
	}

	// 任意の位置の色を変える
	this.change = function(xNumber, yNumber, color, tri){
		this.color = color || 0x000000;
		this.tri = tri || false;
		if(yNumber == 0){
			// 頂点
			this.mesh.geometry.faces[xNumber].color.setHex(this.color);
		}else if(yNumber<this.heightSegments-1){
			// 側面と底面
			this.mesh.geometry.faces[(2*yNumber-1)*this.widthSegments + 2*xNumber].color.setHex(this.color);
			if(!tri){
				this.mesh.geometry.faces[(2*yNumber-1)*this.widthSegments + 2*xNumber+1].color.setHex(this.color);
			}
		}else{
			// 底面
			this.mesh.geometry.faces[(2*yNumber-1)*this.widthSegments + xNumber].color.setHex(this.color);
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	return this;
}
