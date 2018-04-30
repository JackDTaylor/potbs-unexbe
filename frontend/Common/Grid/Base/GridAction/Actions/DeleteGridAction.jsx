import GridAction from "../GridAction";

export default class DeleteGridAction extends GridAction {
	get defaultIcon() {
		return 'delete';
	}

	get defaultLabel() {
		return 'Удалить запись';
	}

}