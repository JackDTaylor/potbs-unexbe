import Control from "./Control";
import FormContext from "./FormContext";

export default class Form extends Control {
	@prop isArray;

	get defaultControlledValue() {
		return this.isArray ? [] : {};
	}

	renderForm() {
		return this.props.children;
	}

	contextualRender() {
		console.log('new formState:', this.value);
		return (
			<div {...this.cls}>
				<FormContext.Provider value={this}>
					<pre>{
						JSON.stringify(this.value)
							.replace(/,"/g, ',\n"')
							.replace(/^{/g, '')
							.replace(/}$/g, '')
					}</pre>
					<hr />
					<ErrorBoundary>
						{this.renderForm()}
					</ErrorBoundary>
				</FormContext.Provider>
			</div>
		);
	}
}