import chalk from 'chalk';
import fs, { readdirSync } from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import { headerSnippet, footerSnippet } from './snippets';

const access = promisify(fs.access);
const copy = promisify(ncp);

let bitrixDirs = [];
let localDirs = [];

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

function getAllDirectoriesFrom(options, directory) {
  const source = path.resolve(options.targetDirectory, directory);

  const getDirectories = source => {
    try {
      return readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    } catch (err) {
      console.error(chalk.yellow.bold('Warning'), `directories not founded in ${source}`);
    }
  }

  const dirs = getDirectories(source) !== undefined ? getDirectories(source) : [];
  if (dirs.length) {
    console.log(chalk.blue.bold('Notice'), `founded template directories ${dirs} in ${source}`);
  }
  return dirs;
}

async function updateBitrixTemplates(parentTargetDir, dirs, filename, replace, addSnippet) {
  for (const dirname of dirs) {
    await addToBitrixTemplate(parentTargetDir, dirname, filename, replace, addSnippet);
  }
}

async function addToBitrixTemplate(parentTargetDir, dirname, filename, replace, addSnippet) { 
  const re = new RegExp(replace,"g");

  fs.readFile(path.resolve(parentTargetDir, dirname, filename), 'UTF-8', function(err, data) {
    if(err)
      console.error(chalk.blue.bold('Notice'), `file ${filename} not founded in ${parentTargetDir}/${dirname}`);
    else {
      if (/="\/local\/dist\/<\?=\$GLOBALS/gim.test(data)) {
        console.error(chalk.red.bold('Attention'), `snippet was added before in ${parentTargetDir}/${dirname}/${filename}`);
      } else {
        let result = data.replace(re, addSnippet);
        console.error(chalk.green.bold('Writed'), path.resolve(parentTargetDir, dirname, filename));
        fs.writeFile(path.resolve(parentTargetDir, dirname, filename), result, 'utf8', function (err) {
          if (err) return console.error(chalk.blue.bold('Error'), `When write file ${filename} in ${parentTargetDir}/${dirname}`);
        });
      }
    }
  });
}

function runUpdate(bitrixTargetDirectory, localTargetDirectory) {
  updateBitrixTemplates(bitrixTargetDirectory, bitrixDirs, 'header.php', '</head>', headerSnippet);
  updateBitrixTemplates(bitrixTargetDirectory, bitrixDirs, 'footer.php', '</body>', footerSnippet);
  updateBitrixTemplates(localTargetDirectory, localDirs, 'header.php', '</head>', headerSnippet);
  updateBitrixTemplates(localTargetDirectory, localDirs, 'footer.php', '</body>', footerSnippet);
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

  const bitrixTargetDirectory = path.resolve(options.targetDirectory, 'bitrix/templates/');
  const localTargetDirectory = path.resolve(options.targetDirectory, 'local/templates/');

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
      title: 'Copied webpack files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Copied default config files',
      task: () => copyDefaultFiles(options),
    },
    {
      title: 'Getting bitrix templates from /bitrix',
      task: () => bitrixDirs = getAllDirectoriesFrom(options, 'bitrix/templates/'),
    },
    {
      title: 'Getting bitrix templates from /local',
      task: () => localDirs = getAllDirectoriesFrom(options, 'local/templates/'),
    },
    {
      title: 'Run updating templates',
      task: () => runUpdate(bitrixTargetDirectory, localTargetDirectory),
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

  console.log('%s Webpack project ready', chalk.green.bold('DONE'));
  return true;
}