RegExp.quote = function(string) {
	return (string+'').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&');
};

RegExp.pathStart = function(pathStart) {
	return new RegExp('^' + RegExp.quote(pathStart));
};

RegExp.prototype.execAll = function(...args) {
	let p, result = [];

	while(p = this.exec(...args) || result.length > 65535) {
		Object.keys(p).forEach(key => {
			if(key in result == false) {
				result[key] = [];
			}

			result[key].push(p[key]);
		});
	}

	return result;
};