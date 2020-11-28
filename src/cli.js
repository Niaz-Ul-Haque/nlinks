import { exit } from 'process';

const chalk = require('chalk');
const link = require('linkinator');
const fs = require('fs');
const readline = require('readline');
const fetch = require('node-fetch');
let globalArgs;
require('dotenv').config();

export function cli(args) {
   globalArgs = args[2];
   let stat = '--all';
   let flag = 0;
   let ifLink = false;
   let telescoped = false;
   if (args[3] == '--ignore' && args[4]) {
      flag = 1;
   }
   if (!args[3]) {
      ifLink = true;
   }
   if (args[2] == '--help' || args[2] == '--h' || args[2] == '-h') {
      getHelp();
      exit();
   } else if (args[2] == undefined) {
      getWhenEmptyArgs();
      exit();
   } else if (args[2] == '--version' || args[2] == '--v' || args[2] == '-v') {
      getVersion();
      exit();
   } else if (args[2] == '--files' || args[2] == '--f' || args[2] == '-f') {
      getFilesSupportedInfo();
      exit();
   } else if (args[3] == '--all' || args[3] == '--good' || args[3] == '--bad') {
      stat = args[3];
   } else if (args[3] == '--telescope') {
      telescoped = true;
   }

   const path = `./${args[2]}`;
   try {
      if (fs.existsSync(path)) {
         processLineByLine();
      } else {
         async function simple() {
            const results = await link.check({
               path: `${args[2]}`,
               concurrency: 1,
            });
            let msg = '';
            if (results.links[0].state != 'BROKEN') {
               switch (results.links[0].state) {
                  case 'OK':
                     msg = 'GOOD';
                     console.log(
                        chalk.green(
                           `${msg} == ${results.links[0].status} => ${results.links[1].parent}`
                        )
                     );
                     break;
                  case 'BROKEN':
                     msg = 'BAD';
                     console.log(
                        chalk.red(
                           `${msg} == ${results.links[0].status} => ${results.links[1].parent}`
                        )
                     );
                     break;
                  default:
                     msg = 'UNKNOWN';
                     console.log(
                        chalk.white(
                           `${msg} == ${results.links[0].status} => ${results.links[1].parent}`
                        )
                     );
                     break;
               }
            } else {
               msg = 'UNKNOWN';
               console.log(
                  chalk.white(`${msg} == ${results.links[0].status} => ${results.links[0].url}`)
               );
            }
         }
         simple();
      }
   } catch (err) {
      console.error(err);
   }

   async function processLineByLine() {
      if (telescoped) {
         getTelescoped();
      }

      const fileStream = fs.createReadStream(args[2]);
      const rl = readline.createInterface({
         input: fileStream,
         crlfDelay: Infinity,
      });
      let i = 1;
      let msg = '';
      if (process.env.CLICOLOR == 0) {
         chalk.level = 0;
      }

      for await (const line of rl) {
         let flag2 = 1;
         const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

         let lineFromFile = line.match(link_reg);
         if (lineFromFile == null) continue;

         if (flag == 1 && flag2 == 1) {
            const ignoreULRfile = fs.createReadStream(args[4]);
            const lineOfUrls = readline.createInterface({
               input: ignoreULRfile,
               crlfDelay: Infinity,
            });
            for await (let l of lineOfUrls) {
               let ignoreURL = l.match(link_reg);
               if (ignoreURL != null) {
                  if (ignoreURL.toString() === lineFromFile.toString()) {
                     console.log('SKIP / IGNORE');
                     flag2 = 1;
                     break;
                  } else {
                     flag2 = 0;
                  }
               }
            }
         }

         if (flag == 1 && flag2 == 1) continue;

         lineFromFile = line.match(link_reg)[0];

         async function simple() {
            const results = await link.check({
               path: lineFromFile,
            });
            switch (results.links[0].status) {
               case 200:
                  msg = 'GOOD';
                  if (stat == '--good' || stat == '--all') {
                     console.log(
                        chalk.green(
                           `${i++} = ${msg} == ${results.links[0].status} => ${
                              results.links[0].url
                           }`
                        )
                     );
                  }
                  break;
               case 404:
               case 400:
                  msg = 'BAD';
                  if (stat == '--bad' || stat == '--all') {
                     console.log(
                        chalk.red(
                           `${i++} = ${msg} == ${results.links[0].status} => ${
                              results.links[0].url
                           }`
                        )
                     );
                  }
                  break;
               default:
                  msg = 'UNKNOWN';
                  if (stat == '--all') {
                     console.log(
                        chalk.white(
                           `${i++} = ${msg} == ${results.links[0].status} => ${
                              results.links[0].url
                           }`
                        )
                     );
                  }
                  break;
            }
         }
         simple();
      }
   }
}

function getHelp() {
   console.log('Help Options');
   console.log("'--v, --version, -v' : Will show the version of the cli");
   console.log("'--h, --help, -h' : Will open up list of params you can use");
   console.log("'--f, --files, -f' : Will show the type of files the program can format");
   console.log("'--all' : Will ouptut all the links");
   console.log("'--good' : Will ouptut only the working links");
   console.log("'--bad' : Will ouptut only the bad links");
}

function getWhenEmptyArgs() {
   console.log('Steps on how this cli works');
   console.log("You should run like this 'nlinks <filename>'");
   console.log("Run the '--help' options for more helpful information");
}

function getVersion() {
   console.log('CLI Name: nlinks');
   console.log('Version: ^0.1');
   console.log('Made by: Mohammed Niaz Ul Haque');
   console.log('Github: https://github.com/Niaz-Ul-Haque/nlinks');
}
function getFilesSupportedInfo() {
   console.log('All the files are supported except for direct links.');
   console.log('Will be adding the functon on release 0.2 or 0.3');
}
async function getTelescoped() {
   fetch('http://localhost:3000/posts')
      .then((response) => {
         return response.json();
      })
      .then((links) => {
         fs.truncate('telescope.txt', 0, function () {
            for (let i = 0; i < 10; i++) {
               fetch(`http://localhost:3000${links[i].url}`)
                  .then((res) => {
                     return res.json();
                  })
                  .then((telescopedLinks) => {
                     fs.appendFile('telescope.txt', telescopedLinks.html, (err) => {
                        if (err) console.log(err).then.process();
                     });
                  });
            }
         });
      });
}
