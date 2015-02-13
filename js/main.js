var World = require('three-world'),
    THREE = require('three'),
    Controls = require('./kinetic-controls');

var worldWidth = 256, worldDepth = 256;

World.init({ambientLightColor: 0, renderCallback: function() { Controls.update(); }});
var cam = World.getCamera();
cam.position.set(0, 550, 1200);

var lightNE = new THREE.PointLight(0xffffff, 1, 2000),
    lightNW = lightNE.clone(),
    lightSE = lightNE.clone(),
    lightSW = lightNE.clone();

lightNE.position.set(-500, 550, -500);
lightNW.position.set( 500, 550, -500);
lightSE.position.set(-500, 550,  500);
lightSW.position.set( 500, 550,  500);

World.add(lightNE);
World.add(lightNW);
World.add(lightSE);
World.add(lightSW);

var anchor = new THREE.Object3D();
anchor.rotation.order = 'YXZ';
anchor.add(cam);
World.add(anchor);

Controls.init(cam, anchor, 0);

var xhr = new XMLHttpRequest();
xhr.onload = function() {
  var blocks = JSON.parse(this.responseText);
  for(var b=0; b<blocks.length; b++) {

    var geometry = new THREE.PlaneBufferGeometry( 125, 125, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var vertices = geometry.attributes.position.array;
    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
      vertices[ j + 1 ] = blocks[b][ i ];
    }
    var terrain = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
    terrain.position.set((b%8) * 125 - 500, 0, Math.floor(b/8) * 125 - 500);
    World.add(terrain);
  }
  console.log("Ready")
}
xhr.open('get', 'data.json', true);
xhr.send();

World.start();
