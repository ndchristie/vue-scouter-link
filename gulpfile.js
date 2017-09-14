var gulp = require('gulp');
const babel = require('gulp-babel');
var vueify = require('gulp-vueify');

gulp.task('vueify', function () {
  return gulp.src('./src/components/**/*.vue')
    .pipe(vueify())
    .pipe(babel())
    .pipe(gulp.dest('./lib'));
});
