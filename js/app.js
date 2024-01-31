import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import fragment from './shader/fargment.glsl';
import vertex from './shader/vertex.glsl';

var colors = require('nice-color-palettes');
let ind = Math.floor(Math.random() * colors.length);
// ind = 19;
let palette = colors[ind];

/***
 * Comment below palette array for using nice-color-palettes
 */
palette = ["#0033ff", "#6f3437", "#b8fff4", "#66d1ff", "#352fe0"]

palette = palette.map((color) => new THREE.Color(color))

console.log(palette)

export default class Sketch {
  constructor(option) {
    this.scene = new THREE.Scene();

    this.container = option.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    
    this.camera = new THREE.PerspectiveCamera(70,this.width / this.height,0.01,10);
    this.camera.position.set(0, 0, 0.2)
    
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true;
    this.container.appendChild(this.renderer.domElement);

    this.time = 0;

    this.addObject();
    this.render();
    this.resize()
  }

  resize() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  addObject() {
    this.geometry = new THREE.PlaneGeometry(2.5, 2.5, 300, 300);
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        uColor: { value: palette },
        resolution: { value: new THREE.Vector4() }
      },
      // wireframe: true,
      // transparent: true,
      fragmentShader: fragment,
      vertexShader: vertex
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  render() {
    // this.controls.update();
    this.time += 0.0002;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container"),
});

