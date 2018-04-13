import Bluebird from 'bluebird';
import * as FS from 'fs';

/**
 * @type {{
 *   readFileAsync()
 *   writeFileAsync()
 *   appendFileAsync()
 *   statAsync()
 *   readdirAsync()
 * }|{}}
 */
const FSA = Bluebird.promisifyAll(FS);

export class FileSystemSync {
	static exists(...args) {
		return FS.existsSync(...args);
	}

	static read(...args) {
		return FS.readFileSync(...args).toString();
	}

	static write(...args) {
		FS.writeFileSync(...args);
	}

	static append(...args) {
		FS.appendFileSync(...args);
	}

	/** @return {{isFile(),isDirectory(),isBlockDevice(),isCharacterDevice(),isSymbolicLink(),isFIFO(),isSocket(),dev,ino,mode,nlink,uid,gid,rdev,size,blksize,blocks,atimeMs,mtimeMs,ctimeMs,birthtimeMs,atime,mtime,ctime,birthtime}} */
	static stat(...args) {
		// noinspection JSValidateTypes
		return FS.statSync(...args);
	}

	static list(dir) {
		return FS.readdirSync(dir);
	}

	static isDir(path) {
		return this.stat(path).isDirectory();
	}

	static listRecursive(dir) {
		let files = this.list(dir);
		let result = [];

		files.forEach(fileName => {
			const filePath = `${dir}/${fileName}`;
			const results = this.isDir(filePath) ? this.listRecursive(filePath) : [filePath];

			result = [ ...result, ...results ];
		});

		return result;
	}
}

export class FileSystemAsync extends FileSystemSync {
	static async exists(...args) {
		return FS.existsSync(...args);
	}

	static async read(...args) {
		return (await FSA.readFileAsync(...args)).toString();
	}

	static async write(...args) {
		await FSA.writeFileAsync(...args);
	}

	static async append(...args) {
		await FSA.appendFileAsync(...args);
	}

	/** @return {Promise.<{isFile(),isDirectory(),isBlockDevice(),isCharacterDevice(),isSymbolicLink(),isFIFO(),isSocket(),dev,ino,mode,nlink,uid,gid,rdev,size,blksize,blocks,atimeMs,mtimeMs,ctimeMs,birthtimeMs,atime,mtime,ctime,birthtime}>} */
	static async stat(...args) {
		return await FS.statAsync(...args);
	}

	/** @return {Promise.<[]>} */
	static async list(dir) {
		return await FS.readdirAsync(dir);
	}

	static async isDir(path) {
		return (await this.stat(path)).isDirectory();
	}

	static async listRecursive(dir) {
		let files = await this.list(dir);
		let result = [];

		for(let i = 0; i < files.length; i++) {
			const fileName = files[i];
			const filePath = `${dir}/${fileName}`;
			const results = await this.isDir(filePath) ? await this.listRecursive(filePath) : [filePath];

			result = [ ...result, ...results ];
		}

		return result;
	}
}