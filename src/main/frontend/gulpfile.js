var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = require('yargs').argv,
    lazypipe = require('lazypipe');

var prod = !!argv.prod; // true if --prod flag is used

var paths = {
    js: [
        'js/models/*.js',
        'js/collections/*.js',
        'js/routers/*.js',
        'js/views/*.js',
        'js/app.js'
    ],
    build: {
        base: '../dist'
    },
    webapp: {
        base: '../webapp'
    }
};

var dest = prod ? paths.build.base : paths.webapp.base;

gulp.task('clean', function (cb) {
    return del([paths.build.base], {force: true}, cb);
});

var index = function () {
    if (!prod) {
        return gulp.src(paths.webapp.base + '/index.html')
    }
    return gulp.src(paths.webapp.base + '/index.html')
        .pipe(gulp.dest(dest));
};
var js = function () {
    if (!prod) {
        return gulp.src(paths.js, {cwd: '../webapp'})
    }
    return gulp.src(paths.js, {cwd: '../webapp'})
        .pipe($.if('*.js', minifyJs('app.min.js')()))
        .pipe(gulp.dest(dest));
};
var vendor = function () {
    if (!prod) {
        return gulp.src(bowerFiles())
    }
    return gulp.src(bowerFiles())
        .pipe($.if('*.js', minifyJs('vendor.min.js')()))
        .pipe($.if('*.css', minifyCss('vendor.min.css')()))
        .pipe(gulp.dest(dest));
};

gulp.task('inject', function () {
    return index()
        .pipe($.inject(vendor(), {name: 'bower', relative: true}))
        .pipe($.inject(js(), {name: 'all', relative: true}))
        .pipe(gulp.dest(dest));
});

var minifyJs = function (destFile) {
    return lazypipe()
        .pipe(function () {
            return $.concat(destFile);
        })
        .pipe($.uglify)
};
var minifyCss = function (destFile) {
    return lazypipe()
        .pipe(function () {
            return $.concat(destFile);
        })
        .pipe($.csso);
};

gulp.task('default', function () {
    return runSequence('clean', 'inject');
});
