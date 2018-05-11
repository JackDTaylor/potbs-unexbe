import AbstractField from "./AbstractField";
import DateTimeControl from "../../Common/Form/Controls/DateTimeControl";

export default class DateField extends AbstractField {
	renderField() {
		return (
			<DateTimeControl
				name={this.property.name}
				label={this.property.label}
			/>
		);
	}
}