import RecordProvider from "../RecordProvider";

export default class FormProvider extends RecordProvider {
	get integration() {
		return this.dataSource.formIntegration;
	}

	get formComponent() {
		return this.integration.component;
	}
}