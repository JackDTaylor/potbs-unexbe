const fs = require('fs');
const webpack = require(`webpack`);
const versionDir = __dirname + '/../version';

if(fs.existsSync(versionDir + '/major') == false) {
	fs.writeFileSync(versionDir + '/major', '1.0');
}

if(fs.existsSync(versionDir + '/minor') == false) {
	fs.writeFileSync(versionDir + '/minor', '0');
}

if(fs.existsSync(versionDir + '/build') == false) {
	fs.writeFileSync(versionDir + '/build', '0');
}

let major = fs.readFileSync(versionDir + '/major').toString();
let minor = fs.readFileSync(versionDir + '/minor').toString();
minor++;
fs.writeFileSync(versionDir + '/minor', minor);

let buildNumber = 1;

// noinspection JSUnusedLocalSymbols
module.exports.UpgradeBuildNumber = class UpgradeBuildNumber {
	apply(compiler) {
		compiler.plugin('done', function() {
			fs.writeFileSync(__dirname + '/../version/build', buildNumber++);
		});
	};
};