<?php
define('APP', dirname(dirname(__DIR__)) . '/application');
define('ROOT', __DIR__);
define('BASE', '/dmi');

require_once 'dpr.php';

if(is_developer() == false) {
	header('Location: /dmi/tools/');
	exit;
}

$files = glob(ROOT . '/tools/*.php');
$tools = [];

foreach($files as $file) {
	$name = basename($file, '.php');

	$tools[$name] = $file;
}

$request = preg_replace('#^/dmi#', '', pos(explode('?', $_SERVER['REQUEST_URI'])));
$request = trim($request, '/');
ob_start();
?>
<!DOCTYPE html>
<html class="no-js" lang="">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge" />
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>Utils</title>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css" type="text/css" />
	<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.css"  media="screen" />

	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.js"></script>
</head>
<body>

<!-- Page Contents -->
<div class="pusher">
	<div class="ui vertical stripe segment">
		<?if($request && isset($tools[$request])):?>
			<?php
			/** @noinspection PhpIncludeInspection */
			include_once ROOT . "/tools/{$request}.php";
			?>
		<?else:?>
			<div class="ui text container" style="margin-top: 12.5vh;">
				<h3 class="ui header">Tools</h3>

				<div class="ui relaxed divided list">
					<?foreach($tools as $tool => $file):?>
					<div class="item">
						<i class="large file outline middle aligned icon"></i>
						<div class="content">
							<a class="header" href="/dmi/<?=$tool?>/"><?=$tool?></a>
							<small class="description"><?=date('Создан d.m.Y в H:i', filemtime($file))?></small>
						</div>
					</div>
					<?endforeach?>
				</div>
			</div>
		<?endif?>
	</div>
</div>
</body>
</html>