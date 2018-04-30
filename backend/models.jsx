import * as FS from "fs";

let walkSync = function(dir, result) {
	let files = FS.readdirSync(dir).filter(file => file != 'models.jsx');

	result = result || [];
	files.forEach(file => {
		if(FS.statSync(dir + '/' + file).isDirectory()) {
			result = walkSync(dir + '/' + file, result);
		} else {
			result.push(dir + '/' + file);
		}
	});

	return result;
};

global.GetModel = function(code) {
	return ModelManager.get(code);
};

const path = __dirname + '/../models';

let modelFiles = [];
let modelMetafiles = [];

let metafileRegex = new RegExp(`\.${ModelMeta.Values.join('|')}\.jsx$`);

walkSync(path).forEach(p => {
	let file = p.replace(path, '');

	if(metafileRegex.test(file)) {
		modelMetafiles.push(file);
	} else {
		modelFiles.push(file)
	}
});

export const ModelFiles = modelFiles;
export const ModelMetafiles = modelMetafiles;
