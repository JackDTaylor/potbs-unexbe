import {IconButton as MuiIconButton} from "material-ui";
import Button from "./Button";

export default class IconButton extends Button {
	get buttonProps() {
		let {active, activeColor, ...props} = super.buttonProps;

		if(active) {
			props = addStyle(props, {
				color: activeColor || 'rgba(255,255,255, 0.85)'
			});
		}

		return props;
	}

	renderBase() {
		return <MuiIconButton {...this.buttonProps} />;
	}
}