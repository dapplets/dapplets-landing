const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifyCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const dependents = require('gulp-dependents');
const htmlmin = require('gulp-htmlmin');
const gulpRename = require('gulp-rename');

const src_folder = './src/';
const src_assets_folder = src_folder + 'assets/';
const dist_folder = './dist/';
const dist_assets_folder = dist_folder + 'assets/';
const node_modules_folder = './node_modules/';
const dist_node_modules_folder = dist_folder + 'node_modules/';

const node_dependencies = Object.keys(require('./package.json').dependencies || {});

gulp.task('clear', () => del([dist_folder]));

gulp.task('html', () => {
  return gulp.src([src_folder + '**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      ignoreCustomComments: true,
      removeComments: true
    }))
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});


gulp.task('scss', () => {
  return gulp.src([
    src_assets_folder + 'scss/**/*.scss'
  ], { since: gulp.lastRun('scss') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(dependents())
    .pipe(scss({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulpRename({ prefix: "", suffix: ".min" }))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src([src_assets_folder + 'js/**/*.js'], { since: gulp.lastRun('js') })
    .pipe(plumber())
    .pipe(webpack({
      mode: 'production'
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src([src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'], { since: gulp.lastRun('images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});

gulp.task('vendor', () => {
  if (node_dependencies.length === 0) {
    return new Promise((resolve) => {
      console.log("No dependencies specified");
      resolve();
    });
  }

  return gulp.src(node_dependencies.map(dependency => node_modules_folder + dependency + '/**/*.*'), {
    base: node_modules_folder,
    since: gulp.lastRun('vendor')
  })
    .pipe(gulp.dest(dist_node_modules_folder))
    .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
  return gulp.src([src_assets_folder + 'fonts/**/*'])
    .pipe(gulp.dest(dist_assets_folder + 'fonts'))
});

gulp.task('resources', () => {
  return gulp.src([src_folder + 'resources/**/*'])
    .pipe(gulp.dest(dist_folder))
});

gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: ['dist']
    },
    port: 3000,
    open: false
  });
});

gulp.task('watch', () => {
  const watchImages = [
    src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'
  ];

  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_folder + '**/*.html',
    src_assets_folder + 'scss/**/*.scss',
    src_assets_folder + 'js/**/*.js',
    src_assets_folder + 'fonts/**/*',
    src_folder + 'resources/**/*'
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
  gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('html', 'scss', 'js', 'fonts', 'resources'));
gulp.task('build', gulp.series('clear', 'html', 'scss', 'js', 'images', 'vendor', 'fonts', 'resources'));
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));