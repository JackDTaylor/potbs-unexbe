import Action from "./Action";

export default class DeleteAction extends Action {
	get defaultIcon() {
		return 'delete';
	}

	get defaultLabel() {
		return 'Удалить запись';
	}
}