import AbstractCell from "./AbstractCell";

export default class JsonCell extends AbstractCell {
	renderPlain(value) {
		return JSON.stringify(value);
	}
}