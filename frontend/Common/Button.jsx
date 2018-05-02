import {Button as MuiButton, Tooltip} from "material-ui";

export default class Button extends ReactComponent {
	render() {
		const {className, tooltip, ...props} = this.props;

		let button = <MuiButton {...this.cls} {...props} />;

		if(tooltip) {
			return <Tooltip title={tooltip}>{button}</Tooltip>;
		}

		return button;
	}
}