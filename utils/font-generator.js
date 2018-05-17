const Chokidar = require('chokidar');
const Util = require('util');
const ExecuteCommand = Util.promisify(require('child_process').exec);

const assetsPath = 'public/assets';
const executable = 'node_modules/.bin/icon-font-generator';
const name = 'custom-icons';

const compileOnly = (process.argv.indexOf('--compile-only') >= 0);

const command = `${executable} ${assetsPath}/icons/*.svg -o ${assetsPath}/fonts/ -n ${name} -s --normalize`;

const watcher = Chokidar.watch(`${assetsPath}/icons`, {ignored: /^\./, persistent: !compileOnly});
let timeoutId = null;

const executor = async function() {
	timeoutId = null;

	try {
		let result = await ExecuteCommand(command);

		console.warn(new Date().toLocaleTimeString() + ': IFG executed');

		result.stdout && console.log(result.stdout);
		result.stderr && console.log(result.stderr);
	} catch(e) {
		console.error('Error:', e);
	}
};

const handler = function(path) {
	if(timeoutId) {
		clearTimeout(timeoutId);
	}

	timeoutId = setTimeout(executor, 250);
};

watcher
	.on('add', handler)
	.on('change', handler)
	.on('unlink', handler)
	.on('error', e => console.error(e));
