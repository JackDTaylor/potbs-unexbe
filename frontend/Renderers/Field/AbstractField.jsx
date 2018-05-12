export default class AbstractField extends ReactComponent {
	static CssClasses = ['Field'];

	@prop property;
	@prop width;

	renderField() {
		throw new Error('AbstractField renderer should not be used directly');
	}

	get fieldStyle() {
		let style = {};

		if(this.width) {
			style.width = this.width <= 1 ? `${this.width * 100}%` : this.width;
			style.flexGrow = 0;
		}

		return style;
	}

	render() {
		return (
			<div {...this.cls} style={this.fieldStyle}>{this.renderField()}</div>
		);
	}
}