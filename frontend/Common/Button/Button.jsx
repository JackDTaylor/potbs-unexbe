import {Button as MuiButton, Tooltip} from "material-ui";

export default class Button extends ReactComponent {
	@prop tooltip;

	get buttonProps() {
		return this.props;
	}

	renderBase() {
		const {className, tooltip, ...props} = this.props;
		return <MuiButton {...this.cls} {...props} />;
	}

	render() {
		if(this.tooltip) {
			return <Tooltip title={this.tooltip}>{this.renderBase()}</Tooltip>;
		}

		return this.renderBase();
	}
}