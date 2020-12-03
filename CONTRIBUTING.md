### Installation

```bash
npm i nlinks
```

### Usage

```javascript
nlinks [filename or options or link]
```

### Options

```bash
Options available (v0.1) >
     * '--v, --version, -v' : Will show the version of the cli
     * '--h, --help, -h' : Will open up list of params you can use
     * '--f, --files, -f' : Will show the types of files the program can format
     * '--ignore' : Will the files provided. See exmaple below.
```

```javascript
nlinks [ link ] //Output the result of the link
nlinks [ filename ] --[ options ]       // Pick custom options for better reuslt/understanding of the CLI
nlinks [ filename ] --all               // Output all the links
nlinks [ filename ] --good              // Only output good working links
nlinks [ filename ] --bads              // Only output bad error links

npm run prettier                        // Source Code Formatter
npm run eslint                          // Source Code Linter

// Testing Commands
npm run test
npx jest --coverage
```


![nlinks2](https://user-images.githubusercontent.com/44411777/95935132-87d8e880-0da0-11eb-986c-eb55dd3c8eba.gif)

### Ignore functionality

nlinks [ filename ] --ignore [ example_ignore_urls.txt]

### Note

This CLI App is built in Visual Studion Code and it has .vscode file to help with inital setup
