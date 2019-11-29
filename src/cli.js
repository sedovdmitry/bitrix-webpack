import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import arg from 'arg';
import { createProject } from './main'

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
    skipPrompts: args['--yes'] || false,
    runInstall: args['--install'] || false,
    template: args._[0],
  };
}

async function promtForMissingOptions(options) {
  const defaultTemplate = 'CSS';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    }
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose SASS or without css-preprocessor to use',
      choices: ['CSS', 'SASS'],
      default: defaultTemplate,
    })
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promtForMissingOptions(options);
  await createProject(options);
}

clear();

console.log(
  chalk.yellow(
    figlet.textSync('BitrixWebpack', { horizontalLayout: 'full' })
  )
);
