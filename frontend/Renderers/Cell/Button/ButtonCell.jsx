import AbstractCell from "../AbstractCell";
import Button from "../../../Common/Button";

export default class ButtonCell extends AbstractCell {
	get buttonAction() {
		return undefined;
	}

	get buttonSize() {
		return 'small';
	}

	get buttonIcon() {
		return null;
	}

	get buttonLabel() {
		return this.value;
	}

	get actionProps() {
		let actionProps = {};

		if(valueType(this.buttonAction) == String) {
			actionProps.href = this.buttonAction;
		} else {
			actionProps.onClick = this.buttonAction;
		}

		return actionProps;
	}

	get buttonProps() {
		return {};
	}

	renderPlain(value) {
		return (
			<Button {...this.cls} {...this.actionProps} size={this.buttonSize} {...this.buttonProps}>
				{icon(this.buttonIcon)}&nbsp;{this.buttonLabel}
			</Button>
		);
	}
}