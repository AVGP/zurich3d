var World = require('three-world'),
    THREE = require('three'),
    Controls = require('./kinetic-controls');

var worldWidth = 256, worldDepth = 256;

World.init({ambientLightColor: 0, renderCallback: function() { Controls.update(); }});
var cam = World.getCamera();
cam.position.set(0, 250, 1200);

var lightNE = new THREE.PointLight(0xff0000, 1, 1200),
    lightNW = lightNE.clone(),
    lightSE = lightNE.clone(),
    lightSW = lightNE.clone();

lightNE.position.set(-500, 250, -500);
lightNW.position.set( 500, 250, -500);
lightNW.color.setHex(0x00ff00);
lightSE.position.set(-500, 250,  500);
lightSE.color.setHex(0x0000ff);
lightSW.position.set( 500, 250,  500);
lightSW.color.setHex(0xffff00);

World.add(lightNE);
World.add(lightNW);
World.add(lightSE);
World.add(lightSW);

var anchor = new THREE.Object3D();
anchor.rotation.order = 'YXZ';
anchor.add(cam);
World.add(anchor);

Controls.init(cam, anchor, 0);

var material = new THREE.MeshLambertMaterial();

var xhr = new XMLHttpRequest();
xhr.onload = function() {
  var blocks = JSON.parse(this.responseText);
  for(var b=0; b<blocks.length; b++) {

    var geometry = new THREE.PlaneBufferGeometry( 125, 125, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var vertices = geometry.attributes.position.array;
    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
      vertices[ j + 1 ] = blocks[b][ i ] - 400;
    }
    var terrain = new THREE.Mesh(geometry, material);
    terrain.position.set((b%8) * 125 - 500, 0, Math.floor(b/8) * 125 - 500);
    World.add(terrain);
  }
  console.log('Ready');
  var loader = document.getElementById('loading');
  loader.parentNode.removeChild(loader);
  World.getRenderer().domElement.style.display = 'block';
}
xhr.open('get', 'data.json', true);
xhr.send();

World.start();
