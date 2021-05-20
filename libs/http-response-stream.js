const http = require('http');
const https = require('https');
const { URL } = require('url');
const stream = require('stream');
const { once } = require('events');
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

  async _transform(chunk, encoding, callback) {
    function errorHandler(error) {
      console.log(error);
      callback();
    }

    let { protocol } = new URL(chunk);
    protocol = protocol.slice(0, -1);

    const request = (protocol === 'https' ? https : http).get(chunk);

    try {
      const [response] = await once(request, 'response');
      const { statusCode, headers } = response;

      if (statusCode !== 200) {
        const error = new Error(http.STATUS_CODES[statusCode]);
        return errorHandler(error);
      };

      const extension = mime.getExtension(headers['content-type']);
      response.once('end', callback);
      this.push({
        extension,
        url: chunk,
        stream: response
      });
    } catch (error) {
      errorHandler(error);
    }
  }
}

module.exports = HttpResponseStream;
