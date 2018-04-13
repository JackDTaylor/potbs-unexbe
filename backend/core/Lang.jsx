import CSV from "./CSV";
import {APPROOT} from "../config";

const csvAdapter = new CSV({headers: ['key', 'value']});

export default class Lang {
	static DEFAULT_KEY = '__default__';
	// Namespaces
	static FIELD_NAME = 'fieldnames';
	static FIELD_DESCRIPTION = 'fielddesc';
	static FIELD_PLACEHOLDER = 'fieldph';

	static db = null;

	// Implementation
	static async load(lang) {
		lang = lang.replace(/[^a-z0-9]/g, '');

		const langFile = `${APPROOT}/language/lang-${lang}.csv`;
		const rawDb = await csvAdapter.read(langFile);

		this.db = this.db || {};
		this.db[lang] = {};

		rawDb.forEach(row => this.db[lang][row.key] = row.value);
	}

	static async save(lang) {
		const langFile = `${APPROOT}/language/lang-${lang}.csv`;
		const rows = Object.keys(this.db[lang]).map(key => ({key, value: this.db[key] }));
		await csvAdapter.write(langFile, rows);
	}

	static key(ns, key, scope = '') {
		if(this.db == null || this.db['ru'] == null) {
			throw new Error("Language DB is not loaded");
		}

		scope = scope ? `${scope}:` : '';

		const keys = [
			`${ns}^${scope}${key}`,
			`${ns}^${key}`,
			`${ns}^${Lang.DEFAULT_KEY}`
		];

		for(let i = 0; i < keys.length; i++) {
			if(keys[i] in this.db['ru']) {
				return this.db['ru'][ keys[i] ];
			}
		}

		return keys[0];
	}
}