var gulp = require('gulp'),
    inject = require('gulp-inject'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    path = require('path');


var app = {
    js: [
        'src/js/models/*.js',
        'src/js/collections/*.js',
        'src/js/routers/*.js',
        'src/js/views/*.js',
        'src/js/app.js'
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
    console.log(bowerFiles().map(function(p) {
        return path.relative('bower_components', p);
    }));

    return gulp.src(bowerFiles(), { base: 'bower_components' })
        .pipe(gulp.dest(app.buildDir + '/vendor'));
});

//gulp.task('processIndex', function () {
//    return gulp.src('src/html/index.html')
//        .pipe(gulp.dest('../webapp'));
//});
//
//gulp.task('injectIntoIndex', ['processIndex'], function () {
//    return gulp.src('../webapp/index.html')
//        .pipe(inject(
//            gulp.src(bowerFiles({includeDev: true}), {read: false}),
//            {name: 'bower', relative: true}
//        ))
//        .pipe(inject(
//            gulp.src(app.src, {read: false}),
//            {name: 'all', relative: true}
//        ))
//        .pipe(gulp.dest('../webapp'));
//});

gulp.task('default', function() {
    return runSequence('clean', ['appJs', 'vendor']);
});
