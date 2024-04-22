import "dvijcock/ammoImportFixed.js"
import { ammoTmpInit } from "dvijcock/ammoTmp.js"

export default ()=>{
	if(Ammo.ready) return Promise.resolve();
	else return Ammo().then(ammoTmpInit);
};
