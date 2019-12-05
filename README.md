# filebuffer
Buffering data to file with rotating

[![NPM][npm-icon]][npm-url]

[![Build Status](https://travis-ci.org/lookasc/filebuffer.svg?branch=master)](https://travis-ci.org/lookasc/filebuffer)
[![Coverage Status](https://coveralls.io/repos/github/lookasc/filebuffer/badge.svg?branch=master)](https://coveralls.io/github/lookasc/filebuffer?branch=master)

[npm-icon]: https://nodei.co/npm/filebuffer.svg?downloads=true
[npm-url]: https://www.npmjs.com/package/filebuffer


# Installation
```sh 
npm install filebuffer --save 
```

# About

This package provides FileBuffer class which lets to save data to file. File buffer may rotate based on file size or age. 

# Usage
### Writing to buffer

```js
const { FileBuffer } = require('filebuffer');

const fb = new FileBuffer();

fb.write('Data to write');
```

### Providing configuration
Some configuration may be added to `FileBuffer(config)`. When no data is supplied in `config`, the default configuration will be used. Allowed options are described in `Options` section.

```js
const { FileBuffer } = require('filebuffer');

const fb = new FileBuffer({
  activeBufferMaxAge: 120
});
```

### Using `bufferExchange` event
When buffer is overloaded or `activeBufferMaxAge` time elapsed the file buffer will be exchanged. `FileBuffer` will emit `bufferExchange` event with name of closed file.

```js
const { FileBuffer } = require('filebuffer');

const fb = new FileBuffer();

fb.on('bufferExchange', e => {
  // e.fileName will store closed file
  console.log(e.fileName);
});
```

# Options
Default configaration:
```js
{
  dataDir: './data/',
  activeBufferFileExtension: 'active',
  inactiveBufferFileExtension: 'stored',
  activeBufferMaxSize: '1M',
  activeBufferMaxAge: 60,
  allowTimeRollover: true
};
````

#### `dataDir` [`string`]
Specifies the directory where all files should be stored.
#### `activeBufferFileExtension` [`string`]
Specifies the extension of file which is currently active for writing. By default this extension is `.active`.
#### `inactiveBufferFileExtension` [`string`]
Specifies the extension of file which was closed and stored. By default this extension is `.stored`.
#### `activeBufferMaxSize` [`string`]
Specifies the maximal size of file. When this size is exceeded file will be closed and rotated (new file will be created). The value should be a `string` containing size - allowed are `{number}k` for kilobytes and `{number}M` for megabytes.
#### `activeBufferMaxAge` [`number`]
Specifies the maximal age of buffer. When buffer size is more than 0B but less than `activeBufferMaxSize` the file will be rotated after specified in `activeBufferMaxAge` time. This is time in seconds.
#### `allowTimeRollover` [`boolean`]
Specifies wheather `activeBufferMaxAge` should work. By defaul this option is enabled.

# MIT License

Copyright (c) 2019 lookasc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
