import Form from "../../../../Common/Form/Form";

class Integration {
	dataSource;

	constructor(dataSource) {
		this.dataSource = dataSource;
	}
}

export class BasicGridIntegration extends Integration {
	get properties() {
		return [];
	}

	get actions() {
		return [];
	}

	get columnOrder() {
		return [];
	}
}

export class BasicFormIntegration extends Integration {
	get component() {
		return Form;
	}

	get properties() {
		return [];
	}

	get fieldOrder() {
		return [];
	}
}

export class BasicViewIntegration extends Integration {
	get properties() {
		return [];
	}

	get widgets() {
		return [];
	}

	get actions() {
		return [];
	}

	get columnWidths() {
		return [];
	}
}

