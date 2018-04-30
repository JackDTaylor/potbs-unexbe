import Path from "path";
import {FileSystemAsync} from "../FileSystem";


export default class RendererChecker {
	static async Check(type) {
		return await (new RendererChecker(type)).check();
	}

	type;
	defined;
	existing;

	constructor(type) {
		this.type = type;
	}

	get dir() {
		return Application.path('/frontend/Renderers/', this.type);
	}

	get errorSuffix() {
		return `\n    at Renderers (${Application.path('/common/Assembly/Renderers.jsx')})`;
	}

	getRendererName(file) {
		return Path.basename(file, '.jsx');
	}

	getRendererPath(file) {
		return `${this.type}/${file.replace(/\.jsx$/, '')}`;
	}

	async getFiles() {
		return (await FileSystemAsync.listRecursive(this.dir))
			.filter(f => /\.jsx$/.test(f))
			.map(f => Path.relative(this.dir, f));
	}

	async getExisting() {
		let files = await this.getFiles();

		return Object.combine(
			files.map(f => this.getRendererName(f)),
			files.map(f => this.getRendererPath(f)),
		);
	}

	async getDefined() {
		return global[`${this.type}Renderers`];
	}

	async check() {
		this.defined = await this.getDefined();
		this.existing = await this.getExisting();

		if(Object.equal(this.defined, this.existing)) {
			// Quick check
			return true;
		}

		// We've got error, determine it
		this.fullCheck();
	}

	fullCheck() {
		Object.keys(this.existing).forEach(key => {
			if(key in this.defined == false) {
				this.throwError(`${this.existing[key]}.jsx is not registered as a renderer`);
			}
		});

		Object.keys(this.defined).forEach(key => {
			if(Object.keys(this.existing).has(key) == false) {
				this.throwError(`${this.type}/${key}.jsx not found`);
			}

			if(this.defined[key] != this.existing[key]) {
				this.throwError(`${this.defined[key]}.jsx path should be '${this.existing[key]}'`);
			}
		});

		this.throwError(`${this.type}Renderers are misconfigured`);
	}

	throwError(error) {
		throw new Error(error + this.errorSuffix);
	}
}