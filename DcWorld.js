import * as t from 'three';
import renderer from "dvijcock/single/renderer.js"
import Resizer from "dvijcock/Resizer.js"
import ammoTmp from 'dvijcock/ammoTmp.js';
import config from "dvijcock/config.js";
import btShapeCreate from "dvijcock/btShapeCreate.js";

function runFuncArr(fucnArr, ...rest){
	for(let func of fucnArr){
		func(...rest);
	}
}
export default class {
	constructor(){ 
		this.renderer = renderer;
		this.scene = new t.Scene();
		this.initPhysicsWorld();
	}
	setDomElement(domEl){
		domEl.appendChild(this.renderer.domElement);
		this.domEl = domEl;
	}
	setLogic(gameLogic){
		this.gameLogic = gameLogic;
		gameLogic.dcWorld = this;
		gameLogic.init();

		this.resizer = new Resizer(this);
		this.renderer.render(this.scene, this.camera); 

		let clock = new t.Clock();
		let tickDispayFps =()=>{
			if(this.destroyed) return;
			let deltaTime = clock.getDelta();
			this.onBeforePhysics(deltaTime);
			this.updateDynamic(deltaTime);
			this.onAfterPhysics(deltaTime);
			this.onCollision();
			this.renderer.render( this.scene, this.camera );
			requestAnimationFrame(tickDispayFps);
		};
		tickDispayFps();
	}
	initPhysicsWorld(){
		this.collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
		this.dispatcher              = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
		this.overlappingPairCache    = new Ammo.btDbvtBroadphase();
		this.solver                  = new Ammo.btSequentialImpulseConstraintSolver();
		this.physicsWorld           = new Ammo.btDiscreteDynamicsWorld(
			this.dispatcher, this.overlappingPairCache,
			this.solver, this.collisionConfiguration
		);
	}
	addObjToPhysicsWorld(objThree){
		let pos = new t.Vector3();
		objThree.getWorldPosition(pos);
		let quat = new t.Quaternion();
		objThree.getWorldQuaternion(quat);
		let transform = ammoTmp.transform();
		transform.setOrigin(ammoTmp.vec(pos.x, pos.y, pos.z));
		transform.setRotation(ammoTmp.quat(quat.x, quat.y, quat.z, quat.w));
		let motionState = new Ammo.btDefaultMotionState(transform);
		let localInertia = ammoTmp.vec(0, 0, 0);

		objThree.dcData.btShape.setMargin(objThree.dcData.setMargin || config.setMargin);
		objThree.dcData.btShape.calculateLocalInertia(objThree.dcData.mass ?? 0, localInertia);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(
			objThree.dcData.mass ?? 0, motionState, objThree.dcData.btShape, localInertia
		);
		let rbody = new Ammo.btRigidBody(rbInfo);
		rbInfo.__destroy__();

		rbody.setFriction(objThree.dcData.setFriction || config.setFriction);
		rbody.setRestitution(objThree.dcData.setRestitution || config.setRestitution);
		rbody.setRollingFriction(objThree.dcData.setRollingFriction || config.setRollingFriction);

		if(objThree.dcData.kinematic){
			rbody.setActivationState(4);
			rbody.setCollisionFlags(2);
		}
		rbody.objThree = objThree;
		objThree.dcData.rbody = rbody;
		objThree.dcData.onBeforePhysics = [];
		objThree.dcData.onAfterPhysics = [];
		objThree.dcData.onCollision = [];

		let collisionGroup = objThree.dcData.collisionGroup || objThree.dcData.collisionFilter
			|| objThree.userData.collisionGroup || objThree.userData.collisionFilter
			|| config.collisionGroup || config.collisionFilter || 0b111111111111111111111111;
		let collisionMask = objThree.dcData.collisionMask || objThree.dcData.collisionFilter
			|| objThree.userData.collisionMask || objThree.userData.collisionFilter
			|| config.collisionMask || config.collisionFilter || 0b111111111111111111111111;
		this.physicsWorld.addRigidBody(rbody, collisionGroup, collisionMask);
	}
	add(objThree){
		if(!objThree.parent)this.scene.add(objThree);
		let addRecursion =(objThree)=>{
			if(objThree?.dcData?.btShape){
				this.addObjToPhysicsWorld(objThree)
			}else if(objThree?.dcData?.physicsShape || objThree?.userData?.physicsShape){
				btShapeCreate(objThree);
				this.addObjToPhysicsWorld(objThree)
			}else if(objThree?.children?.length){
				for(let i=0; i<objThree.children.length; i++){
					addRecursion(objThree.children[i]);
				}
			}
		}
		addRecursion(objThree);
	}
	remove(objThree){
		objThree.removeFromParent();
		let removeRecursion =(objThree)=>{
			this.destroyObj(objThree);
			for(let i=0; i<objThree.children.length; i++){
				removeRecursion(objThree.children[i]);
			}
		}
		removeRecursion(objThree);
	}
	onBeforePhysics(deltaTime){
		let objArr = [];
		this.scene.traverse((objThree)=>{
			if(objThree?.dcData?.onBeforePhysics?.length)objArr.push(objThree);
		});
		for(let objThree of objArr){
			runFuncArr(objThree.dcData.onBeforePhysics, deltaTime);
		}
	}
	onAfterPhysics(deltaTime){
		let objArr = [];
		this.scene.traverse((objThree)=>{
			if(objThree?.dcData?.onAfterPhysics?.length)objArr.push(objThree);
		});
		for(let objThree of objArr){
			runFuncArr(objThree.dcData.onAfterPhysics, deltaTime);
		}
	}
	updateDynamic(deltaTime){
		this.physicsWorld.stepSimulation(deltaTime, 10);
		let tmpTrans = new Ammo.btTransform();
		this.scene.traverse((objThree)=>{
			if(!objThree.dcData?.rbody)return;
			if(objThree.dcData.kinematic)return;
			let rigidBody = objThree.dcData.rbody;
			let ms = rigidBody.getMotionState();
			if(!ms)return;
			ms.getWorldTransform(tmpTrans);
			let p = tmpTrans.getOrigin();
			let q = tmpTrans.getRotation();
			objThree.position.set(p.x(), p.y(), p.z());
			objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

			objThree.parent.updateWorldMatrix(true, false);
			const m = new t.Matrix4();
			m.copy(objThree.parent.matrixWorld).invert();
			objThree.applyMatrix4(m);
			objThree.updateWorldMatrix(false, true);
		});
		tmpTrans.__destroy__();
	}
	onCollision(){
		let numManifolds = this.dispatcher.getNumManifolds();
		mainLoop: for ( let i = 0; i < numManifolds; i ++ ) {
			let contactManifold = this.dispatcher.getManifoldByIndexInternal( i );
			let numContacts = contactManifold.getNumContacts();
			for (let j = 0; j < numContacts; j++){
				let contactPoint = contactManifold.getContactPoint(j);
				let distance = contactPoint.getDistance();
				//if(distance > 0.0) continue;
				let rb0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
				let rb1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);
				if(rb0.objThree?.dcData?.onCollision?.length) runFuncArr(rb0.objThree.dcData.onCollision, rb1.objThree);
				if(rb1.objThree?.dcData?.onCollision?.length) runFuncArr(rb1.objThree.dcData.onCollision, rb0.objThree);
				continue mainLoop;
			}
		}
	}
	destroyObj(objThree){
		if(objThree?.geometry?.dispose) objThree.geometry.dispose();
		if(objThree?.material?.dispose) objThree.material.dispose();
		//in future add TEXTURE dispose;
		if(objThree?.dcData?.onDestroy)objThree.dcData.onDestroy();
		if(!objThree.dcData?.rbody)return;
		let rigidBody = objThree.dcData.rbody;
		this.physicsWorld.removeRigidBody(rigidBody);
		rigidBody.getMotionState().__destroy__();
		rigidBody.getCollisionShape().__destroy__();
		rigidBody.__destroy__();
		if(objThree.dcData.btTriangleMesh)objThree.dcData.btTriangleMesh.__destroy__();
	}
	destroy(){
		if(this.destroyed) return;
		this.destroyed = true;
		if(this.gameLogic.destroy)this.gameLogic.destroy();
		this.resizer.destroy();
		//clearInterval(this.updatePhysicsInterval);
		this.scene.traverse((objThree)=>{
			let notDestroy = false;
			if(objThree.dcData?.notDestroy)notDestroy=true;
			objThree.traverseAncestors((someParent)=>{
				if(someParent.dcData?.notDestroy)notDestroy=true;
			});
			if(notDestroy) return;
			this.destroyObj(objThree);
		});
		this.collisionConfiguration.__destroy__();
		this.dispatcher.__destroy__();
		this.overlappingPairCache.__destroy__();
		this.solver.__destroy__();
		this.physicsWorld.__destroy__();
	}
};
