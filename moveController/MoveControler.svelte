<script>
	import * as t from 'three';
	import moveDirection from './moveDirection.js';

	window.addEventListener("keydown", (e) => {
		if (e.code == "KeyW") moveDirection.moveForward(1);
		if (e.code == "KeyS") moveDirection.moveForward(-1);
		if (e.code == "KeyD") moveDirection.moveRight(1);
		if (e.code == "KeyA") moveDirection.moveRight(-1);
	});
	window.addEventListener("keyup", (e) => {
		if (e.code == "KeyW") moveDirection.moveForward(0);
		if (e.code == "KeyS") moveDirection.moveForward(0);
		if (e.code == "KeyD") moveDirection.moveRight(0);
		if (e.code == "KeyA") moveDirection.moveRight(0);
	});

	let touchMain;
	let touchDirection;
	function touchmove(e){
		e.preventDefault();
		let rect = touchMain.getBoundingClientRect();
		let diffX = rect.x + rect.width/2 -  e.targetTouches[0].pageX;
		diffX *= -1;
		let diffY = rect.y + rect.height/2 -  e.targetTouches[0].pageY;
		moveDirection.setDirection(diffY, diffX);

		let maxForceEadge = rect.width/2*0.8;
		let vec = new t.Vector2(diffY, diffX);
		if(vec.length() > maxForceEadge){
			moveDirection.touchFactor = 1;
		}else{
			moveDirection.touchFactor = vec.length()/maxForceEadge;
		}

		touchDirection.style.left = e.targetTouches[0].pageX-touchDirection.offsetWidth/2+"px";
		touchDirection.style.top = e.targetTouches[0].pageY-touchDirection.offsetHeight/2+"px";
		touchDirection.style.visibility = 'visible';
	}
	function touchend(e){
		e.preventDefault();
		if(e.targetTouches.length == 0){
			moveDirection.setDirection(0, 0);
		}
		touchDirection.style.visibility = 'hidden';
	}
</script>

{#if 'ontouchstart' in document.documentElement}
	<div
		class="touchMain"
		bind:this={touchMain}
		on:touchstart={touchmove}
		on:touchmove={touchmove}
		on:touchend={touchend}
		on:touchcancel={touchend}
	></div>
	<div
		class="touchDirection"
		bind:this={touchDirection}
	 ></div>
{/if}

<style>
	.touchMain {
		position: absolute;
		left: 5px;
		bottom: 5px;
		z-index: 1;
		height: min(50vw, 50vh); ;
		width: min(50vw, 50vh); ;
		background: radial-gradient(#ffffff00, #ecec51e3);
		border-radius: 50%;
	}
	.touchDirection {
		pointer-events: none;
		position: absolute;
		height: min(25vw, 25vh);
		width: min(25vw, 25vh); ;
		z-index: 2;
		background: radial-gradient(#ffffff00, #6eec51);;
		border-radius: 50%;
		border: 3px solid #00ff16;
	}
</style>

