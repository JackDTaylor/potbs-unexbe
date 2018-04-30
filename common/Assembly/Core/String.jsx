String.prototype.ucFirst = function() {
	return this.slice(0, 1).toUpperCase() + this.slice(1);
};
String.prototype.lcFirst = function() {
	return this.slice(0, 1).toLowerCase() + this.slice(1);
};

(original => (
	/** @param chars */
	String.prototype.trimLeft = function trimLeft(chars = null) {
		if(!chars) {
			return original.apply(this);
		}

		return this.replace(new RegExp(`^[${RegExp.quote(chars)}]+`, 'g'), '')
	}
))(String.prototype.trimLeft);

(original => (
	/** @param chars */
	String.prototype.trimRight = function trimRight(chars = null) {
		if(!chars) {
			return original.apply(this);
		}

		return this.replace(new RegExp(`[${RegExp.quote(chars)}]+$`, 'g'), '')
	}
))(String.prototype.trimRight);

String.prototype.trimStart = String.prototype.trimLeft;
String.prototype.trimEnd = String.prototype.trimRight;

/**
 * Trims the string
 * @param chars
 * @return {*}
 */
String.prototype.trim = function trim(chars = null) {
	return this.trimLeft(chars).trimRight(chars);
};

import "./StringCrypt";