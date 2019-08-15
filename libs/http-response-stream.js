const http = require('http');
const https = require('https');
const url = require('url');
const stream = require('stream');
const mime = require('mime');

class HttpResponseStream extends stream.Transform {
  constructor(options) {
    options = {
      ...options,
      ...{
        readableObjectMode: true,
        writableObjectMode: true
      }
    }
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let { protocol } = url.parse(chunk);
    protocol = protocol.slice(0, -1);
    (protocol === 'https' ? https : http).get(chunk)
      .on('response', response => {
        const { statusCode, headers } = response;
        if (statusCode !== 200) {
          const error = new Error(http.STATUS_CODES(statusCode));
          return callback(error);
        };
        const extension = mime.getExtension(headers['content-type']);
        callback(null, {
          extension,
          url: chunk,
          stream: response
        })
      })
      .on('error', callback)
  }
}

module.exports = HttpResponseStream;