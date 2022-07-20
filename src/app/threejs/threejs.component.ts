import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.scss']
})
export class ThreejsComponent implements OnInit {

  constructor() { }

  

  
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  // Cube props
  @Input() public rotationSpeedX: number = 0.05;
  @Input() public rotationSpeedY: number = 0.01;
  @Input() public size = 200;
  // @Input() public texture = "/assets/texture.jpg";

  // Stage props
  @Input() public cameraZ = 400;
  @Input() public fieldOfView = 1;
  @Input() public nearClippingPlane = 1;
  @Input() public farClippingPlane = 1000;

  // Helper props
  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({color: 0xFF8001}));

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;


  ngOnInit(): void {
  }

  private initScene(): void {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.cube);

    // camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );

    this.camera.position.z = this.cameraZ;
  }
  
  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animateCube(): void {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  private startRenderingLoop(){
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    let component = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());

  }

  ngAfterViewInit(): void {
    this.initScene();
    this.startRenderingLoop();
  }

}
