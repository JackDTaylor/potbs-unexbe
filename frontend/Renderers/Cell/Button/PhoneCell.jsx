import ButtonCell from "./ButtonCell";

export default class PhoneCell extends ButtonCell {
	get buttonIcon() {
		return 'phone';
	}

	get buttonAction() {
		return `tel:${this.value.replace(/[^+\d]/, '')}`;
	}

	get buttonProps() {
		return {
			tooltip: 'Позвонить',
		};
	}
}