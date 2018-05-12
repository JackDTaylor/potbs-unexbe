import RecordPage from "./Base/RecordPage";
import FormLayout from "../Common/Form/FormLayout";
import FormProvider from "../Application/Data/Provider/Record/FormProvider";

export default class FormPage extends RecordPage {
	get providerConstraint() {
		return FormProvider;
	}

	get pageTitle() {
		return this.params.pageTitle || 'Форма';
	}

	renderContents() {
		return (
			<FormLayout provider={this.provider} record={this.record} />
		);
	}
}