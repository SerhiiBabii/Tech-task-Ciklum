import gulp from 'gulp';
import babel from 'gulp-babel';
import { create as browserSync } from 'browser-sync';
import sass from 'gulp-sass';
import rimraf from 'rimraf';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';

const cssIndexFiles = ['./src/styles/*.scss',];

// SERVER
gulp.task('server', () => {
  browserSync().init({
    server: {
      port: 9000,
      baseDir: './',
    },
  });
  gulp.watch(cssIndexFiles, gulp.series('styles:compileIndex'));
  gulp.watch('./*.html').on('change', browserSync().reload);
});

// JS
gulp.task('js', () => {
  return gulp
    .src(['./src/js/**/*.js',])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env',],
      })
    )
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/js'));
});

// SASS
gulp.task('styles:compileIndex', () => {
  return gulp
    .src(cssIndexFiles)
    .pipe(sass({ outputStyle: 'compressed', }).on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync().stream());
});

// CLEANER
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

// WATCHERS
gulp.task('watch', () => {
  gulp.watch(cssIndexFiles, gulp.series('styles:compileIndex'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
});

gulp.task('dev', gulp.series('styles:compileIndex', 'js', gulp.parallel('watch', 'server')));

gulp.task(
  'default',
  gulp.series('clean', gulp.parallel('styles:compileIndex', 'js'), gulp.parallel('watch', 'server'))
);
