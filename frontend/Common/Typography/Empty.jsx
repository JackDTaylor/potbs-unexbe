import {Typography} from "material-ui";


export default class Empty extends ReactComponent {
	@prop padded;
	@prop centered;
	@prop variant;

	get style() {
		let style = {};

		if(this.padded) {
			style.padding = '1em 1.5em';
		}

		if(this.centered) {
			style.textAlign = 'center';
		}

		return style;
	}

	render() {
		return (
			<Typography {...this.cls} style={this.style} variant={this.variant || 'caption'}>
				{this.props.children || '(нет)'}
			</Typography>
		);
	}
}