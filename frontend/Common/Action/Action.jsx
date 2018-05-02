import {Tooltip} from "material-ui";
import IconButton from "../Button/IconButton";
import Link from "../Link";
import Button from "../Button/Button";

export default class Action extends ReactComponent {
	static RENDER_REGULAR = 'regular';
	static RENDER_ICON    = 'icon';

	@prop icon;
	@prop label;
	@prop onExecute;
	@prop buttonProps;
	@prop renderMode;

	get defaultIcon() {
		return 'alarm';
	}

	get defaultLabel() {
		return 'Безымянное действие';
	}

	get actionProps() {
		if(valueType(this.onExecute) == Function) {
			return {onClick: this.onExecute};
		}

		if(valueType(this.onExecute) == String) {
			return {onClick: this.onExecute};
		}
	}

	renderIconButton() {
		if(!this.onExecute) {
			return '';
		}

		return (
			<Link {...this.cls} href={this.onExecute}>
				<IconButton tooltip={this.label || this.defaultLabel} {...this.buttonProps}>
					{icon(this.icon || this.defaultIcon)}
				</IconButton>
			</Link>
		);
	}

	renderRegularButton() {
		if(!this.onExecute) {
			return '';
		}

		return (
			<Link {...this.cls} href={this.onExecute}>
				<Button {...this.buttonProps}>
					{icon(this.icon || this.defaultIcon)}
					&nbsp;
					{this.label || this.defaultLabel}
				</Button>
			</Link>
		);
	}

	render() {
		if(this.renderMode == Action.RENDER_ICON) {
			return this.renderIconButton();
		}

		return this.renderRegularButton();
	}
}