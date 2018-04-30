import {FileSystemAsync, FileSystemSync} from "./FileSystem";

export default class Version {
	static get PATH() {
		return Application.path('/version');
	}

	static Sync() {
		const v = new Version;

		v.major = FileSystemSync.read(`${Version.PATH}/major`);
		v.minor = FileSystemSync.read(`${Version.PATH}/minor`);
		v.build = FileSystemSync.read(`${Version.PATH}/build`);

		return v;
	}

	static async Async() {
		const v = new Version;

		await Bluebird.all([
			(async fn => v.major = await FileSystemAsync.read(`${Version.PATH}/major`))(),
			(async fn => v.minor = await FileSystemAsync.read(`${Version.PATH}/minor`))(),
			(async fn => v.build = await FileSystemAsync.read(`${Version.PATH}/build`))(),
		]);

		return v;
	}

	major;
	minor;
	build;

	get primary() {
		return `${this.major}.${this.minor}`;
	}

	get full() {
		return `${this.primary}b${this.build}`;
	}
}