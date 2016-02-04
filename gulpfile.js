var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');


gulp.task('clean', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('message bundle', function() {
    return gulp.src('src/*.bundle.json')
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('example/'))
        .pipe(notify({ message: 'Messages task complete' }));
});

gulp.task('script', function() {
    return gulp.src('src/**/*.js')
        .pipe(concat('uiForm.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('style', function() {
    return gulp.src('src/**/*.css')
        .pipe(concat('ui-form.css'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('watch', function() {

    // Watch bundle.json files
    gulp.watch('src/**/*.bundle.json', ['message bundle']);

    // Watch .css files
    gulp.watch('src/**/*.css', ['style']);

    // Watch .js files
    gulp.watch('src/**/*.js', ['script']);

    // Watch image files
    //gulp.watch('src/asset/**/*', ['images']);
});

gulp.task('default', ['clean', 'message bundle', 'script', 'style']);
