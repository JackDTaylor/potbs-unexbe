import DefaultCell from "./DefaultCell";

export default class LineArrayCell extends DefaultCell {
	renderArray(value) {
		return value.mapReact(item => (
			<___>{item}<br /></___>
		));
	}
}