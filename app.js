const stream = require('stream');
const { randomUUID } = require('crypto');
const express = require('express');
const archiver = require('archiver');
const config = require('./config/config');
const HttpResponseStream = require('./libs/http-response-stream');

const app = express();

app.use(express.static(config.public));

app.post('/', express.urlencoded({ extended: true }), (req, res, next) => {
  const { filename, url } = req.body;

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  res.attachment(`${filename}.zip`);
  req.on('aborted', () => fileStream.destroy());
  archive.on('error', next);
  archive.pipe(res);

  stream.pipeline(
    stream.Readable.from([...url]),
    new HttpResponseStream(),
    error => { error && next(error) }
  ).on('data', chunk => {
    archive.append(chunk.stream, {
      name: `${randomUUID()}.${chunk.extension}`
    })
  }).on('end', () => archive.finalize())
});

app.listen(config.port, () => {
  console.log(`App is running on http://localhost:${config.port}`);
});