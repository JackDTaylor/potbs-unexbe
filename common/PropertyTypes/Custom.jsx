/**
 * Price type
 * @type {Function}
 */
global.PropertyType.PRICE = class PRICE extends PropertyType.DECIMAL {
};

/**
 * Phone type
 * @type {Function}
 */
global.PropertyType.PHONE = class PHONE extends PropertyType.VARCHAR {
	static CellRenderer = CellRenderers.PhoneCell;
};