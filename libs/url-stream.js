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
    this.urls = options.urls.slice().reverse();
  }

  _read(size) {
    this.push(this.urls.length ? this.urls.pop() : null);
  }
}

module.exports = UrlStream;