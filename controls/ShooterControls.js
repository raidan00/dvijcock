import * as t from 'three';
export default class {
	constructor(target, camera, domEl){ 
		this.target = target;
		this.domEl = domEl;
		this.tpsOffset = new t.Vector3();
		this.fpsOffset = new t.Vector3();
		this.minRadius = -0.01;
		this.maxRadius = Infinity;

		let cameraOffset = camera.position.clone().sub(target.position); 
		this.spherical = new t.Spherical().setFromVector3(cameraOffset);

		if(!camera.dcData)camera.dcData = {};
		if(!camera.dcData.onAfterPhysics)camera.dcData.onAfterPhysics = [];
		camera.dcData.onAfterPhysics.push(()=>{
			let targetVec = this.target.position.clone();
			if(this.spherical.radius > 0){
				targetVec.add(this.tpsOffset);
			}else{
				targetVec.add(this.fpsOffset);
			}
			camera.position.copy(targetVec.clone().add(new t.Vector3().setFromSpherical(this.spherical)));
			camera.lookAt(targetVec)
			if(this.spherical.radius < 0){
				let q = new t.Quaternion().setFromAxisAngle(new t.Vector3(0,1,0), Math.PI);
				camera.quaternion.multiply(q)
			}
		});
		domEl.addEventListener( 'pointerdown', this.onPointerDown );

		let requestLock = ()=>{
			this.domEl.requestPointerLock();
		}
		let onMouseWheel = (e)=>{
			this.spherical.radius += e.deltaY/domEl.clientHeight*5;
			this.spherical.radius = t.MathUtils.clamp(this.spherical.radius, this.minRadius, this.maxRadius)
			if(Math.abs(this.spherical.radius) < 0.000001)this.spherical.radius = -0.000001;
		}
		let lockChange = ()=>{
			if (document.pointerLockElement === domEl) {
				domEl.addEventListener('pointermove', onPointerMove );
				domEl.addEventListener('wheel', onMouseWheel);
				this.locked = true;
			} else {
				domEl.removeEventListener('pointermove', onPointerMove );
				domEl.removeEventListener('wheel', onMouseWheel);
				this.locked = false;
			}
		}
		let onPointerMove = (e)=>{
			this.spherical.theta -= e.movementX / domEl.clientWidth*5;
			this.spherical.phi -= e.movementY / domEl.clientHeight*5;
			this.spherical.phi = t.MathUtils.clamp(this.spherical.phi, 0, Math.PI);
		}
		if( !('ontouchstart' in window)){
			domEl.addEventListener("pointerdown", requestLock);
			document.addEventListener("pointerlockchange", lockChange);
		}else{
			this.locked = true;
		}
	}
	onPointerDown(e){
	}
	onPointerMove(e){
	}
	destroy(){
	}
}
