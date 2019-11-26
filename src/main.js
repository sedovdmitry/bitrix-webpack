import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy (options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function copyDefaultFiles(options) {
  return copy (options.defaultDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  }

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    options.template.toLowerCase()
  );
  const defaultDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    'default'
  );
  
  options.templateDirectory = templateDir;
  options.defaultDirectory = defaultDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  try {
    await access(defaultDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid default name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy webpack files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Copy default config files',
      task: () => copyDefaultFiles(options),
    },
    {
      title: 'Install dependencies',
      task: () => projectInstall({
        cwd: options.targetDirectory,
      }),
      skip: () => !options.runInstall ? 'Pass --install to automatically install dependencies'
                                      : undefined,
    }
  ]);

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}