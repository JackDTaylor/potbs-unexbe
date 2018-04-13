@modelName('пользователь')
export default class AclUser extends BaseModel {
	static ListColumnOrder = ['full_name', 'email', 'phone'];

	@property static full_name = {
		type: Type.STRING,
		expr: `CONCAT(first_name, ' ', last_name)`,

		get(value) {
			return value.replace(/<!>/g, ' ');
		},

		set(value) {
			value = value.replace(/\s+/g, ' ').split(' ');

			this.first_name = value[0];
			this.last_name = value.slice(1).join(' ');
		}
	};

	@hidden
	@scope(Scope.Writable)
	@property static password_hash;
}