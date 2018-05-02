import Action from "./Action";

export default class EditAction extends Action {
	get defaultIcon() {
		return 'edit';
	}

	get defaultLabel() {
		return 'Изменить запись';
	}
}