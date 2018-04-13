export default () => {
	/** @return {number} */
	Math.degToRad = function(n) {
		return parseFloat(n) * Math.PI / 180;
	};

	/** @return {number} */
	Math.radToDeg = function(n) {
		return parseFloat(n) * 180 / Math.PI;
	};

}