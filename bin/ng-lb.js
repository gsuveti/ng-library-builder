#! /usr/bin/env node
var argv = require('yargs').argv;
var shell = require("shelljs");
var path = require('path');

if (argv.rootDir) {
    const ngLibraryBuilderDirAsArray = ['node_modules', '@irian-ro', 'ng-library-builder'];
    const ngLibraryDir = path.join(...ngLibraryBuilderDirAsArray);

    const rootDir = path.join(...ngLibraryBuilderDirAsArray.fill('..'), argv.rootDir);
    const outDir = path.join(...ngLibraryBuilderDirAsArray.fill('..'), argv.outDir ? argv.outDir : 'dist');

    const task = argv.publish ? 'publish' : 'build';
    shell.exec(`cd ${ngLibraryDir} && gulp ${task} --rootDir ${rootDir} --outDir ${outDir}`);
} else {
    console.error("rootDir not defined");
}

cd
