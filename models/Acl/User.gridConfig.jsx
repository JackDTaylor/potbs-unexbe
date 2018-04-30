import GridAction from "../../frontend/Common/Grid/Base/GridAction/GridAction";

export default class extends GridConfig {
	columnOrder = ['full_name', 'email', 'phone'];

	rowActions = [
		p => (
			<GridAction {...p}
				label="Добавить в мои аккаунты"
				icon="person add"
				onExecute={fn => console.log('AccountManager.addAccount', p.row.id)}
			/>
		),
	];

	useDeleteRowAction = false;
}