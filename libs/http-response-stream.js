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
    function errorHandler(error) {
      console.log(error);
      callback();
    }

    let { protocol } = url.parse(chunk);
    protocol = protocol.slice(0, -1);
    (protocol === 'https' ? https : http).get(chunk)
      .on('response', response => {
        const { statusCode, headers } = response;
        if (statusCode !== 200) {
          const error = new Error(http.STATUS_CODES(statusCode));
          return errorHandler(error);
        };
        const extension = mime.getExtension(headers['content-type']);
        response.on('end', callback);
        this.push({
          extension,
          url: chunk,
          stream: response
        })
      })
      .on('error', errorHandler)
  }
}

module.exports = HttpResponseStream;