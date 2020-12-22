function readSTLFile(evt) {
    var f = evt.target.files[0]; 
    if (f) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var dataURL  = reader.result;
			var res = loader.load( dataURL  );// defined in THREE.STLLoader
		}
		reader.readAsDataURL(f);
    }
}
function getFaceId(geometry,face)
{
	var nTriangles = geometry.faces.length;
	for(var t1 =0; t1 < nTriangles; t1++) {
		if (geometry.faces[t1] == face)
			return t1;
	}
	alert('Invalid face in getFaceId');
	return -1;
}

function getFace(geometry,faceId)
{
	return geometry.faces[faceId];
}

function getNormalOfTriangle(geometry,triangleId)
{
	var face = geometry.faces[ triangleId ];
	n = new THREE.Vector3(face.normal.x,face.normal.y,face.normal.z);
	n.normalize();
	if (n.length() == 0)
		console.log('Warning: face-normal is degenerate');
	return n;
}

function getAreaOfTriangle(geometry,triangleId)
{
	var face = geometry.faces[ triangleId ];
	var Pi = face.a;
    var Qi = face.b;
    var Ri = face.c;

    var P = new THREE.Vector3(geometry.vertices[Pi].x, geometry.vertices[Pi].y, geometry.vertices[Pi].z);
    var Q = new THREE.Vector3(geometry.vertices[Qi].x, geometry.vertices[Qi].y, geometry.vertices[Qi].z);
    var R = new THREE.Vector3(geometry.vertices[Ri].x, geometry.vertices[Ri].y, geometry.vertices[Ri].z);
        
	area = areaOfTriangle(P,Q,R);
	
	return area;
}

function getCenterOfTriangle(geometry,triangleId)
{
	var face = geometry.faces[ triangleId ];
	
	var Pi = face.a;
    var Qi = face.b;
    var Ri = face.c;

    var P = new THREE.Vector3(geometry.vertices[Pi].x, geometry.vertices[Pi].y, geometry.vertices[Pi].z);
    var Q = new THREE.Vector3(geometry.vertices[Qi].x, geometry.vertices[Qi].y, geometry.vertices[Qi].z);
    var R = new THREE.Vector3(geometry.vertices[Ri].x, geometry.vertices[Ri].y, geometry.vertices[Ri].z);
	
	var C = new THREE.Vector3( (P.x+Q.x+R.x)/3,(P.y+Q.y+R.y)/3,(P.z+Q.z+R.z)/3);
	return C;
}
function getGeometryInOFF(geometry) {
	// first create a string that represents the ASCII format of Geometry in OFF format
	var str = 'OFF \r\n' + geometry.vertices.length + ' ' + geometry.faces.length + ' 0 \r\n';
	var vertex,x,y,z;
	
	for(var i = 0; i < geometry.vertices.length; i++){
		x = geometry.vertices[i].x;
		y = geometry.vertices[i].y;
		z = geometry.vertices[i].z;
		str += '' +  x + ' ' + y + ' ' + z + ' \r\n';
	}
	for(var i = 0; i < geometry.faces.length; i++){
		var face = geometry.faces[ i ];
		str += '3 ' + face.a + ' ' + face.b + ' ' + face.c + '\r\n';
	}
    return str;
}

function getSTLGeometryAsStr(geometry) {
	// first create a string that represents the ASCII format of STL Geometry
	var str = 'solid Part \r\n';
	var nx,ny,nz,vertex;
	
	geometry.computeFaceNormals();// just to be sure
	for(var i = 0; i < geometry.faces.length; i++){
		var face = geometry.faces[ i ];
		nx = face.normal.x;
		ny = face.normal.y;
		nz = face.normal.z;
		str += '   facet normal ' +  nx + ' ' + ny + ' ' + nz + ' \r\n';
		str += '      outer loop\r\n';
		
		vertex = geometry.vertices[face.a];
		str += '         vertex ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + ' \r\n';
		vertex = geometry.vertices[face.b];
		str += '         vertex ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + ' \r\n';
		vertex = geometry.vertices[face.c];
		str += '         vertex ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + ' \r\n';
		
		str += '      endloop\r\n';
		str += '   endfacet\r\n';
	}
	str += 'endsolid \r\n';
    return str;
}

function volumeOfT(p1, p2, p3){
    var v321 = p3.x*p2.y*p1.z;
    var v231 = p2.x*p3.y*p1.z;
    var v312 = p3.x*p1.y*p2.z;
    var v132 = p1.x*p3.y*p2.z;
    var v213 = p2.x*p1.y*p3.z;
    var v123 = p1.x*p2.y*p3.z;
    return (-v321 + v231 + v312 - v132 - v213 + v123)/6.0;
}

function areaOfTriangle(p1, p2, p3)
{
    var p12 = new THREE.Vector3(p2.x-p1.x,p2.y-p1.y,p2.z-p1.z);
	var p13 = new THREE.Vector3(p3.x-p1.x,p3.y-p1.y,p3.z-p1.z);
	var c = new THREE.Vector3(); 
	c.crossVectors( p12, p13 );
    return (0.5*c.length());
}

function calculateArea(geometry)
{
	var areas = 0.0;

    for(var i = 0; i < geometry.faces.length; i++){
        var Pi = geometry.faces[i].a;
        var Qi = geometry.faces[i].b;
        var Ri = geometry.faces[i].c;

        var P = new THREE.Vector3(geometry.vertices[Pi].x, geometry.vertices[Pi].y, geometry.vertices[Pi].z);
        var Q = new THREE.Vector3(geometry.vertices[Qi].x, geometry.vertices[Qi].y, geometry.vertices[Qi].z);
        var R = new THREE.Vector3(geometry.vertices[Ri].x, geometry.vertices[Ri].y, geometry.vertices[Ri].z);
        areas += areaOfTriangle(P,Q,R);
    }

    return Math.abs(areas);
}

function calculateVolume(geometry)
{
    var volumes = 0.0;

    for(var i = 0; i < geometry.faces.length; i++){
        var Pi = geometry.faces[i].a;
        var Qi = geometry.faces[i].b;
        var Ri = geometry.faces[i].c;

        var P = new THREE.Vector3(geometry.vertices[Pi].x, geometry.vertices[Pi].y, geometry.vertices[Pi].z);
        var Q = new THREE.Vector3(geometry.vertices[Qi].x, geometry.vertices[Qi].y, geometry.vertices[Qi].z);
        var R = new THREE.Vector3(geometry.vertices[Ri].x, geometry.vertices[Ri].y, geometry.vertices[Ri].z);

		volumes += volumeOfT(P, Q, R);
    }
    return Math.abs(volumes);
}

function calculateVolumeMethod2(geometry)
{
    var volumes = 0.0;
	var area, zBar, nz,normal,Pi,Qi,Ri;
	
    for(var i = 0; i < geometry.faces.length; i++){
		area = getAreaOfTriangle(geometry,i);
		normal = getNormalOfTriangle(geometry,i);
		nz = normal.z;
        Pi = geometry.faces[i].a;
        Qi = geometry.faces[i].b;
        Ri = geometry.faces[i].c;
        zBar = (geometry.vertices[Pi].z + geometry.vertices[Qi].z + geometry.vertices[Ri].z)/3.0;
		volumes += area*nz*zBar;
    }
    return Math.abs(volumes);
}
function checkGeometry(geometry)
{
	var vol0 = calculateVolumeMethod2(geometry);
	
	var geom2 = geometry.clone();
	m = new THREE.Matrix4();
	m.makeRotationX(32.5*3.1415/180);// random rotation
	geom2.applyMatrix(m);
	
	m.makeRotationY(-11.25*3.1415/180);// random rotation
	geom2.applyMatrix(m);
	
	m.makeRotationZ(51.25*3.1415/180);// random rotation
	geom2.applyMatrix(m);	

	var vol1 = calculateVolumeMethod2(geom2);
	
	console.log(vol0 + ' ' + vol1 + ' ' + (vol0-vol1)/vol0);
}

function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 
    if (f) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var dataURL  = reader.result;
			loader.load( dataURL  );
		}
		reader.readAsDataURL(f);
    }
}
  
function buildAxes( length ) {

	var axes = new THREE.Object3D();

	axes.add( new THREE.ArrowHelper( new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), length,0x000000 ) ); // +X
	axes.add( new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), length,0x000000 ) ); // +Y
	axes.add( new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( 0, 0, 0 ), length,0x000000  ) ); // +Z
	

	var text3d = new THREE.TextGeometry( "x", {
		size: 0.15*length,
		height: 0.005*length,
		curveSegments: 2,
		font: "helvetiker"
	});
	var textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 , overdraw: true } );
	text = new THREE.Mesh( text3d, textMaterial );
	text.position = new THREE.Vector3(length,0,0);	
        text.rotation.x +=1.57;	
	axes.add(text);
	
	
	var text3d = new THREE.TextGeometry( "y", {
		size: 0.15*length,
		height: 0.005*length,
		curveSegments: 2,
		font: "helvetiker"
	});
	var textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 , overdraw: true } );
	text = new THREE.Mesh( text3d, textMaterial );
	text.position = new THREE.Vector3(0,length,0);	
        text.rotation.y +=1.57;	
        text.rotation.x +=1.57;	
	axes.add(text);
	

	var text3d = new THREE.TextGeometry( "z", {
		size: 0.15*length,
		height: 0.005*length,
		curveSegments: 2,
		font: "helvetiker"
	});
	var textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 , overdraw: true } );
	text = new THREE.Mesh( text3d, textMaterial );
	text.position = new THREE.Vector3(0,0,length);		
        //text.rotation.z -=1.57;	
        	
        text.rotation.y +=1.57;	
        text.rotation.x +=1.57;
	axes.add(text);
	
	
	return axes;
}

function findNumCommonNodes(geometry,triangle1,triangle2)
{
	var face1,face2;
	var nodes1 = new Array(3);
	var nodes2 = new Array(3);
	
	face1 = geometry.faces[triangle1];
	face2 = geometry.faces[triangle2];
	nodes1[0] = face1.a;
	nodes1[1] = face1.b;
	nodes1[2] = face1.c;
	
	nodes2[0] = face2.a;
	nodes2[1] = face2.b;
	nodes2[2] = face2.c;
	
	//if (triangle1 == 0) alert('' +triangle1 +': ' + ''+nodes1[0]+' '+nodes1[1]+' '+nodes1[2]+'; '+triangle2 +': '+nodes2[0]+' '+nodes2[1]+' '+nodes2[2]);
	var nCommon;
	nCommon=0;
	for (var i = 0; i < 3; i++) {
        for (var k =0; k < 3; k++) {
			if (nodes1[i] == nodes2[k])
				nCommon++;
        }
    }
	return nCommon;
}
function computeTriangleNeighbors(geometry)
{
	var nTriangles = geometry.faces.length;
	var nNeighbors  = new Array(nTriangles);
	var neighbors = new Array(nTriangles);// 3 per triangle, (t1,t2,t3,...)3 neighbours for each triangle, followed by next triangle
	for(var t1 =0; t1 < nTriangles; t1++) {
		nNeighbors[t1] = 0;
		neighbors[t1] = new Array(3);
		for(var i =0; i < 3; i++)
			neighbors[t1][i] = -1;//invalid neighbour
	}
	
	var nCommonNodes;
	for(var t1 =0; t1 < nTriangles; t1++) {
		if(nNeighbors[t1]==3)
			continue;//all three have been found
		for(var t2 = t1+1; t2 < nTriangles; t2++) {
			nCommonNodes = findNumCommonNodes(geometry,t1,t2);
			if (nCommonNodes == 2) {
				neighbors[t2][nNeighbors[t2]] = t1;
				nNeighbors[t2]++;
				neighbors[t1][nNeighbors[t1]] = t2;
				nNeighbors[t1]++;
				if(nNeighbors[t1]==3) 
					break;//all three have been found
			}
		}
	}
	var topologyOK;
	topologyOK = true;
	for(var t1 =0; t1 < nTriangles; t1++) 	{
		//str += t1 +': '  + nNeighbors[t1] + '\r\n';// for debugging
		if (nNeighbors[t1] < 3)
			topologyOK = false;
	}
	//alert(str);// for debugging
	if(topologyOK == false)
		console.log('STL topology appears to be incorrect ');
	return neighbors;
}

