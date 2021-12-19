import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

import Model from './model';

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha    : true,
});
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.z = 5;
camera.position.y = 1;


/*------------------------------
Mesh
------------------------------*/
// const geometry = new THREE.BoxGeometry(2, 2, 2);
// const material = new THREE.MeshBasicMaterial( {
//   color: 0x00ff00,
// } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls( camera, renderer.domElement );
controls.enabled = false;


/*------------------------------
Helpers
------------------------------*/
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );
//
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );


/*------------------------------
Models
------------------------------*/
const tRex = new Model({
  name      : 't-rex',
  file      : './models/t-rex.glb',
  scene     : scene,
  color1    : 'blue',
  color2    : 'pink',
  background: '#110048',
})

const clock = new THREE.Clock();

/*------------------------------
Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

  if (!tRex.isActive && tRex.particlesMaterial) {
    tRex.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }
};

animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize, false );


/*------------------------------
Mouse move
------------------------------*/
function onMouseMove({ clientX, clientY }) {

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, 0.2, -0.2, clientX),
    x: gsap.utils.mapRange(0, window.innerWidth, 0.2, -0.2, clientY),
  })
}

window.addEventListener('mousemove', onMouseMove)
