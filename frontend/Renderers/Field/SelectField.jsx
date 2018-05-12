import AbstractField from "./AbstractField";
import SelectControl from "../../Common/Form/Controls/SelectControl";
import ArraySource from "../../Application/Data/Source/ArraySource";
import ModelSource from "../../Application/Data/Source/ModelSource";

export default class SelectField extends AbstractField {
	get isMultiple() {
		return this.property.type.isMultipleSelect;
	}

	get dataSource() {
		const link = this.property.link;

		if(link && link.model) {
			return new ModelSource(link.model);
		}

		return new ArraySource([
			{id:1,name:'tst'},
			{id:2,name:'tst2'},
			{id:3,name:'tst3'}
		]);
	}

	renderField() {
		return (
			<SelectControl
				name={this.property.name}
				label={this.property.label}
				multiple={this.isMultiple}
				dataSource={this.dataSource}
			/>
		);
	}
}