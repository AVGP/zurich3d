var World    = require('three-world'),
    THREE    = require('three'),
    VREffect = require('./vr-effect'),
    Controls = require('./kinetic-controls');

var worldWidth = 256, worldDepth = 256;

function render() {
  Controls.update();
}

World.init({ambientLightColor: 0, farPlane: 4000, renderCallback: render});
var cam = World.getCamera();
cam.position.set(0, 700, 5500);

var light = new THREE.PointLight(0xffffee, 2, 5000);
light.position.set(0, 1200 , 0);
World.add(light);

var anchor = new THREE.Object3D();
anchor.rotation.order = 'YXZ';

var headlight = new THREE.SpotLight(0xffffff, 5, 5000);
headlight.position.set(0, 700, 5510); //copy(cam.position)
headlight.target = cam;
headlight.shadowMapWidth   = 1024;
headlight.shadowMapHeight  = 1024;
headlight.shadowCameraNear =  500;
headlight.shadowCameraFar  = 4000;
headlight.shadowCameraFov  =   30;

cam.add(headlight);
anchor.add(cam);
World.add(anchor);

anchor.rotation.y = -Math.PI / 2;

Controls.init(cam, false, 0);

window.anchor = anchor;

var material = new THREE.MeshLambertMaterial();

var xhr = new XMLHttpRequest();
xhr.onload = function() {
  var blocks = JSON.parse(this.responseText);
  for(var b=0; b<blocks.length; b++) {

    var geometry = new THREE.PlaneBufferGeometry( 100, 100, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var vertices = geometry.attributes.position.array;
    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
      vertices[ j + 1 ] = blocks[b][ i ] - 400;
    }

    if(window.location.hash == "#quilted") {
      var mat = material.clone();
      mat.color.setRGB(Math.random(), Math.random(), Math.random());
      var terrain = new THREE.Mesh(geometry, mat);
    } else var terrain = new THREE.Mesh(geometry, material);
    terrain.scale.set(10,10,10);
    terrain.position.set((b%8) * 1000 - 4000, 0, Math.floor(b/8) * 1000 - 4000);
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
