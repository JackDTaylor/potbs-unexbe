import {APPROOT} from "../config";

function escapeHtml(text) {
	return (text)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}


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
pre:first-line {
	font-size: 125%;
	font-weight: bold;
}
a:visited, a:hover, a:link {
	color: #2296f3;
}
a:active {
	color: #5ca8d2;
}
.fancybox-is-open .fancybox-bg {
	opacity: 0.25 !important;
}
.fancybox-slide--iframe .fancybox-content {
	border-radius: 4px !important;
	overflow: hidden !important;
}
</style>
<div id="errorWrapper">
	<pre>${escapeHtml(view.error.stack)}</pre>
</div>

${view.devMode ? `
	<!--suppress JSUnresolvedLibraryURL -->
<script src="//code.jquery.com/jquery-3.3.1.min.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.css" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.js"></script>
	<script type="text/javascript">
		let pre = document.querySelector('pre');
		let regex = new RegExp('${RegExp.quote(APPROOT)}[^)\\\\n\\\\s]*', 'g');
		
		pre.innerHTML = pre.innerHTML.replace(regex, function(url) {
			let fullUrl = url;
			let pathUrl = url.replace('${APPROOT}', '');
		  
		  return '<a target="_blank" data-fancybox data-type="iframe" class="fancybox" data-src="/dmi/source?iframe&file='+fullUrl+'" href="/dmi/source?file='+fullUrl+'">' + pathUrl + '</a>';
		});
		
		$(function() {
			$('[data-fancybox]').fancybox({
				touch: false,
			});

//			$('a.fancybox').click(function() {
//				
//				return false;
//			});
		});
	</script>
` : ``}
`;