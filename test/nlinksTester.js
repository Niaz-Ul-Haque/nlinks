const chalk = require('chalk');
const link = require('linkinator');
const fs = require('fs');

function linkToCheck(singleLink) {
   try {
      async function simple() {
         //  const results = await link.check({
         //     path: singleLink,
         //     concurrency: 1,
         //  });
         let msg = '';
         if (results.links[0].state != 'BROKEN') {
            switch (results.links[0].state) {
               case 'OK':
                  msg = 'GOOD';
                  return chalk.green(
                     `${msg} == ${results.links[0].status} => ${results.links[0].url}`
                  );

               default:
                  msg = 'UNKNOWN';
                  return chalk.white(
                     `${msg} == ${results.links[0].status} => ${results.links[0].url}`
                  );
            }
         } else {
            msg = 'BAD';
            return chalk.red(`${msg} == ${results.links[0].status} => ${results.links[0].url}`);
         }
      }
      return simple();
   } catch (err) {
      console.error(err);
      return null;
   }
}

module.exports = linkToCheck;
