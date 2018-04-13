export default () => {
	RegExp.quote = function(string) {
		return (string+'').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&');
	};

	RegExp.pathStart = function(pathStart) {
		return new RegExp('^' + RegExp.quote(pathStart));
	};
}