
import Application from "./Application";

export default class ACL {
	static columnPermissions = null;

	static async refreshColumnPermissions() {
		let a = await DB.query('SHOW TABLES');



		dpr('test', a);
	}

	/** @type {Context} */
	context = null;
	user = null;

	constructor(context) {
		this.context = context;
	}

	get session() {
		return this.context.session;
	}

	get storedSession() {
		return this.context.storedSession;
	}

	async initialize() {
		const User = await Application.GetModel("Acl/User");

		if(this.storedSession.authUserId) {
			this.user = await User.findById(this.storedSession.authUserId);
		}
	}
}