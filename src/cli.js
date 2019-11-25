const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

import arg from 'arg';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg (
    {
      '--yes': Boolean,
      '--install': Boolean,
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPromts: args['--yes'] || false,
    runInstall: args['--install'] || false,
    template: args._[0],
  };
}

clear();

console.log(
  chalk.yellow(
    figlet.textSync('BitrixWebpack', { horizontalLayout: 'full' })
  )
);

export function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  console.log(options);
}
