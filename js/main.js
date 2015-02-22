var World = require('three-world'),
    THREE = require('three'),
    Leap  = require('leapjs'),
    Controls = require('./kinetic-controls');

var worldWidth = 256, worldDepth = 256;

World.init({ambientLightColor: 0, farPlane: 4000, renderCallback: function() { Controls.update(); }});
var cam = World.getCamera();
cam.position.set(0, 250, 1200);

var light = new THREE.PointLight(0xffffee, 1, 4000);
light.position.set(0, 500 , 0);
World.add(light);

var anchor = new THREE.Object3D();
anchor.rotation.order = 'YXZ';
anchor.add(cam);
World.add(anchor);

Controls.init(cam, anchor, 0);

var material = new THREE.MeshLambertMaterial(),
    terrain  = new THREE.Object3D();

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

    if(window.location.hash == "#quilted") {
      var mat = material.clone();
      mat.color.setRGB(Math.random(), Math.random(), Math.random());
      var terrainTile = new THREE.Mesh(geometry, mat);
    } else {
      var terrainTile = new THREE.Mesh(geometry, material);
    }

    terrainTile.scale.set(2,2,2);
    terrainTile.position.set((b%8) * 250 - 1000, 0, Math.floor(b/8) * 250 - 1000);

    terrain.add(terrainTile);
  }

  World.add(terrain);

  console.log('Ready');

  var loader = document.getElementById('loading');
  loader.parentNode.removeChild(loader);
  World.getRenderer().domElement.style.display = 'block';
}
xhr.open('get', 'data.json', true);
xhr.send();

World.start();

var previousHandPos = null, previousRotation = null;

var Z_AXIS_VECTOR = new THREE.Vector3(0, 0, 1),
    directionVector = new THREE.Vector3();

Leap.loop(function(frame){
  if(frame.hands.length > 0) {
    var hand = frame.hands[0];
    if(hand.pinchStrength < 0.75) {
      previousHandPos  = null;
      previousRotation = null;
    } else {

      directionVector.set(
        hand.direction[0],
        hand.direction[1],
        hand.direction[2]
      );

      if(previousHandPos === null) {
        previousHandPos = hand.palmPosition;
      }

      if(previousRotation === null) {
        previousRotation = Z_AXIS_VECTOR.angleTo(directionVector) / 10;
      }

      terrain.position.x += (hand.palmPosition[0] - previousHandPos[0]);
      terrain.position.y += (hand.palmPosition[1] - previousHandPos[1]);
      terrain.position.z += (hand.palmPosition[2] - previousHandPos[2]);

      var angle = Z_AXIS_VECTOR.angleTo(directionVector) / 10;
      terrain.rotation.y += angle - previousRotation;

      previousHandPos  = hand.palmPosition;
      previousRotation = angle;
    }
  }
});
