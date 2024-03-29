import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler  } from 'three/examples/jsm/math/MeshSurfaceSampler';

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

export default class Model {
  constructor({ name, file, scene, color1, color2, background }) {
    this.name = name;
    this.file = file;
    this.scene = scene;

    this.color1 = color1;
    this.color2 = color2;

    this.background = background;

    this.active = false;

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

      this.particlesMaterial = new THREE.ShaderMaterial({
        vertexShader  : vertex,
        fragmentShader: fragment,
        transparent   : true,
        depthTest     : false,
        depthWrite    : false,
        blending      : THREE.AdditiveBlending,
        uniforms      : {
          uColor1: { value: new THREE.Color(this.color1)},
          uColor2: { value: new THREE.Color(this.color2)},
          uTime  : { value: 0 },
          uScale : { value: 0 },
        },
      });

      const numParticles = 25000;
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);
      const particlesRandomness = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();

        sampler.sample(newPosition);
        particlesPosition.set([
          newPosition.x,
          newPosition.y,
          newPosition.z,
        ], i * 3);

        particlesRandomness.set([
          Math.random() * 2 - 1, // -1 -> 1
          Math.random() * 2 - 1, // -1 -> 1
          Math.random() * 2 - 1, // -1 -> 1
        ], i * 3);

        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3));
        this.particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRandomness, 3));
      }

      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

      this.scene.add(this.particles);

      gsap.to(this.particlesMaterial.uniforms.uScale, {
        value   : 1,
        duration: 0.6,
        ease    : 'power1.in'
      });

      gsap.fromTo(this.particles.rotation, {
        y: Math.PI,
      }, {
        y       : 0,
        duration: 0.6,
        ease    : 'power1.in'
      });

      gsap.to('body', {
        background: this.background,
        duration  : 0.8,
      });
    });
  }
}
