import ArrowHelper from './ArrowHelper.svelte'

export default class {
	constructor(text, model, from, to, height){ 
		let arrow = model.clone();
		arrow.dcData = {
			tickAfterPhysics(delta){
				arrow.position.set(from.position.x, height, from.position.z)
				arrow.lookAt(to.position)
			}
		}
		from.parent.add(arrow);

		this.div = document.createElement('div');
		this.div.className = 'dvijcock-arrow-helper';
		document.body.appendChild(this.div);
		this.app = new ArrowHelper({
			target: this.div,
			props: {
				text
			},
		})
	}
	destroy(){
		this.app.$destroy();
		this.div.remove();
	}
}
