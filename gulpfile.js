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

const OUT_DIR = argv.outDir || 'dist';
const TEMP_DIR = path.join(OUT_DIR, '..', '.tmp');
const RELEASE_DIR = `release`;
const ROOT_DIR = argv.rootDir;
const timestampedVersion = argv.timestampedVersion;

console.log("ng-lb build started");
console.log(`rootDir folder: ${ROOT_DIR}`);
console.log(`outDir folder: ${OUT_DIR}`);

gulp.task('build', ['ngc', 'edit-package-json', 'copy-main-readme','inline-resources', 'copy-assets', 'copy-i18n', 'copy-release-to-dist', 'copy-readmes']);
gulp.task('default', ['build']);
gulp.task('publish', ['build'], () => {
    return run(`cd ./${OUT_DIR} && npm publish`).exec();
});


gulp.task('clean', () => {
    del([`${OUT_DIR}/**`], {force: true});
    return del([`${TEMP_DIR}/**`], {force: true});
});

gulp.task('copy-lib', ['clean'], () => {
    return gulp.src([`${ROOT_DIR}/src/**`, `!${ROOT_DIR}/src/node_modules`, `!${ROOT_DIR}/src/package.json`])
        .pipe(gulp.dest(`./${TEMP_DIR}/src`));
});

gulp.task('copy-tsconfig', ['clean'], () => {
    return gulp.src([`tsconfig.json`])
        .pipe(gulp.dest(`./${TEMP_DIR}`));
});

gulp.task('copy-main-readme', ['clean'], () => {
    return gulp.src([`${ROOT_DIR}/*.+(md|MD)`])
        .pipe(gulp.dest(`./${TEMP_DIR}/src`));
});


gulp.task('copy-package-json', ['clean'], () => {
    return gulp.src([`${ROOT_DIR}/package.json`, `package-build.json`])
        .pipe(concat_json("package.json"))
        .pipe(jeditor(function (json) {
            var libPackageJson = json[0];
            var builderPackageJson = json[1];
            libPackageJson.devDependencies = builderPackageJson.devDependencies;
            return libPackageJson; // must return JSON object.
        }))
        .pipe(gulp.dest(`./${TEMP_DIR}/`));
});
gulp.task('npm-install', ['copy-package-json'], () => {
    return gulp.src([`${TEMP_DIR}/package.json`])
        .pipe(install());
});

gulp.task('ngc', ['copy-lib', 'copy-tsconfig', 'npm-install'], () => {
    var cmd = path.join('node_modules', '.bin', 'ngc');
    var absoluteTempFolder = path.join(process.cwd(), TEMP_DIR);
    return run(`cd ${absoluteTempFolder} && ${cmd} -p tsconfig.json`).exec();
});

gulp.task('edit-package-json', ['copy-package-json'], () => {
    return gulp.src([`${TEMP_DIR}/package.json`])
        .pipe(jeditor(function (json) {
            json.peerDependencies = {};
            let dependencies = Object.keys(json.dependencies);
            dependencies.map(dependency => {
                const version = json.dependencies[dependency];
                if (version.startsWith('^')) {
                    json.peerDependencies[dependency] = version;
                    delete json.dependencies[dependency];
                }
            });

            if (Object.keys(json.peerDependencies).length === 0) {
                json.peerDependencies = undefined;
            }
            if (Object.keys(json.dependencies).length === 0) {
                json.dependencies = undefined;
            }

            json.devDependencies = undefined;
            if (timestampedVersion) {
                json.version = `${json.version}-rc.${moment().format('DDMMYYYY-HHmmssSSSS')}`;
            }
            json.main = `public_api.js`;
            return json; // must return JSON object.
        }))
        .pipe(gulp.dest(`./${TEMP_DIR}/${RELEASE_DIR}`));
});

gulp.task('copy-html', ['copy-lib'], () => {
    return gulp.src([`./${TEMP_DIR}/src/**/*.html`])
        .pipe(gulp.dest(`./${TEMP_DIR}/${RELEASE_DIR}`));
});


gulp.task('copy-assets', ['copy-lib'], () => {
    return gulp.src([`./${TEMP_DIR}/src/assets/**/*`, '!node_modules/**/*', '!dist/**/*'])
        .pipe(gulp.dest(`./${TEMP_DIR}/${RELEASE_DIR}/assets`));

});

gulp.task('copy-i18n', ['copy-lib'], () => {
    return gulp.src([`./${TEMP_DIR}/src/i18n/*.json`, '!node_modules/**/*', '!dist/**/*'])
        .pipe(gulp.dest(`./${TEMP_DIR}/${RELEASE_DIR}/i18n`));

});

gulp.task('copy-scss', ['copy-lib'], () => {
    return gulp.src([`./${TEMP_DIR}/src/**/*.scss`])
        .pipe(sass().on('error', sass.logError))
        //we will keep the sass extension on the css to keep the match in the component styleUrls
        .pipe(ext_replace('.scss'))
        .pipe(gulp.dest(`./${TEMP_DIR}/${RELEASE_DIR}`));
});



gulp.task('copy-readmes', ['copy-lib'], () => {
    return gulp.src([`./${TEMP_DIR}/src/**/*.+(md|MD)`])
        .pipe(gulp.dest(`./${TEMP_DIR}/${RELEASE_DIR}`));
});

// TODO remove html & sass files after inlining
gulp.task('inline-resources', ['ngc', 'copy-html', 'copy-scss'], () => {
    return inlineResources(`./${TEMP_DIR}/${RELEASE_DIR}/**`);
});


gulp.task('copy-release-to-dist', ['edit-package-json', 'inline-resources', 'copy-assets', 'copy-i18n'], () => {
    return gulp.src([`./${TEMP_DIR}/${RELEASE_DIR}/**/*.*`])
        .pipe(gulp.dest(`./${OUT_DIR}`));

});
