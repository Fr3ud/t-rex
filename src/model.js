import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler  } from 'three/examples/jsm/math/MeshSurfaceSampler';

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

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
      this.geometry = this.mesh.geometry;

      // this.particlesMaterial = new THREE.PointsMaterial({
      //   color: 'tomato',
      //   size : 0.02,
      // })

      this.particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      const numParticles = 25000;
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3)

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();

        sampler.sample(newPosition);
        particlesPosition.set([
          newPosition.x,
          newPosition.y,
          newPosition.z,
        ], i * 3);

        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
      }

      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

      this.scene.add(this.particles);
    });
  }
}
