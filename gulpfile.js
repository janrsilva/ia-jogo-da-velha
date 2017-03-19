var gulp = require('gulp');
var pug = require('gulp-pug');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
livereload = require('gulp-livereload');

gulp.task('scripts', function () {
    return gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './application/views/resources/js/index.js',
    ])
            .pipe(concat('app.js'))
            .pipe(gulp.dest('application/public/js'))
            .pipe(rename('app.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('application/public/js'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./application/views/resources/**/*', ['scripts']);
});

gulp.task('default', [ 'scripts', 'watch']);