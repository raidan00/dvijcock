import ArrowAndInfrom from './ArrowAndInfrom.svelte'

export default class {
	constructor(text, model, from, to, height){ 
		let arrow = model;
		arrow.dcData = {
			onAfterPhysics: [ (delta)=>{
				arrow.position.set(from.position.x, height, from.position.z)
				arrow.lookAt(to.position)
			} ]
		}
		from.parent.add(arrow);
		this.arrow = arrow;

		this.div = document.createElement('div');
		this.div.className = 'dvijcock-arrow-and-infrom';
		document.body.appendChild(this.div);
		this.app = new ArrowAndInfrom({
			target: this.div,
			props: {
				text
			},
		})
	}
	destroy(){
		this.app.$destroy();
		this.div.remove();
		this.arrow.removeFromParent();
	}
}
