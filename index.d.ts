export interface BufferConfig {
	dataDir?: string,
	activeBufferFileExtension?: string,
	inactiveBufferFileExtension?: string,
	activeBufferMaxSize?: string,
	activeBufferMaxAge?: number,
	allowTimeRollover?: boolean
}

export class FileBuffer {
	constructor(config?: BufferConfig);
	write(data: string): void;
}
