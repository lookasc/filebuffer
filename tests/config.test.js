const chai = require('chai');
const expect = chai.expect;
const { getConfiguration, defaultConfig } = require('../src/config');

describe('Configuration', () => {
	let config;

	it('should return default configuration', () => {
		config = getConfiguration();
		expect(config).to.equals(defaultConfig);
	});

	it('should have non default dataDir property', () => {
		config = getConfiguration({ dataDir: 'test'});
		expect(config).to.not.equals(defaultConfig);
		expect(config.dataDir).to.not.equals(defaultConfig.dataDir);
	});

});
