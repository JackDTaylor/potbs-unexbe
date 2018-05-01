const fs = require('fs');
const webpack = require(`webpack`);
const versionDir = __dirname + '/../version';

const majorFile = versionDir + '/major';
const minorFile = versionDir + '/minor';
const buildFile = versionDir + '/build';

// noinspection JSUnusedLocalSymbols
module.exports.UpgradeBuildNumber = class UpgradeBuildNumber {
	constructor(upgradeMinor = false) {
		if(fs.existsSync(majorFile) == false) {
			fs.writeFileSync(majorFile, '1.0');
		}

		if(fs.existsSync(minorFile) == false) {
			fs.writeFileSync(minorFile, '0');
		}

		if(fs.existsSync(buildFile) == false) {
			fs.writeFileSync(buildFile, '0');
		}

		let major = fs.readFileSync(majorFile).toString();
		let minor = fs.readFileSync(minorFile).toString();

		if(upgradeMinor) {
			minor++;
			fs.writeFileSync(minorFile, minor);
		}

		this.buildNumber = 1;
	}

	apply(compiler) {
		let me = this;

		compiler.plugin('done', function() {
			fs.writeFileSync(buildFile, me.buildNumber++);
		});
	};
};