import AbstractField from "./AbstractField";

export default class DefaultField extends AbstractField {
	renderField() {
		return <input value={this.value} />;
	}
}