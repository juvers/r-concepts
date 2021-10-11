#! /usr/bin/env node
// @ts-check
const {relative} = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ultra = require('ultra-runner');
const {
  Command,
  CommandType,
  CommandParser,
} = require('ultra-runner/lib/parser');

/** @typedef {'build' | 'build-parallel' | 'clean' | 'develop' | 'lint' | 'fix' | 'serve' | 'typecheck' | 'test' | 'watch'} TishmanCommand */

/**
 * @typedef {Object} Options
 * @property {string[]} [_]
 * @property {boolean | undefined} [all]
 * @property {string[] | undefined} [apps]
 * @property {TishmanCommand} [command]
 */

/**
 * @typedef {Object} ParsedOptions
 * @property {boolean | undefined} [all]
 * @property {string[]} [apps]
 * @property {TishmanCommand} command
 * @property {ultra.PackageJsonWithRoot[]} packages
 */

/**
 * @param {TishmanCommand} cmd
 * @param {ultra.PackageJsonWithRoot[]} packages
 */
function createRunCommand(cmd, packages) {
  const command = new Command([cmd], CommandType.script);
  command.concurrent = true;
  command.children = packages.map((pkg) => {
    const subcommand = new CommandParser(pkg, pkg.root)
      .parse(cmd)
      .setCwd(pkg.root);
    subcommand.name = `${chalk.cyanBright(pkg.name)} at ${chalk.grey(
      relative(process.cwd(), pkg.root),
    )}`;
    subcommand.type = CommandType.script;
    return subcommand;
  });
  return command;
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function build({packages}) {
  const command = createRunCommand('build', packages);
  const runner = new ultra.Runner();
  // HACK: trick ultra runner into treating our build command as a normal script.
  // We do this because we don't use ultra runner's built-in diffing, and
  // forcing a rebuild every time generates overhead and reporting noise.
  runner.buildCmd = 'fakebuild';
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function buildParallel({packages}) {
  const command = createRunCommand('build-parallel', packages);
  const runner = new ultra.Runner();
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function clean({packages}) {
  const command = createRunCommand('clean', packages);
  const runner = new ultra.Runner();
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function develop({packages}) {
  const command = createRunCommand('develop', packages);
  const runner = new ultra.Runner({raw: true});
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function lint({packages}) {
  const command = createRunCommand('lint', packages);
  const runner = new ultra.Runner();
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function fix({packages}) {
  const command = createRunCommand('fix', packages);
  const runner = new ultra.Runner();
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function serve({packages}) {
  const command = createRunCommand('serve', packages);
  const runner = new ultra.Runner({raw: true});
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function typecheck({packages}) {
  const command = createRunCommand('typecheck', packages);
  const runner = new ultra.Runner();
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function test({packages}) {
  const command = createRunCommand('test', packages);
  const runner = new ultra.Runner();
  return runner._run(command);
}

/**
 * @param {ParsedOptions} options
 * @returns {Promise<void>}
 */
async function watch({packages}) {
  const command = createRunCommand('watch', packages);
  const runner = new ultra.Runner();
  return runner._run(command);
}

/**
 * @param {Options} options
 * @param {boolean} [interactive]
 * @returns {Promise<ParsedOptions>}
 */
async function parseOptions(
  /**
   * options, either collected from argv
   * or passed in from the tisman module function.
   */
  options,
  /**
   * Whether or not to prompt for packages if they can't be determined.
   * Defaults to `true`.
   */
  interactive = true,
) {
  const command = /** @type {TishmanCommand} */ (options.command ||
    (options._ ? options._[0] : null));
  if (!command) throw new Error('A command is required!');

  const workspace = await ultra.getWorkspace({
    type: /** @type {import('ultra-runner').WorkspaceProviderType.yarn} */ ('yarn'),
  });

  if (!workspace) {
    throw new Error(`Could not determine workspace from ${process.cwd()}`);
  }

  /**
   * @param {ultra.PackageJsonWithRoot} package
   */
  const hasCommand = ({scripts}) => Boolean(scripts && command in scripts);

  /** @type {ultra.PackageJsonWithRoot[]} */
  let collectedPackages = [];

  if (options.all) {
    collectedPackages = Array.from(workspace.packages.values()).filter(
      hasCommand,
    );
  } else if (options.apps && options.apps.length) {
    for (const app of options.apps) {
      const appName = app.split('/').pop();
      if (!appName) throw new Error(`could not extract app name from ${app}`);
      const key = `@tishman/${appName}`;
      const pkg = workspace.packages.get(key);
      if (pkg && hasCommand(pkg)) collectedPackages.push(pkg);
    }
  } else if (interactive) {
    const prompt = inquirer.createPromptModule();
    const ask = () =>
      prompt({
        type: 'checkbox',
        name: 'packages',
        message: `Which packages would you like to ${command}?\n`,
        prefix: chalk.gray(
          `Note: you can autoselect the packages to ${command}.\nSee --help for more.\n\n`,
        ),
        choices: Array.from(workspace.packages.values())
          .filter(hasCommand)
          .map(({name}) => name)
          .sort(),
      });

    /** @type {{packages: string[]}} */
    let answer = await ask();

    while (!answer.packages.length) {
      console.error(
        `${chalk.red(
          'Error:',
        )} No packages were selected! Use ${chalk.cyan.bold(
          '<space>',
        )} to select!\n`,
      );
      answer = await ask();
    }

    for (const key of answer.packages) {
      const pkg = workspace.packages.get(key);
      if (pkg) collectedPackages.push(pkg);
    }
  }

  if (!collectedPackages.length) {
    if (!options.all && options.apps) {
      throw new Error(
        `Could not find packages matching [${options.apps.join(
          ', ',
        )}] with a ${command} command`,
      );
    } else {
      throw new Error(`Could not find any ${command} commands`);
    }
  }
  return {...options, command, packages: collectedPackages};
}

/**
 * @param {TishmanCommand} command
 * @param  {...string} apps
 * @returns {Promise<void>}
 */
module.exports = async function tishman(command, ...apps) {
  /** @type {Options} */
  const options = {all: apps.length <= 0, apps, command};
  const parsed = await parseOptions(options, false);
  switch (command) {
    case 'build':
      return build(parsed);
    case 'build-parallel':
      return buildParallel(parsed);
    case 'clean':
      return clean(parsed);
    case 'develop':
      return develop(parsed);
    case 'lint':
      return lint(parsed);
    case 'fix':
      return fix(parsed);
    case 'serve':
      return serve(parsed);
    case 'typecheck':
      return typecheck(parsed);
    case 'test':
      return test(parsed);
    case 'watch':
      return watch(parsed);
    default:
      throw new Error(`unrecognized command ${command}`);
  }
};

// If this is module is being run as a script,
// process argv and invoke the appropriate command.
if (
  typeof require !== 'undefined' &&
  require.main === /** @type {unknown} */ (module)
) {
  require('yargs')
    .command({
      command: 'build [apps..]',
      describe: 'Build one or more apps',
      handler: build,
    })
    .command({
      command: 'build-parallel [apps..]',
      describe: 'Build one or more apps, but parallelize work',
      handler: buildParallel,
    })
    .command({
      command: 'clean [apps..]',
      describe: 'Clean one or more apps',
      handler: clean,
    })
    .command({
      command: 'develop [apps..]',
      describe: 'Run one or more apps in develop mode',
      handler: develop,
    })
    .command({
      command: 'lint [apps..]',
      describe: 'Lint one or more apps',
      handler: lint,
    })
    .command({
      command: 'fix [apps..]',
      describe: 'Autofix lint errors for one or more apps',
      handler: fix,
    })
    .command({
      command: 'serve [apps..]',
      describe: 'Build and serve one or more apps',
      handler: serve,
    })
    .command({
      command: 'typecheck [apps..]',
      describe: 'Typecheck one or more apps',
      handler: typecheck,
    })
    .command({
      command: 'test [apps..]',
      describe: 'Test one or more apps',
      handler: test,
    })
    .command({
      command: 'watch [apps..]',
      describe: 'Test and watch one or more apps',
      handler: watch,
    })
    .demandCommand(1)
    .alias('h', 'help')
    .option('all', {
      description: 'Run the command for all apps',
      boolean: true,
    })
    .middleware([parseOptions])
    .usage('$0 <command> [apps..]')
    .example('$0 develop docs', 'Run the docs app in develop mode')
    .example(
      '$0 build docs rockefellercenter',
      'Build the docs and rockefellercenter apps',
    )
    .example('$0 clean --all', 'Clean all of the things!')
    .example('$0 serve', 'Open a prompt to select apps to build and serve')
    .argv;
}
