#! /usr/local/bin/node

const { spawn } = require('child_process');
const fs = require('fs');

const colors = require('colors');
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const {
  babelrc,
  gitignore,
  index,
  packageJSON,
  webpackConfig,
} = require('./templates');
const { dependencies, devDependencies } = require('./args');

// define the flags that are needed for this tool.
const optionDefinitions = [{ name: 'help', alias: 'h', type: Boolean }];

// define the usage sections
const sections = [
  {
    header: 'create-react-npm-component',
    content: 'generates a skeleton project for a react component to upload to npm',
  },
  {
    header: 'Usage',
    content: ['$ create-react-npm-component [project-name]'],
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'help',
        alias: 'h',
        description: 'Print this usage guide.',
      },
    ],
  },
];

const Do = (cmd, args, callback) => {
  const p = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
  process.stdin.pipe(p.stdin);

  p.on('close', () => {
    if (callback) {
      callback();
    }
  });
};

// the main function
const Main = () => {
  // get the dictionary of options passed in via the command line
  const options = commandLineArgs(optionDefinitions);

  const project = process.argv[2];
  if (options.help || !project) {
    const usage = getUsage(sections);
    console.log(usage); // eslint-disable-line no-console
    return;
  }

  fs.mkdirSync(project);
  process.chdir(project);
  fs.mkdirSync('build');
  fs.mkdirSync('src');

  // write some boilerplate files...
  console.log(colors.green('\nwriting boilerplate files...'));
  const files = [babelrc, gitignore, webpackConfig, index, packageJSON];
  files.forEach((file) => {
    let f;
    if (typeof file.content === 'object') {
      f = JSON.stringify(file.content);
    } else {
      f = file.content;
    }

    fs.writeFile(`./${file.name}`, f, { mode: '755' }, (err) => {
      if (err) {
        console.log(`error writing ${file.name}`);
        console.log(err);
      }
    });
  });

  // start and run the user through npm init...
  console.log(
    colors.green(
      '\nstarting npm init...(you should put src/index.js as the main entrypoint)',
    ),
  );
  Do('npm', ['init'], () => {
    // install dependencies...
    console.log(
      colors.green('\ninstalling npm dependencies, this may take a while...'),
    );
    Do('npm', dependencies, () => {
      // install dev dependencies...
      console.log(
        colors.green('\ninstalling dev dependencies, this may take a while...'),
      );
      Do('npm', devDependencies, () => {
        console.log(`\n[ ${project} ] created successfully`);
        console.log('press any key to exit');
      });
    });
  });
};

Main();
