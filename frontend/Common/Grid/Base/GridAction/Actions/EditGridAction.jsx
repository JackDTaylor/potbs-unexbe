import GridAction from "../GridAction";

export default class EditGridAction extends GridAction {
	get defaultIcon() {
		return 'edit';
	}

	get defaultLabel() {
		return 'Изменить запись';
	}
}