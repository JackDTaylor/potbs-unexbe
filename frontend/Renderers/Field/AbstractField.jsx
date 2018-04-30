export default class AbstractField extends ReactComponent {
	static CssClasses = ['Field'];

	@prop value;
	@prop property;
	@prop displayGroup;
	@prop form;

	renderField() {
		throw new Error('AbstractField renderer should not be used directly');
	}

	render() {
		return (
			<div {...this.cls}>{this.renderField()}</div>
		);
	}
}