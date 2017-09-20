var gulp = require('gulp');
var inlineResources = require('./inline-resources');
var sass = require('gulp-sass');
var jeditor = require("gulp-json-editor");
var ext_replace = require('gulp-ext-replace');
var argv = require('yargs').argv;
var concat_json = require("gulp-concat-json");
var del = require('del');
var moment = require('moment');
var run = require('gulp-run');
var install = require("gulp-install");
var path = require('path');

const TEMP_FOLDER = '.tmp';
const RELEASE_FOLDER = `release`;


gulp.task('build', ['ngc', 'edit-package-json', 'inline-resources']);
gulp.task('default', ['build']);
gulp.task('publish', ['build'], () => {
    return run(`cd ./${TEMP_FOLDER}/${RELEASE_FOLDER} && npm publish`).exec();
});


gulp.task('clean', () => {
    return del([`${TEMP_FOLDER}/**`]);
});

gulp.task('copy-lib', ['clean'], () => {
    return gulp.src([`${argv.src}/src/**`, `!${argv.src}/src/node_modules`, `!${argv.src}/src/package.json`])
        .pipe(gulp.dest(`./${TEMP_FOLDER}/src`));
});

gulp.task('copy-package-json', ['clean'], () => {
    return gulp.src([`${argv.src}/package.json`, `package-build.json`])
        .pipe(concat_json("package.json"))
        .pipe(jeditor(function (json) {
            var libPackageJson = json[0];
            var builderPackageJson = json[1];
            libPackageJson.devDependencies = builderPackageJson.devDependencies;
            return libPackageJson; // must return JSON object.
        }))
        .pipe(gulp.dest(`./${TEMP_FOLDER}/`));
});
gulp.task('npm-install', ['copy-package-json'], () => {
    return gulp.src(['.tmp/package.json'])
        .pipe(install());
});

gulp.task('ngc', ['copy-lib', 'npm-install'], () => {
    var cmd = path.join('.tmp', 'node_modules', '.bin', 'ngc');
    return run(`${cmd} -p tsconfig.json`).exec();
});

gulp.task('edit-package-json', ['copy-package-json'], () => {
    return gulp.src([`${TEMP_FOLDER}/package.json`])
        .pipe(jeditor(function (json) {
            json.peerDependencies = json.dependencies;
            json.dependencies = undefined;
            json.devDependencies = undefined;
            json.version = `${json.version}-rc.${moment().format('DDMMYYYY-HHmmssSSSS')}`;
            return json; // must return JSON object.
        }))
        .pipe(gulp.dest(`./${TEMP_FOLDER}/${RELEASE_FOLDER}`));
});

gulp.task('copy-html', ['copy-lib'], () => {
    return gulp.src([`./${TEMP_FOLDER}/src/**/*.html`])
        .pipe(gulp.dest(`./${TEMP_FOLDER}/${RELEASE_FOLDER}/src`));
});


gulp.task('copy-assets', ['copy-lib'], () => {
    return gulp.src(['./assets/**/*', '!node_modules/**/*', '!dist/**/*'])
        .pipe(gulp.dest(`./${RELEASE_FOLDER}/assets`));

});

gulp.task('copy-scss', ['copy-lib'], () => {
    return gulp.src([`./${TEMP_FOLDER}/src/**/*.scss`])
        .pipe(sass().on('error', sass.logError))
        //we will keep the sass extension on the css to keep the match in the component styleUrls
        .pipe(ext_replace('.scss'))
        .pipe(gulp.dest(`./${TEMP_FOLDER}/${RELEASE_FOLDER}/src`));
});

// TODO remove html & sass files after inlining
gulp.task('inline-resources', ['ngc', 'copy-html', 'copy-scss'], () => {
    return inlineResources(`./${TEMP_FOLDER}/${RELEASE_FOLDER}/**`);
});

