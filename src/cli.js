import { exit } from "process";
const { UrlChecker } = require("broken-link-checker");

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

        let i = 1;
        for await (const line of rl) {
            var myArray = line.replace(/<(.|\n)*?>/g, "");
            //console.log(`${myArray}` );

            const siteChecker = new UrlChecker(
                { 
                    excludeInternalLinks: false,
                    excludeExternalLinks: false, 
                    filterLevel: 0,
                    acceptedSchemes: ["http", "https"]
                },
                {
                    "error": (error) => {
                        console.error(error);
                    },
                    "link": (result, customData) => {
                    
                        if(result.http.response) {
                            console.log(`${i++} === ${result.http.response.statusCode} => ${result.url.original}`);
                        }
                        
                    },
                    "end": () => {
                        //console.log("COMPLETED!");
                    }
                }
            );
            siteChecker.enqueue(myArray);
        }
    }

    processLineByLine();

}