@named('пользователь', true)
@registerBundle('/')
export default class AclUser extends PlatformSpecificModel {
	@hidden @property first_name;
	@hidden @property last_name;

	get name() {
		return this.full_name;
	}

	/**
	 * Номер мобильного телефона, он же логин
	 * @type String
	 */
	@type(PropertyType.PHONE(255))
	@property phone;

	/**
	 * Адрес электронной почты для различных уведомлений
	 * @type String
	 */
	@cellRenderer(CellRenderers.EmailCell)
	@property email;

	/**
	 * Полное имя пользователя, собирается из first_name и last_name
	 * Есть setter, он делит входную строку по первому пробелу и
	 * записывает в first_name и last_name соответственно
	 * @type String
	 */
	@cellRenderer(CellRenderers.RowLinkCell)
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

	/**
	 * Хэш пароля, при записи сразу шифруется в md5
	 * Декоратор @writeonly означает, что значение не будет
	 * передаваться вместе с остальными данными объекта,
	 * а поле будет доступно только для записи
	 *
	 * TODO: Соль, более криптостойкий алгоритм?
	 * @type String
	 */
	@formDefaultTab('Доступ')
	@writeonly @property password_hash = {
		set: value => String(value).md5()
	};

	@formDefaultTab('Доступ')
	@property groups;

	@formDefaultTab('Доступ')
	@formWidth(1/3)
	@property date_created;

	@formDefaultTab('Доступ')
	@formWidth(1/3)
	@property date_updated;

	@formDefaultTab('Доступ')
	@formWidth(1/3)
	@property date_logged;

	@formDefaultTab('Ресурсы')
	@property factories;
}