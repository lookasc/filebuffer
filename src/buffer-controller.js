const Buffer = require('./buffer');
const { EventEmitter } = require('events');
const indexGenerator = require('ulid').monotonicFactory();
const { getConfiguration, testConfig } = require('./config');
const { prepareStoreDirectory } = require('./utils');

class BufferController extends EventEmitter {

	constructor(params) {
		super();
		this.config = (process.env.NODE_ENV === 'test') ? testConfig : getConfiguration(params);
		prepareStoreDirectory(this.config.dataDir);
		this.activeBuffer = new Buffer(indexGenerator, this.config);
		this.exchangingBufferNow = false;

		if (this.config.allowTimeRollover) {
			setInterval(() => {
				if (this.activeBuffer.size) this.rolloverBuffer();
			}, this.config.activeBufferMaxAge * 1000);
		}
	}

	write(data) {
		let shouldRolloverBuffer = (!this.exchangingBufferNow && this.activeBuffer.isOverloaded());
		if (shouldRolloverBuffer) {
			this.rolloverBuffer();
		}
		this.activeBuffer.write(data);
	}

	rolloverBuffer() {
		this.exchangingBufferNow = true;
		let newBuffer = new Buffer(indexGenerator, this.config);
		newBuffer
			.waitUntilReady()
			.then(() => {
				let oldBuffer = this.activeBuffer;
				this.activeBuffer = newBuffer;
				oldBuffer.close(storedBufferName => {
					this.emit('bufferExchange', { fileName: storedBufferName });
				});
				this.exchangingBufferNow = false;
			});
	}

}

module.exports = BufferController;