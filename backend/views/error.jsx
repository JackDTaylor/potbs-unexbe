export default view => `
<style>
body {
	margin: 0;
	background-color: #ce796a;
}
div {
	display: flex;
	justify-content: center;
	height: 100vh;
	align-items: center;
}

pre {
	display: inline-block;
	padding: 1em;
	border: 1px solid #ccc;
	border-radius: 3px;
	background-color: #fafafa;
	max-height: calc(80vh - 2em);
	overflow-y: auto;
	font-size: 15px;
}
</style>
<div id="errorWrapper">
	<pre>${view.error.stack}</pre>
</div>
`;