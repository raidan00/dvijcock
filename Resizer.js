export default class {
	constructor(dcWorld){ 
		this.dcWorld = dcWorld;
		this.listener = ()=>{this.setSize()};
		window.addEventListener('resize', this.listener);
		this.resizeObserver = new ResizeObserver(this.listener);
		this.resizeObserver.observe(dcWorld.domEl);
	}
	setSize(){
		let rect = this.dcWorld.domEl.getBoundingClientRect();
		if(this.dcWorld.camera){
			this.dcWorld.camera.aspect = rect.width / rect.height;
			this.dcWorld.camera.updateProjectionMatrix();
		}
		this.dcWorld.renderer.setSize( rect.width, rect.height );
		this.dcWorld.renderer.setPixelRatio(window.devicePixelRatio);
	}
	destroy(){
		this.resizeObserver.disconnect();
		window.removeEventListener('resize', this.listener);
	}
}

