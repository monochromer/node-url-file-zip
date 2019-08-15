const express = require('express');
const stream = require('stream');
const archiver = require('archiver');
const config = require('./config/config');
const UrlStream = require('./libs/url-stream');
const HttpResponseStream = require('./libs/http-response-stream');

const app = express();

app.use(express.static(config.public));

app.post('/', express.urlencoded({ extended: true }), (req, res, next) => {
  const { filename, url } = req.body;

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  res.attachment(`${filename}.zip`);
  res.on('close', () =>  archive.destroy());
  archive.on('error', next);
  archive.pipe(res);
  stream.pipeline(
    new UrlStream({ urls: url }),
    new HttpResponseStream(),
    error => { error && console.log(error) }
  ).on('data', chunk => {
    archive.append(chunk.stream, {
      name: `${Math.random().toString(16).slice(2)}.${chunk.extension}`
    })
  }).on('end', () => archive.finalize())
});

app.listen(config.port, () => {
  console.log(`App is running on http://localhost:${config.port}`);
});