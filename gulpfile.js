// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('client/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('client/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('client/dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('client/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('client/dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('client/dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('client/js/*.js', ['lint', 'scripts']);
    gulp.watch('client/scss/*.scss', ['sass']);
});

gulp.task('develop', function () {
  nodemon({ script: 'app.js'
          , watch: ['app.js', 'server/*']
          , ext: 'js'
          , tasks: ['build'] })
    .on('restart', function () {
      console.log('restarted!')
    });
});

gulp.task('build', ['lint', 'sass', 'scripts']);

// Default Task
gulp.task('default', ['build', 'develop']);