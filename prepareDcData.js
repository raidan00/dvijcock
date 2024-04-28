import ammoTmp from 'dvijcock/ammoTmp.js';

export default function(objThree){
	if(objThree?.dcData?.btShape === true){
		if(objThree.geometry.type === 'SphereGeometry'){
			objThree.dcData.btShape = new Ammo.btSphereShape(objThree.scale.x);
		}else if(objThree.geometry.type === 'BoxGeometry'){
			objThree.dcData.btShape = new Ammo.btBoxShape(
				ammoTmp.vec(objThree.scale.x*0.5, objThree.scale.y*0.5, objThree.scale.z*0.5)
			);
		}else if(objThree.geometry.type === 'CylinderGeometry'){
			objThree.dcData.btShape = new Ammo.btCylinderShape(
				ammoTmp.vec(objThree.scale.x, objThree.scale.y*0.5, objThree.scale.z)
			);
		}
	}else if(objThree.userData.btShape === true){
		if(!objThree.dcData)objThree.dcData={};
		objThree.dcData.mass = objThree.userData.mass;

		if(objThree.name.includes("Sphere")){
			objThree.dcData.btShape = new Ammo.btSphereShape(objThree.scale.x);
		}else if(objThree.name.includes("Cube")){
			objThree.dcData.btShape = new Ammo.btBoxShape(
				ammoTmp.vec(objThree.scale.x, objThree.scale.y, objThree.scale.z)
			);
		}
	}
	objThree.dcData.btShape.setMargin(0.05);
}
