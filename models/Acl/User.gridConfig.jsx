
import Action from "../../frontend/Common/Action/Action";

export default class extends GridConfig {
	columnOrder = ['full_name', 'email', 'phone'];

	get actions(){
		return [
			action => <Action {...action}
				label="Добавить в мои аккаунты"
				icon="person add"
				onExecute={fn => console.log('AccountManager.addAccount', action.target.id)}
			/>,

			...super.actions,
		];
	}

	hideDeleteAction = false;
}