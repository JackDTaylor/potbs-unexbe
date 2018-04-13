import {APPROOT} from "../config";
import {FileSystemAsync, FileSystemSync} from "./FileSystem";
import md5 from 'md5';

let sessionStorage = null;

export default class SessionStorage {
	/** @return {SessionStorage} */
	static get Instance() {
		return sessionStorage || (sessionStorage = new SessionStorage());
	}

	file = `${APPROOT}/data/sessions.json`;
	storage = null;

	isInitialized = false;

	async initialize() {
		if(await FileSystemAsync.exists(this.file) == false) {
			await FileSystemAsync.write(this.file, '{}');
		}

		const json = await FileSystemAsync.read(this.file);

		try {
			this.storage = JSON.parse(json);
			this.isInitialized = true;

			setInterval(fn => this.save(), 5 * Time.MINUTE);
		} catch(e) {
			console.error("Cannot parse session DB");

			throw new Error(`Cannot parse session DB: ${e.message}`);
		}
	}

	getSession(key) {
		if(this.isInitialized == false) {
			throw new Error("SessionStorage is not initialized yet");
		}

		if(!key || this.storage.hasOwnProperty(key) == false) {
			key = this.freeKey;

			this.storage[key] = {
				dateCreated: Date.now(),
				storageKey: key
			};
		}

		return this.storage[key];
	}

	get freeKey() {
		if(this.isInitialized == false) {
			throw new Error("SessionStorage is not initialized yet");
		}

		let attempts = 1024;

		while(attempts--) {
			let key = md5(Random.value);

			if(key in this.storage == false) {
				return key;
			}
		}

		throw new Error("Unable to generate session key");
	}

	save() {
		if(this.isInitialized) {
			console.warn('Saving SessionStorage');

			FileSystemSync.write(this.file, JSON.stringify(this.storage));
		}
	}
}
