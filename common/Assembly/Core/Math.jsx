/** @return {number} */
Math.degToRad = function(n) {
	return parseFloat(n) * Math.PI / 180;
};

/** @return {number} */
Math.radToDeg = function(n) {
	return parseFloat(n) * 180 / Math.PI;
};

/** @return {number} */
Math.clamp = function(n, a, b) {
	if(a > b) {
		[a,b] = [b,a];
	}

	return Math.max(a, Math.min(n, b));
};

/** @return {number} */
Math.clamp01 = function(n) {
	return Math.clamp(n, 0, 1)
};