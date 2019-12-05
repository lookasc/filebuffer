const { createWriteStream, rename } = require('fs');
const { convertSizeStringToByteNumber } = require('./utils');
const { join } = require('path');

class Buffer {

	constructor(generateULID, config) {
		this.config = config;
		let timestamp = Date.now();
		let ulid = generateULID(timestamp);
		let extension = this.config.activeBufferFileExtension;

		this.size = 0;
		this.maxSize = convertSizeStringToByteNumber(this.config.activeBufferMaxSize);
		this.name = join(this.config.dataDir, ulid + '.' + extension);
		this.stream = createWriteStream(this.name);
	}

	write(data) {
		this.size += data.length;
		this.stream.write(data + '\n');
	}

	close(callback) {
		this.stream.end(() => {
			this.deactivate()
				.then(callback);
		});
	}

	deactivate() {
		return new Promise(resolve => {
			let strToReplace = new RegExp(this.config.activeBufferFileExtension, 'g');
			let oldName = `${this.name}`;
			let newName = oldName.replace(strToReplace, this.config.inactiveBufferFileExtension);
			rename(oldName, newName, (err) => {
				if (err) throw new Error(err);
				resolve(newName);
			});
		});
	}

	isOverloaded() {
		return (this.size >= this.maxSize);
	}

	waitUntilReady() {
		return new Promise(resolve => {
			this.stream.on('ready', () => resolve());
		});
	}
	
}

module.exports = Buffer;