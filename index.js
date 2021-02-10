#! /usr/bin/env node

'use strict';

const program = require('commander');
const version = require('./package.json').version;
const pinoGelfHttp = require('./lib/pino-gelf-http');

program
  .version(version);

program
  .command('log')
  .description('Run Pino-GELF-HTTP')
  .option('-u, --url [URL]', 'Graylog GELF URL')
  .option('-v, --verbose', 'Output GELF to console')
  .option('-t, --passthrough', 'Output original input to stdout to allow command chaining')
  .action(function () {
    const opts = {
      customKeys: this.specifyCustomFields || [],
      url: this.url || 'http://127.0.0.1/gelf',
      verbose: (this.verbose && !this.passthrough) || false,
      passthrough: this.passthrough || false
    };

    pinoGelfHttp(opts);
  });

program
  .parse(process.argv);
