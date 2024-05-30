import * as t from 'three';
import moveDirection from './moveDirection.js';
import MoveControler from './MoveControler.svelte'
import ammoTmp from "dvijcock/ammoTmp.js"

//controls is OrbitControls or Camera
export default class {
	constructor(objThree, controls, pushForce, maxSpeed){ 
		pushForce *= 10;
		objThree.dcData.rbody.setActivationState(4)
		function onBeforePhysics(){
			if(moveDirection.forward == 0 && moveDirection.right  == 0) return;
			if(controls.getAzimuthalAngle){
				var pushAng = moveDirection.angle - controls.getAzimuthalAngle() - Math.PI/2;
			}else{
				var pushAng = moveDirection.angle - Math.PI +
					new t.Vector2(controls.position.x, controls.position.z).angle();
			}
			var pushVec = new t.Vector2( Math.cos(pushAng), Math.sin(pushAng));
			let velocity = objThree.dcData.rbody.getLinearVelocity();
			let velVec = new t.Vector2(velocity.x(), velocity.z());
			if(velVec.length()>maxSpeed && pushVec.angleTo(velVec) < Math.PI/2){
				let velAngle = velVec.angle();
				let perpendicular = velAngle + Math.PI/2 * Math.sign(velAngle-pushAng);
				pushVec = new t.Vector2( Math.cos(perpendicular), Math.sin(perpendicular) );
				pushVec.multiplyScalar(Math.cos(pushAng-perpendicular));
			};
			pushVec.multiplyScalar(pushForce*moveDirection.touchFactor);
			objThree.dcData.rbody.applyCentralForce(ammoTmp.vec(pushVec.x, 0, pushVec.y));
		}
		objThree.dcData.onBeforePhysics.push(onBeforePhysics);
		this.onBeforePhysics = onBeforePhysics;
		this.objThree = objThree;
		this.div = document.createElement('div');
		this.div.className = 'dvijcock-conroller';
		document.body.appendChild(this.div);
		this.app = new MoveControler({
			target: this.div,
		})
	}
	destroy(){
		this.app.$destroy();
		this.div.remove();
		this.objThree.dcData.onBeforePhysics.splice(this.objThree.dcData.onBeforePhysics.indexOf(this.onBeforePhysics, 1));
	}
}
