# nlinks

nlinks is an open sourced cli program which is used for finding the stauts of websites. You can use any files such as HTML, txt, srv, etc.

Few types of test files are given in the repository. All can be used seperately or you can use your own file.

### Status

```bash
Current version - ^1.1
```

### Installation

```bash
npm i nlinks
```

### Usage

```javascript
nlinks [filename or options or link]
npm run prettier // Source Code Formatter
npm run eslint   // Source Code Linter

// Testing Commands
npm run test
npx jest --coverage
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
nlinks [ filename ] --[ options ] // Pick custom options for better reuslt/understanding of the CLI
nlinks [ filename ] --all  //Output all the links
nlinks [ filename ] --good //Only output good working links
nlinks [ filename ] --bads //Only output bad error links
```

![nlinks2](https://user-images.githubusercontent.com/44411777/95935132-87d8e880-0da0-11eb-986c-eb55dd3c8eba.gif)

### Ignore functionality

nlinks [ filename ] --ignore [ example_ignore_urls.txt]

### Note

This CLI App is built in Visual Studion Code and it has .vscode file to help with inital setup

### Contributing

As this is an open source project, pull requests are very welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### License

[BSD 3-Clause License](https://choosealicense.com/licenses/bsd-3-clause/)
