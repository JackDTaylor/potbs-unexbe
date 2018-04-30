import ButtonCell from "./ButtonCell";

export default class EmailCell extends ButtonCell {
	get buttonIcon() {
		return 'mail outline';
	}

	get buttonAction() {
		return `mailto:${this.value}`;
	}

	get buttonProps() {
		return { target: '_blank' };
	}
}