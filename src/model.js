import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default class Model {
  constructor({ name, file, scene }) {
    this.name = name;
    this.file = file;
    this.scene = scene;

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./draco/');
    this.loader.setDRACOLoader(this.dracoLoader);

    this.init();
  }

  init() {
    this.loader.load(this.file, response => {
      this.mesh = response.scene.children[0];
      this.material = new THREE.MeshBasicMaterial({
        color: 'tomato',
        wireframe: true,
      });
      this.mesh.material = this.material;

      this.scene.add(this.mesh);
    });
  }
}
