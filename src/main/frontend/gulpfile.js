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
        'js/models/**/*.js',
        'js/collections/*.js',
        'js/routers/*.js',
        'js/views/*.js',
        'js/app.js'
    ],
    build : {
        base: 'build',
        js: 'build/js',
        vendor: 'build/vendor',
        index: 'build/index.html'
    },
    webapp : {
        base: '../webapp',
        js: '../webapp/js',
        vendor: '../webapp/vendor',
        index: '../webapp/index.html'
    }
};

gulp.task('clean', function (cb) {
    return del([paths.build.base, paths.webapp.js, paths.webapp.vendor, paths.webapp.index], {force: true}, cb);
});

gulp.task('moveIndex', function () {
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest(paths.build.base));
});

gulp.task('inject', ['moveIndex'], function () {
    var vendor = gulp.src(bowerFiles(), {base: 'bower_components'})
        .pipe($.if('*.js', minifyJs('vendor.min.js')()))
        .pipe($.if('*.css', minifyCss('vendor.min.css')()))
        .pipe(gulp.dest(paths.build.vendor));

    var js = gulp.src(paths.js, {cwd: 'src'})
        .pipe($.if('*.js', minifyJs('app.min.js')()))
        .pipe(gulp.dest(paths.build.js));

    return gulp.src(paths.build.index)
        .pipe($.inject(vendor, {name: 'bower', relative: true}))
        .pipe($.inject(js, {name: 'all', relative: true}))
        .pipe(gulp.dest(paths.build.base));
});

var minifyJs = function (destFile) {
    return lazypipe()
        .pipe(function () {
            return $.if(prod, $.concat(destFile));
        })
        .pipe(function () {
            return $.if(prod, $.uglify());
        });
};
var minifyCss = function (destFile) {
    return lazypipe()
        .pipe(function () {
            return $.if(prod, $.concat(destFile));
        })
        .pipe(function () {
            return $.if(prod, $.csso());
        });
};

gulp.task('moveToWebapp', function () {
    return gulp.src(['build/**'])
        .pipe(gulp.dest(paths.webapp.base))
});

gulp.task('default', function () {
    return runSequence('clean', 'inject', 'moveToWebapp');
});
