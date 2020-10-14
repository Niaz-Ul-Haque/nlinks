import { exit } from "process";

const chalk = require("chalk");
const link = require("linkinator");
const fs = require("fs");
const readline = require("readline");

require("dotenv").config();

let flag = 0;

export function cli(args) {
	let stat = "--all";

	if (args[3] == "--ignore" && args[4]){
		flag = 1
	}

	if (args[2] == "--help" || args[2] == "--h" || args[2] == "-h") {
		console.log("Help Options");
		console.log("'--v, --version, -v' : Will show the version of the cli");
		console.log("'--h, --help, -h' : Will open up list of params you can use");
		console.log(
			"'--f, --files, -f' : Will show the type of files the program can format"
		);
		console.log("'--all' : Will ouptut all the links");
		console.log("'--good' : Will ouptut only the working links");
		console.log("'--bad' : Will ouptut only the bad links");
		exit();
	} else if (args[2] == undefined) {
		console.log("Steps on how this cli works");
		console.log("You should run like this 'nlinks <filename>'");
		console.log("Run the '--help' options for more helpful information");
		exit();
	} else if (args[2] == "--version" || args[2] == "--v" || args[2] == "-v") {
		console.log("CLI Name: nlinks");
		console.log("Version: ^0.1");
		console.log("Made by: Mohammed Niaz Ul Haque");
		console.log("Github: https://github.com/Niaz-Ul-Haque/nlinks");
		exit();
	} else if (args[2] == "--files" || args[2] == "--f" || args[2] == "-f") {
		console.log("All the files are supported except for direct links.");
		console.log("Will be adding the functon on release 0.2 or 0.3");
		exit();
	} else if (args[3] == "--all" || args[3] == "--good" || args[3] == "--bad") {
		stat = args[3];
	}

	async function processLineByLine() {
		const fileStream = fs.createReadStream(args[2]);
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		let i = 1;
		let msg = "";
		if (process.env.CLICOLOR == 0) {
			chalk.level = 0;
		}

		for await (const line of rl) {
			let flag2 = 1
			const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

			let myArray = line.match(link_reg);
			if (myArray == null) continue;

			if( flag == 1 && flag2 == 1){
				const ignoreULRfile = fs.createReadStream(args[4]);
				const lineOfUrls = readline.createInterface({
					input: ignoreULRfile,
					crlfDelay: Infinity,
				});
				for await (let l of lineOfUrls) {
					let ignoreURL = l.match(link_reg);
					if (ignoreURL != null){
						if (ignoreURL.toString() === myArray.toString()){
							console.log("SKIP / IGNORE")
							flag2 = 1
							break;
						} else{
							flag2 = 0;
						}
					}
				}
			} 

			if(flag2 == 1) continue;

			myArray = line.match(link_reg)[0];

			async function simple() {
				const results = await link.check({
					path: myArray,
				});
				switch (results.links[0].status) {
					case 200:
						msg = "GOOD";
						if (stat == "--good" || stat == "--all") {
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
						msg = "BAD";
						if (stat == "--bad" || stat == "--all") {
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
						msg = "UNKNOWN";
						if (stat == "--all") {
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
	processLineByLine();
}
