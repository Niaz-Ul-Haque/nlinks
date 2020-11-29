const linkToCheck = require('./nlinksTester');
const originalConsoleLogFn = global.console.log;
const originalConsoleErrorFn = global.console.error;
const chalk = require('chalk');
jest.mock('linkinator');
const link = require('linkinator');
const fs = require('fs');

test('testing custom link - Mock Test Good Link - https://google.com', async () => {
   let expected = chalk.green(`GOOD == 200 => https://google.com/`);
   link.check.mockReturnValue(
      Promise.resolve({ links: [{ state: 'OK', status: 200, url: `https://google.com/` }] })
   );
   expect(await linkToCheck(`https://google.com`)).toBe(expected);
});

test('testing custom link - MOck Test Bad Link - https://google.com', async () => {
   let expected = chalk.red(`BAD == 404 => https://google.com/`);
   link.check.mockReturnValue(
      Promise.resolve({ links: [{ state: 'BROKEN', status: 404, url: `https://google.com/` }] })
   );
   expect(await linkToCheck(`https://google.com`)).toBe(expected);
});

test('testing custom link - Mock Test | No link send - ""', async () => {
   let expected = chalk.white(`UNKNOWN == 0 => `);
   link.check.mockReturnValue(
      Promise.resolve({ links: [{ state: 'UNKNOWN', status: 0, url: '' }] })
   );
   expect(await linkToCheck('')).toBe(expected);
});

test('testing custom link - Mock Test | Integer send - ""', async () => {
   let expected = chalk.white(`UNKNOWN == 0 => `);
   link.check.mockReturnValue(
      Promise.resolve({ links: [{ state: 'UNKNOWN', status: 0, url: '' }] })
   );
   expect(await linkToCheck(234)).toBe(expected);
});
/*

const linkToCheck = require('./nlinksTester');
const originalConsoleLogFn = global.console.log;
const originalConsoleErrorFn = global.console.error;
const chalk = require('chalk');
const link = require('linkinator');
const fs = require('fs');

describe('nlinks tester', () => {
   let logOutput = null;
   let errorOutput = null;

   function testLogFn(...args) {
      logOutput = logOutput || [];
      args.forEach((arg) => logOutput.push(arg));
   }

   function testErrorFn(...args) {
      errorOutput = errorOutput || [];
      args.forEach((arg) => errorOutput.push(arg));
   }

   function finalize(output) {
      if (output && Array.isArray(output)) {
         return output.join('');
      }
      return output;
   }

   beforeEach(() => {
      // setDefaultConfig();
      global.console.log = testLogFn;
      global.console.error = testErrorFn;

      logOutput = null;
      errorOutput = null;
   });

   afterEach(() => {
      global.console.log = originalConsoleLogFn;
      global.console.error = originalConsoleErrorFn;

      logOutput = null;
      errorOutput = null;
   });
   test('testing custom link - https://google.com', () => {
      let expected = chalk.green(`GOOD == 200 => https://google.com/`);
      expect(finalize(`https://google.com`)).toBe(expected);
   });
});


*/
