import {IconButton as MuiIconButton, Tooltip} from "material-ui";

export default class IconButton extends ReactComponent {
	@prop tooltip;

	get buttonProps() {
		let props = this.props;

		if(props.active) {
			props = addStyle(props, {
				color: this.props.activeColor || 'rgba(255,255,255, 0.85)'
			});
		}

		return Object.without(props, [ 'active', 'activeColor' ]);
	}

	render() {
		let button = <MuiIconButton {...this.buttonProps} />;

		if(this.tooltip) {
			return <Tooltip title={this.tooltip}>{button}</Tooltip>;
		}

		return button;
	}
}