const chai = require('chai');
const expect = chai.expect;
const BufferController = require('../src/buffer-controller');
const { testConfig } = require('../src/config');
const { convertSizeStringToByteNumber } = require('../src/utils');

describe('BufferController class', () => {
	let bufferController;
	let dummyData = 'dummyData';
	let bufferNameSnapshot;
	let maxSize;

	beforeEach(() => {
		bufferController = new BufferController();
		bufferNameSnapshot = bufferController.activeBuffer.name;
		maxSize = convertSizeStringToByteNumber(testConfig.activeBufferMaxSize);
	});

	it('should create instance of BufferController', () => {
		expect(bufferController).to.be.instanceOf(BufferController);
	});

	it('should write data to buffer', () => {
		bufferController.write(dummyData);
		expect(bufferController.activeBuffer.size).to.equal(dummyData.length);
	});

	it('should rollover buffer when overloaded', (done) => {
		let byte = 'd';
		var data = new Array(maxSize + 1).join(byte);
		bufferController.write(data);
		expect(bufferController.activeBuffer.size).to.equal(maxSize);
		bufferController.write('should cause rollover event');
		setTimeout(() => {
			expect(bufferController.activeBuffer.size).to.equal(0);
			expect(bufferController.activeBuffer.name).to.not.equal(bufferNameSnapshot);
			done();
		}, 5);
	});

	it('should rollover buffer when max age exceeded & size > 0', (done) => {
		bufferController.write(dummyData);
		expect(bufferController.activeBuffer.size).to.equal(dummyData.length);
		setTimeout(() => {
			expect(bufferController.activeBuffer.size).to.equal(0);
			expect(bufferController.activeBuffer.name).to.not.equal(bufferNameSnapshot);
			done();
		}, testConfig.activeBufferMaxAge * 1000 + 10);
	});

	it('should not rollover buffer when max age exceeded & size > 0 but allowTimeRollover=false', (done) => {
		testConfig.allowTimeRollover = false;
		bufferController = new BufferController();
		bufferNameSnapshot = bufferController.activeBuffer.name;
		bufferController.write(dummyData);
		expect(bufferController.activeBuffer.size).to.equal(dummyData.length);
		setTimeout(() => {
			expect(bufferController.activeBuffer.size).to.equal(dummyData.length);
			expect(bufferController.activeBuffer.name).to.equal(bufferNameSnapshot);
			done();
		}, testConfig.activeBufferMaxAge * 1000 + 10);
	});

	it('should not rollover buffer when max age exceeded & size == 0', (done) => {
		expect(bufferController.activeBuffer.size).to.equal(0);
		setTimeout(() => {
			expect(bufferController.activeBuffer.size).to.equal(0);
			expect(bufferController.activeBuffer.name).to.equal(bufferNameSnapshot);
			done();
		}, testConfig.activeBufferMaxAge * 1000 + 10);
	});

	it('should emit event when buffer has exchanged', (done) => {
		let byte = 'd';
		var data = new Array(maxSize + 1).join(byte);
		
		bufferController.on('bufferExchange', (e) => {
			let bufferNameSnapshotStored = bufferNameSnapshot.replace(testConfig.activeBufferFileExtension, testConfig.inactiveBufferFileExtension);
			expect(bufferController.activeBuffer.name).to.not.equal(bufferNameSnapshot);
			expect(e.fileName).to.equal(bufferNameSnapshotStored);
			done();
		});
		bufferController.write(data);
		bufferController.write('should cause rollover event');
	});

});
