import * as THREE from 'three';
import ammoTmp from 'dvijcock/ammoTmp.js';

THREE.Object3D.prototype.addDcData = function(par = {}){
	if(!par.btShape){
		if(this.geometry.type === 'SphereGeometry'){
			par.btShape = new Ammo.btSphereShape(this.scale.x);
		}else if(this.geometry.type === 'BoxGeometry'){
			par.btShape = new Ammo.btBoxShape(ammoTmp.vec(this.scale.x*0.5, this.scale.y*0.5, this.scale.z*0.5));
		}else if(this.geometry.type === 'CylinderGeometry'){
			par.btShape = new Ammo.btCylinderShape(ammoTmp.vec(this.scale.x, this.scale.y*0.5, this.scale.z));
		}
	}
	par.btShape.setMargin(0.05);
	this.dcData = par;
}
export default {}
