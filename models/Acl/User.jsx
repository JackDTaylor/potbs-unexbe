@named('пользователь')
@registerBundle('/')
export default class AclUser extends PlatformSpecificModel {
	@hidden @property first_name;
	@hidden @property last_name;

	get name() {
		return this.full_name;
	}

	@type(PropertyType.PHONE(255))
	@property phone;

	@cellRenderer(CellRenderers.EmailCell)
	@property email;

	@rowLink
	@property full_name = {
		expr: `CONCAT(first_name, '<!>', last_name)`,

		get(value) {
			return value.replace(/<!>/g, ' ');
		},

		set(value) {
			value = value.replace(/\s+/g, ' ').split(' ');

			this.first_name = value[0];
			this.last_name = value.slice(1).join(' ');
		}
	};

	@secure @property password_hash = {
		set: value => String(value).md5()
	};
}