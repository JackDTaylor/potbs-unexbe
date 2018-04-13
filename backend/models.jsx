import * as FS from "fs";

let walkSync = function(dir, result) {
	let files = FS.readdirSync(dir).filter(file => file != 'models.jsx');

	result = result || [];
	files.forEach((file) => {
		if (FS.statSync(dir + '/' + file).isDirectory()) {
			result = walkSync(dir + '/' + file, result);
		} else {
			result.push(dir + '/' + file);
		}
	});

	return result;
};

const path = __dirname + '/../models';
export const ModelFiles = walkSync(path).map(p => p.replace(path, ''));
