import DefaultCell from "./DefaultCell";

export default class DateCell extends DefaultCell {
	renderPlain(value) {
		if(value instanceof Date) {
			return value.format();
		}

		return super.renderPlain(value);
	}
}