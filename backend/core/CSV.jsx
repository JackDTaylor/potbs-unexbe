import * as FastCSV from 'fast-csv';
import {FileSystemAsync} from "./FileSystem";

export default class CSV {
	optionsOverride = {};

	get options() {
		return {
			headers: true,
			delimiter: ';',
			escape: '"',
			quote: '"',
			...this.optionsOverride
		};
	}

	constructor(optionsOverride) {
		this.optionsOverride = optionsOverride;
	}

	async read(fileName) {
		const contents = await FileSystemAsync.read(fileName);

		return new Bluebird((resolve, reject) => {
			const rows = [];

			FastCSV.fromString(contents, { ...this.options, headers: true })
				.on("error", error => reject(error))
				.on("data", data => rows.push(data))
				.on("end", fn => safeResolve(resolve, reject, rows));
		});
	}

	async write(fileName, pairs) {
		const options = {
			...this.options,
			// headers: false,
		};

		const data = await new Bluebird((resolve, reject) => {
			FastCSV.writeToString(pairs, options, (err, data) => {
				if(err) {
					reject(err);
				}

				return safeResolve(resolve, reject, data);
			});
		});

		await FileSystemAsync.write(fileName, data);
	}
}