import * as t from 'three';
import moveDirection from './moveDirection.js';
import MoveControler from './MoveControler.svelte'
import ammoTmp from "dvijcock/ammoTmp.js"

//controls is OrbitControls or Camera
export default class {
	constructor(target, controls, pushForce, maxSpeed){ 
		this.target = target;
		pushForce *= 10;
		this.target.dcData.rbody.setActivationState(4)
		this.onBeforePhysics =()=>{
			if(moveDirection.forward == 0 && moveDirection.right  == 0) return;
			if(controls.getAzimuthalAngle){
				var pushAng = moveDirection.angle - controls.getAzimuthalAngle() - Math.PI/2;
			}else if(controls.theta){
				var pushAng = moveDirection.angle - controls.theta - Math.PI/2;
			}else{
				console.error("MoveControllsr ERROR: no theta!!!");
			}
			var pushVec = new t.Vector2( Math.cos(pushAng), Math.sin(pushAng));
			let velocity = this.target.dcData.rbody.getLinearVelocity();
			let velVec = new t.Vector2(velocity.x(), velocity.z());
			if(velVec.length()>maxSpeed && pushVec.angleTo(velVec) < Math.PI/2){
				let velAngle = velVec.angle();
				let perpendicular = velAngle + Math.PI/2 * Math.sign(velAngle-pushAng);
				pushVec = new t.Vector2( Math.cos(perpendicular), Math.sin(perpendicular) );
				pushVec.multiplyScalar(Math.cos(pushAng-perpendicular));
			};
			pushVec.multiplyScalar(pushForce*moveDirection.touchFactor);
			this.target.dcData.rbody.applyCentralForce(ammoTmp.vec(pushVec.x, 0, pushVec.y));
		}
		this.target.dcData.onBeforePhysics.push(this.onBeforePhysics);
		this.div = document.createElement('div');
		this.div.className = 'dvijcock-conroller';
		document.body.appendChild(this.div);
		this.app = new MoveControler({
			target: this.div,
		})
	}
	setTarget(target){
		this.target.dcData.onBeforePhysics.splice(this.target.dcData.onBeforePhysics.indexOf(this.onBeforePhysics, 1));
		this.target = target;
		this.target.dcData.rbody.setActivationState(4)
		this.target.dcData.onBeforePhysics.push(this.onBeforePhysics);
	}
	destroy(){
		this.app.$destroy();
		this.div.remove();
		this.target.dcData.onBeforePhysics.splice(this.target.dcData.onBeforePhysics.indexOf(this.onBeforePhysics, 1));
	}
}
