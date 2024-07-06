import * as t from 'three';
export default class {
	constructor(orbitControls){ 
		let domEl = orbitControls.domElement;
		this.orbitControls = orbitControls;
		this.saveNativeSet = domEl.setPointerCapture;
		this.saveNativeRelease = domEl.releasePointerCapture;
		domEl.setPointerCapture = ()=>{};
		domEl.releasePointerCapture = ()=>{};
		this.stop = (e)=>{
			if(!e.fakeEvent)e.stopPropagation()
		}
		domEl.addEventListener("pointerdown", this.stop, true);
		domEl.addEventListener("pointerup", this.stop, true);

		let pathX = 0;
		let pathY = 0;
		let startEv;
		function requestLock(e){
			startEv = e;
			domEl.requestPointerLock();
		};
		domEl.addEventListener("click", requestLock);

		let lockChange = (e)=>{
			if (document.pointerLockElement === domEl) {
				domEl.removeEventListener("click", requestLock);
				pathX = 0;
				pathY = 0;
				fakeDispatch("pointerdown");
				document.addEventListener("mousemove", updatePosition, false);
			} else {
				document.removeEventListener("mousemove", updatePosition, false);
				fakeDispatch("pointerup");
				domEl.addEventListener("click", requestLock);
			}
		}
		document.addEventListener("pointerlockchange", lockChange, false);
		function updatePosition(e) {
			pathX += e.movementX;
			pathY += e.movementY;
			fakeDispatch("pointermove");
		}
		domEl.addEventListener('wheel', (inEv) => {
			if(inEv.fakeEvent)return;
			fakeDispatch("pointerup", inEv);
			fakeDispatch("wheel", inEv);
			fakeDispatch("pointerdown", inEv);
		});
		function fakeDispatch(name, inEv){
			let opt = {
				clientX: startEv.clientX+pathX,
				clientY: startEv.clientY+pathY,
				pointerId: startEv.pointerId, 
			};
			let fakeEv = new PointerEvent(name, opt);
			fakeEv.deltaY = inEv?.deltaY || 0;
			fakeEv.fakeEvent = true;
			domEl.dispatchEvent(fakeEv);
		}
	}
	destroy(){
		this.orbitControls.domElement.setPointerCapture = this.saveNativeSet;
		this.orbitControls.domElement.releasePointerCapture = this.saveNativeRelease;
		this.orbitControls.domElement.removeEventListener("pointerdown", this.stop, true);
		this.orbitControls.domElement.removeEventListener("pointerup", this.stop, true);
	}
}
