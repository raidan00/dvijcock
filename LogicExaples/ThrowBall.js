import { PerspectiveCamera, Mesh, BoxGeometry, MeshStandardMaterial } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import defaultLights from 'dvijcock/defaultLights.js';

export default class{
	constructor(){}
	init(){
		let dc = this.dcWorld;

		dc.camera = new PerspectiveCamera( 65, 1/*dc will set acpect*/, 0.1, 30000 );
		dc.camera.position.set(10,10,10);
		let controls = new OrbitControls(dc.camera, dc.renderer.domElement);
		controls.enablePan = false;

		dc.scene.add(defaultLights);
		const platform = new Mesh( new BoxGeometry( 10, 1, 10 ), new MeshStandardMaterial({color: 0x13d013}) );
		dc.scene.add(platform);
		const cube = new Mesh( new BoxGeometry( 1, 1, 1 ), new MeshStandardMaterial({color: 0x878787}) );
		cube.position.set(0,5,0)
		dc.scene.add(cube);
	}
	tickDispayFps(delta){
	}
	tick100Fps(delta){
	}
};
