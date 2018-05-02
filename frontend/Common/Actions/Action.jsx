import {Tooltip} from "material-ui";
import IconButton from "../IconButton";
import Link from "../Link";

export default class Action extends ReactComponent {
	@prop icon;
	@prop label;
	@prop onExecute;

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

	render() {
		if(!this.onExecute) {
			return '';
		}

		return (
			<Link {...this.cls} href={this.onExecute}>
				<IconButton tooltip={this.label || this.defaultLabel}>{icon(this.icon || this.defaultIcon)}</IconButton>
			</Link>
		);
	}
}