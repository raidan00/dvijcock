import * as t from 'three';

export default {
	forward: 0,
	right: 0,
	angle: undefined,
	touchFactor: 0,
	moveForward(val){
		this.setDirection(val, Math.sign(this.right));
	},
	moveRight(val){
		this.setDirection(Math.sign(this.forward), val);
	},
	setDirection(forward, right){
		const vec = new t.Vector2(forward, right);
		vec.normalize();
		this.forward = vec.x;
		this.right = vec.y;
		this.angle = vec.angle();
		this.touchFactor = 1;
	},
}
