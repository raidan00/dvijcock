import * as t from 'three';
import ammoTmp from 'dvijcock/ammoTmp.js';

t.Object3D.prototype.getObjectsByUserDataProperty = function(name, value, result = []){
	if (this.userData[name] === value)result.push( this );
	const children = this.children;
	for (let i = 0; i < children.length; i ++) {
		children[i].getObjectsByUserDataProperty(name, value, result);
	}
	return result;
}
