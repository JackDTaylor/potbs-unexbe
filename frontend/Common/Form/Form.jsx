import Field from "./Field";
import FormContext from "./FormContext";

export default class Form extends Field {
	@prop isArray;

	get defaultControlledValue() {
		return this.isArray ? [] : {};
	}

	renderForm() {
		return this.props.children;
	}

	contextualRender() {
		return (
			<div {...this.cls}>
				<FormContext.Provider value={this}>
					{this.renderForm()}
				</FormContext.Provider>
			</div>
		);
	}
}