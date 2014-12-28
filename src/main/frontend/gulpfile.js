var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    runSequence = require('run-sequence'),
    path = require('path');

var app = {
    js: [
        'js/models/*.js',
        'js/collections/*.js',
        'js/routers/*.js',
        'js/views/*.js',
        'js/app.js'
    ],
    buildDir: 'build'
};

gulp.task('clean', function (cb) {
    return del([app.buildDir], cb);
});

gulp.task('appJs', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest(app.buildDir + '/js'));
});

gulp.task('vendor', function () {
    return gulp.src(bowerFiles(), {base: 'bower_components'})
        .pipe(gulp.dest(app.buildDir + '/vendor'));
});

gulp.task('processIndex', function () {
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest(app.buildDir));
});

gulp.task('injectIntoIndex', ['processIndex'], function () {
    var vendors = bowerFiles().map(function (p) {
        return 'vendor/' + path.relative('bower_components', p);
    });
    return gulp.src(app.buildDir + '/index.html')
        .pipe($.inject(
            gulp.src(vendors, {read: false, cwd: app.buildDir}),
            {name: 'bower', relative: true}
        ))
        .pipe($.inject(
            gulp.src(app.js, {read: false, cwd: app.buildDir}),
            {name: 'all', relative: true}
        ))
        .pipe(gulp.dest(app.buildDir));
});

gulp.task('moveToWebapp', function () {
    return gulp.src(['build/**'])
        .pipe(gulp.dest('../webapp'))
});

gulp.task('default', function () {
    return runSequence('clean', ['appJs', 'vendor'], 'injectIntoIndex', 'moveToWebapp');
});
