'use strict';

const through2 = require('through2');
const transformer = require('./transformer');
const utils = require('./utils');
const https = require('https'); 
const url = require('url'); 

module.exports = function (opts) {
  return through2.obj(function (data, enc, cb) {
    if (data.value) {
      const transform = transformer(opts);
      const message = transform(data.value);

      const stringify = utils.stringify(opts);
      const messageString = stringify(message);

      if (opts.passthrough) {
        // Pass original input back to stdout to allow chaining of multiple commands
        setImmediate(function () { process.stdout.write(`${JSON.stringify(data.value)}\n`); });
      } else if (opts.verbose) {
        const stringify = utils.stringify(opts);
        const messageString = stringify(message);
        setImmediate(function () { process.stdout.write(`${messageString}\n`); });
      }
   
      const gelfUrl = new URL(opts.url);
      
      const req = https.request({
        hostname: gelfUrl.host,
        path: gelfUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': messageString.length,
        },
      }); 

      req.write(messageString);
      req.end(); 
    }

    cb();
  });
};
