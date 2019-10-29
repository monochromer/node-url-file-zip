const stream = require('stream');

class UrlStream extends stream.Readable {
  constructor(options) {
    options = {
      ...options,
      ...{
        objectMode: true
      }
    }
    super(options);
    const urls = Array.isArray(options.urls) ? options.urls : [options.urls];
    this.urls = urls.slice().reverse();
  }

  _read(size) {
    this.push(this.urls.length ? this.urls.pop() : null);
  }
}

module.exports = UrlStream;