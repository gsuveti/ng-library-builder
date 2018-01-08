const program = require('commander');
const path = require('path');
const fs = require('fs-extra');
const npm = require('npm-cmd');
const {exec} = require('child_process');
const copy = require('recursive-copy');
const sass = require('node-sass');
const FileHound = require('filehound');
const inlineResources = require('angular-inline-resources');
const moment = require('moment');

program
    .version('0.1.0')
    .option('-r, --rootDir [rootDir]', 'root dir')
    .option('-o, --outDir [outDir]', 'out dir')
    .option('-t, --timestampedVersion', 'timestampedVersion')
    .parse(process.argv);

let rootDir = path.resolve(process.cwd(), program.rootDir || './');
let outDir = path.resolve(process.cwd(), program.outDir || './dist');
let tmpDir = path.join(outDir, '..', '.tmp');
let cwd = process.cwd();

console.log(`Root dir: ${rootDir}`);
console.log(`Out dir: ${outDir}`);


(async function build() {
    const srcDir = path.join(rootDir, 'src');
    const tmpSrcDir = path.join(tmpDir, 'src');
    const releaseDir = path.join(tmpDir, 'release');

    await fs.remove(outDir);
    await fs.remove(tmpDir);

    await fs.copy(srcDir, tmpSrcDir, {
        filter: (src) => {
            if (src === path.join(srcDir, 'node_modules') || src === path.join(tmpSrcDir, 'package.json')) {
                return false;
            }
            return true;
        }
    });
    await copy(`${rootDir}`, `${tmpSrcDir}`, {filter: ['*.+(md|MD)']});

    let tsconfigPath = path.join(cwd, 'tsconfig.json');
    let tsconfigPathDest = path.join(tmpDir, 'tsconfig.json');
    await fs.copy(tsconfigPath, tsconfigPathDest);

    let builderPackageJson = await  fs.readJson(path.join(cwd, 'package-build.json'));
    let libPackageJson = await  fs.readJson(path.join(rootDir, 'package.json'));
    libPackageJson.devDependencies = builderPackageJson.devDependencies;

    await fs.writeJson(path.join(tmpDir, 'package.json'), libPackageJson);

    await runNpmInstall();


    await FileHound.create()
        .paths(tmpSrcDir)
        .ext('scss')
        .find()
        .then(files => {
            files.map(file => {
                sass.render({
                    file,
                    outFile: file,
                    outputStyle: 'compressed',
                }, function (error, result) { // node-style callback from v3.0.0 onwards
                    if (!error) {
                        // No errors during the compilation, write this result on the disk
                        fs.outputFile(file, result.css);
                    }
                });
            })
        });

    await  inlineResources(`${tmpSrcDir}`);

    await runNgc();

    await fs.copy(`${tmpSrcDir}/assets`, `${releaseDir}/assets`);
    copy(`${tmpSrcDir}/i18n`, `${releaseDir}/i18n`, {filter: ['**/*.json']});
    copy(`${tmpSrcDir}`, `${releaseDir}`, {filter: ['**/*.+(md|MD)']});

    let packageJson = await  fs.readJson(path.join(tmpDir, 'package.json'));
    packageJson.peerDependencies = {};
    let dependencies = Object.keys(packageJson.dependencies);
    dependencies.map(dependency => {
        const version = packageJson.dependencies[dependency];
        if (version.startsWith('^')) {
            packageJson.peerDependencies[dependency] = version;
            delete packageJson.dependencies[dependency];
        }
    });

    if (Object.keys(packageJson.peerDependencies).length === 0) {
        packageJson.peerDependencies = undefined;
    }
    if (Object.keys(packageJson.dependencies).length === 0) {
        packageJson.dependencies = undefined;
    }

    packageJson.devDependencies = undefined;
    if (program.timestampedVersion) {
        packageJson.version = `${packageJson.version}-rc.${moment().format('DDMMYYYY-HHmmssSSSS')}`;
    }
    packageJson.main = `public_api.js`;
    let lazyModule = packageJson["lazy-module"];

    await fs.writeJson(path.join(releaseDir, 'package.json'), packageJson);
    await fs.copy(path.join(tmpSrcDir, lazyModule), path.join(releaseDir, lazyModule));
    await copy(releaseDir, outDir);

    return;
})();

async function runNgc() {
    return new Promise((resolve, reject) => {
        var cmd = path.join('./node_modules', '.bin', 'ngc');
        exec(`${cmd} -p tsconfig.json`, {cwd: tmpDir}, function (err, stdout, stderr) {
            if (err) {
                console.log('ngc failed.');
                reject(err);
            } else {
                console.log('ngc succeeded!');
                resolve();
            }
        })
    })

}

async function runNpmInstall() {
    return new Promise((resolve, reject) => {
        npm.install([], {cwd: tmpDir}, function (err) {
            if (err) {
                console.log('installation failed.');
                reject(err);
            } else {
                console.log('installation succeeded!');
                resolve();
            }
        });
    })
}