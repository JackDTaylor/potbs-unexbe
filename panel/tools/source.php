<!--suppress ALL -->
<?php
$iframe = isset($_GET['iframe']);
$result = '';
$pointer = false;
$lts = 10;

$file_req = $_POST['file'] ?: $_GET['file'] ?: false;

if($file_req) {
	list($file, $line, $pos) = explode(':', $file_req);

	if(is_readable($file)) {
		$result = file_get_contents($file);

		if($line) {
			$start = $line - $lts - 1;
			$length = $lts * 2 + 1;

			$start = $start < 0 ? 0 : $start;

			$lines = explode("\n", $result);
			$result = implode("\n", array_slice($lines, $start, $length));

			$pointer = ['line' => $line - $start - 1];

			if($pos) {
				$err_line = substr(pos(array_slice($lines, $line, 1)), 0, $pos);
				$tabs_count = strlen(preg_replace('#[^\t]#', '', $err_line));

				$pointer['pos'] = $pos + $tabs_count;
			}
		}
	}
}
?>
<html><head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/obsidian.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/javascript.min.js"></script>
<script src="/dmi/assets/highlightjs-line-numbers.custom.min.js"></script>
<style>
	<?if($iframe):?>
	.ui.vertical.stripe.segment {
		padding: 0;
	}
	body {
		background-color: #282B2E;
		max-height: 300px;
	}
	<?endif?>
	form {
		padding: 0 10px;
	}
	#result {
		position: absolute;
		width: 100%;
		<?if(!$iframe):?>
			top: 64px;
			height: calc(100vh - 64px);
		<?else:?>
			height: 100vh;
		<?endif?>
		overflow-y: auto;
		background-color: #282B2E;
	}

	#result > pre {
		margin: 0;
		z-index: 2;
		position: relative;
		tab-size: 2;
	}

	#result > pre > code {
		background-color: transparent;
		padding: 0;
	}

	<?if($pointer):?>
	#pointer {
		background-color: rgba(192,0,0, 0.33);
		width: 100%;
		height: 1em;
		top: <?=$pointer['line']?>em;
		position: absolute;
		font-size: 19px;
		user-select: none;
	}
	<?endif?>

	#pointer > .gutter {
		position: absolute;
		background-color: rgba(192,0,0, 0.1);
		color: transparent;
		padding-left: 5px;
		padding-right: 5px;
		z-index: 3;
		border-right: 3px solid #781d1f;
	}

	.hljs-ln td:nth-child(1) {
		padding-left: 5px;
		padding-right: 5px;
		background-color: rgba(0,0,0,0.5);
	}
	.hljs-ln td:nth-child(2) {
		padding-left: 2px;
		border-left: 3px solid #080809;
	}

	#pos {
		position: absolute;
		top: 1em;
		width: 8px;
		height: 5px;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAMAAADNLv/0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAk1BMVEUAAAD/o6P/AAD/sbH/fn7/iYn/eHj/bGz/Ojr/Fhb/GRn/QUH/////Ozv/Dg7/Dw//PDz/////6en/Ojr/EBD/EBD/ODj/Kyv/Cwv/CAj/LCz/KSn/Bwf/DAz/MTH/Dw//CAj/NTX/pKT/kZH/Ly//Bgb/Dg7/ICD/ERH/Kyv/lpb/f3//Kir/ICD/AAD/BAT///+DcVG7AAAALnRSTlMAAAAAAAAAAFTp6VECVuLfUAEDYezpWnTu+pKU++xv+vSFCguJ9fXO84AHCIbGTbwjugAAAAFiS0dEDIGzUWMAAABFSURBVAjXBcGFAYAwAAOw4jbc3R3K/9+RAJJsWrYjK4AqXI/0g1BDFCf8PqaZQF6wrOqGbYeewzjNy8oN+3FeunE/x/sDm3gGEOk0gCgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDQtMTVUMTQ6MjE6MTErMDI6MDD9YfjGAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTA0LTE1VDE0OjIxOjExKzAyOjAwjDxAegAAAABJRU5ErkJggg==);
		background-size: contain;
		background-repeat: no-repeat;
	}

	#phpstorm {
		opacity: 0.1;
		transition: opacity 0.15s ease-in;
		position: fixed;
		top: <?=$iframe ? '10px' : '74px'?>;
		right: 10px;
		background-color: #1968aa;
		color: white;
		border-radius: 5px;
		padding: 7px 15px;
		z-index: 1000;
	}

	#result:hover #phpstorm {
		opacity: 1;
	}
</style>
</head>
<body>
<?if(!$iframe):?>
<form method="post">
	<div class="ui input fluid focus">
		<input name="file" autocomplete="off" value="<?=$file_req?>" placeholder="/some/path/to/file:32:1">
	</div>
</form>
<?endif?>
<?if($result):?>
	<div id="result">
		<a id="phpstorm" href="phpstormfile://potbs.unexbe.ru<?=str_replace('/home/m/msecntj4/potbs.unexpectedbehavior.ru', '', $file_req)?>">Open in PHPStorm</a>

		<?if($pointer):?>
			<div id="pointer">
				<div class="gutter"><?=str_repeat('_', strlen($start + $lts))?></div>
				<?if($pointer['pos']):?><div id="pos" style="left: <?=number_format(($pointer['pos'] - 1) * 7.69)?>px"></div><?endif?>
			</div>
		<?endif;?>

		<pre><code class="javascript"><?=htmlspecialchars($result)?></code></pre>
	</div>
<?endif?>
<script>
	hljs.initHighlightingOnLoad();
	hljs.initLineNumbersOnLoad({
		startFrom: <?=$pointer ? $start : 1?>
	});

	setTimeout(function() {
		$('#pos').css('margin-left', $('.hljs-ln-code .hljs-ln-line').position().left);
		let maxWidth = $('.hljs-ln-numbers').toArray().map(e => $(e).width()).reduce((p,c)=>c>p?c:p, 0);

		$('#pointer .gutter').width(maxWidth - 1);
	}, 100);
</script>
</body></html>