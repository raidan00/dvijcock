<script>
	export let text = "not text";
</script>

<div class="main">
	<div class="text">
		{ text }
	</div>
</div>

<style>
	.main {
		display: flex;
		justify-content: center;
		z-index: 1;
		position: fixed;
		width: 100vw;
		top: 0px;
		left: 0px;
		text-align: center;
		pointer-events: none;
	}
	.text {
		font-size: 20px;
		background: #7edba5;
		width: 50vw;
		border: 2px solid black;
		border-radius: 5px;
		color: black;
		margin-top: 11vw;
	}
</style>

