const fs = require('fs');
const webpack = require(`webpack`);


let major = fs.readFileSync(__dirname + '/../version/major').toString();
let minor = fs.readFileSync(__dirname + '/../version/minor').toString();
minor++;
fs.writeFileSync(__dirname + '/../version/minor', minor);

let buildNumber = 1;

// noinspection JSUnusedLocalSymbols
module.exports.UpgradeBuildNumber = class UpgradeBuildNumber {
	apply(compiler) {
		compiler.plugin('done', function() {
			fs.writeFileSync(__dirname + '/../version/build', buildNumber++);
		});
	};
};