import AbstractField from "./AbstractField";
import Control from "../../Common/Form/Control";

export default class DefaultField extends AbstractField {
	renderField() {
		return (
			<Control
				name={this.property.name}
				label={this.property.label}
				multiline={this.property.type.isMultiline}
			/>
		);
	}
}