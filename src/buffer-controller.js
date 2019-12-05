const Buffer = require('./buffer');
const { EventEmitter } = require('events');
const indexGenerator = require('ulid').monotonicFactory();
const { FILES } = require('../config');

class BufferController extends EventEmitter {

	constructor(config) {
		super();
		this.activeBuffer = new Buffer(indexGenerator);
		this.exchangingBufferNow = false;

		setInterval(() => {
			if (this.activeBuffer.size) this.rolloverBuffer();
		}, FILES.ACTIVE_BUFFER_MAX_AGE * 1000);
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
		let newBuffer = new Buffer(indexGenerator);
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