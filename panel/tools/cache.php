<?php
$done = false;

if(isset($_GET['do'])) {
	$state_file = APP . '/data/cached-state.json';
	$restart_file = APP . '/tmp/restart.txt';

	if(is_writable($state_file)) {
		unlink($state_file);
		touch($restart_file);
	}

	$done = true;
}
?>
<div class="ui page active dimmer">
	<div class="content">
		<div class="ui segment">
			<?if($done):?>
				<h1 class="ui header">Готово</h1>
				<script type="text/javascript">
					setTimeout(fn => location.href = location.href.split('?')[0], 3000);
				</script>
			<?else:?>
				<a href="?do" class="ui huge button">Очистить весь кэш и перезапустить сервер</a>
			<?endif?>
		</div>
	</div>
</div>