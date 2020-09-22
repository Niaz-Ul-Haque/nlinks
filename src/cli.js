import { exit } from "process";
const chalk = require("chalk");
const link = require("linkinator");
const fs = require("fs");
const readline = require("readline");

export function cli(args) {
	if (args[2] == "--help" || args[2] == "--h" || args[2] == "/h") {
		console.log("Help Options");
		console.log("'--v, --version, /v' : Will show the version of the cli");
		console.log("'--h, --help, /h' : Will open up list of params you can use");
		console.log(
			"'--f, --files, /f' : Will show the type of files the program can format"
		);
		exit();
	} else if (args[2] == undefined) {
		console.log("Steps on how this cli works");
		console.log("You should run like this 'nlinks <filename>'");
		exit();
	} else if (args[2] == "--version" || args[2] == "--v" || args[2] == "/v") {
		console.log("Version: ^0.1");
		exit();
	} else if (args[2] == "--files" || args[2] == "--f" || args[2] == "/f") {
		console.log("All the files are supported except for direct links.");
		console.log("Will be adding the functon on release 0.2 or 0.3");
		exit();
	}

	async function processLineByLine() {
		const fileStream = fs.createReadStream(args[2]);
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		let i = 1;
		let msg = "";

		for await (const line of rl) {
			const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

			let myArray = line.match(link_reg);
			if (myArray == null) continue;
			myArray = line.match(link_reg)[0];

			async function simple() {
				const results = await link.check({
					path: myArray,
				});
				switch (results.links[0].status) {
					case 200:
						msg = "GOOD";
						console.log(
							chalk.green(
								`${i++} = ${msg} == ${results.links[0].status} => ${
									results.links[0].url
								}`
							)
						);
						break;
					case 404:
					case 400:
						msg = "BAD";
						console.log(
							chalk.red(
								`${i++} = ${msg} == ${results.links[0].status} => ${
									results.links[0].url
								}`
							)
						);
						break;
					default:
						msg = "UNKNOWN";
						console.log(
							chalk.white(
								`${i++} = ${msg} == ${results.links[0].status} => ${
									results.links[0].url
								}`
							)
						);
				}
			}
			simple();
		}
	}

	processLineByLine();
}
