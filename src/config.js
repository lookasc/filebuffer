const defaultConfig = {
	dataDir: './data/',
	activeBufferFileExtension: 'active',
	inactiveBufferFileExtension: 'stored',
	activeBufferMaxSize: '1M',
	activeBufferMaxAge: 60,
	allowTimeRollover: true
};

const testConfig = {
	dataDir: './data/',
	activeBufferFileExtension: 'active',
	inactiveBufferFileExtension: 'stored',
	activeBufferMaxSize: '1k',
	activeBufferMaxAge: 1,
	allowTimeRollover: true
};

function getConfiguration(params) {
	if (!params) return defaultConfig;

	let configObj = {};

	for (var prop in defaultConfig) {
		if (Object.prototype.hasOwnProperty.call(defaultConfig, prop)) {
			configObj[prop] = params[prop] ? params[prop] : defaultConfig[prop];
		}
	}

	return configObj;
}

module.exports = {
	getConfiguration,
	defaultConfig,
	testConfig
};