import { exit } from "process";
const chalk = require('chalk');
const link = require('linkinator');


export function cli(args){

    if(args[2] == undefined){
        console.log("Steps on how this cli works");
        console.log("You should run like this 'nlinks <filename or link>'");
        exit();
    }

    const fs = require('fs');
    const readline = require('readline');

    async function processLineByLine() {
    const fileStream = fs.createReadStream(args[2]);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let g = 0, b = 0, u = 0;
    let i = 1;
    let msg = "";
    for await (const line of rl) {
        const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    
        var myArray = (line.match(link_reg));
        if(myArray == null)
                 continue;
         myArray = (line.match(link_reg)[0]);
     
        async function simple() {
            const results = await link.check({
              path: myArray
            });
            
        
            switch(results.links[0].status) {
                case 200:
                    msg = "GOOD";
                    console.log(chalk.green(`${i++} = ${msg} == ${results.links[0].status} => ${results.links[0].url}`));
                    g++;
                    break;
                case 404:
                case 400:
                    msg = "BAD";
                    console.log(chalk.red(`${i++} = ${msg} == ${results.links[0].status} => ${results.links[0].url}`));
                    b++
                    break;
                default:
                    msg = "UNKNOWN";
                    console.log(chalk.white(`${i++} = ${msg} == ${results.links[0].status} => ${results.links[0].url}`));
                    u++;
            }
            console.log("Good =" + g);
            console.log("Bad =" + b);
            console.log("Unknown =" + u);
    }

    simple();
    

 
     }
    }
    processLineByLine();

}