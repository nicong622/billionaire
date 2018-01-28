const gulp = require('gulp');
const del = require('del');

// Load plugins
const $ = require('gulp-load-plugins')();
const browserify = require('browserify');
const watchify = require('watchify');
const rev = require('gulp-rev');
const minifyCss = require('gulp-minify-css');
const replace = require('gulp-replace');
let source = require('vinyl-source-stream'),
  sourceFile = './app/scripts/app.js',
  destFolder = './dist/scripts',
  destFileName = 'app.js';

const nodemon = require('gulp-nodemon');

const browserSync = require('browser-sync');

const reload = browserSync.reload;

// Styles
gulp.task('styles', ['css']);

gulp.task('css', ['swiper'], () => gulp.src('app/styles/**/main.css')
  .pipe(minifyCss())
  .pipe($.autoprefixer('last 1 version'))
  .pipe(rev())
  .pipe(gulp.dest('dist/styles'))
  .pipe($.size()));

gulp.task('swiper', () => gulp.src('app/styles/swiper.min.css')
  .pipe(gulp.dest('dist/styles'))
  .pipe($.size()));

const bundler = watchify(browserify({
  entries: [sourceFile],
  debug: true,
  insertGlobals: true,
  cache: {},
  packageCache: {},
  fullPaths: true,
}));

bundler.on('update', rebundle);
bundler.on('log', $.util.log);

function rebundle() {
  return bundler.bundle()
  // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source(destFileName))
    .pipe(gulp.dest(destFolder))
    .on('end', () => {
      reload();
    });
}

// Scripts
gulp.task('scripts', rebundle);

gulp.task('buildScripts', () => browserify(sourceFile)
  .bundle()
  .pipe(source(destFileName))
  .pipe(gulp.dest('dist/scripts')));


// HTML
gulp.task('html', () => gulp.src('app/*.html')
  .pipe($.useref())
  .pipe(gulp.dest('dist'))
  .pipe($.size()));

// Images
gulp.task('images', () => gulp.src('app/images/**/*')
  // .pipe($.cache($.imagemin({
  //    optimizationLevel: 3,
  //    progressive: true,
  //    interlaced: true
  // })))
  .pipe(gulp.dest('dist/images'))
  .pipe($.size()));

// Clean
gulp.task('clean', (cb) => {
  $.cache.clearAll();
  cb(del.sync(['dist']));
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], () => gulp.src('./app/*.html')
  .pipe($.useref.assets())
  .pipe($.useref.restore())
  .pipe($.useref())
  .pipe(gulp.dest('dist')));

gulp.task('buildBundle', ['styles', 'buildScripts', 'bower'], () => gulp.src('./app/*.html')
  .pipe($.useref.assets())
  .pipe($.useref.restore())
  .pipe($.useref())
  .pipe(gulp.dest('dist')));

// Bower helper
gulp.task('bower', () => {
  gulp.src('app/bower_components/**/*.js', {
    base: 'app/bower_components',
  })
    .pipe(gulp.dest('dist/bower_components/'));
});

gulp.task('json', () => {
  gulp.src('app/scripts/json/**/*.json', {
    base: 'app/scripts',
  })
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('lib', () => gulp.src(['app/scripts/lib/*.js'])
  .pipe(gulp.dest('dist/scripts/lib'))
  .pipe($.size()));

// Watch
gulp.task('watch', ['clean', 'html', 'bundle'], () => {
  browserSync({
    notify: false,
    logPrefix: 'BS',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['dist', 'app'],
  });

  // Watch .json files
  gulp.watch('app/scripts/**/*.json', ['json']);

  // Watch .html files
  gulp.watch('app/*.html', ['html']);

  gulp.watch(['app/styles/**/*.scss', 'app/styles/**/*.css'], ['styles', reload]);

  // Watch image files
  gulp.watch('app/images/**/*', reload);
});

// Build
gulp.task('build', ['html', 'buildBundle', 'images', 'lib'], () => {
  gulp.src('dist/scripts/**/*')
    .pipe($.uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/scripts'));
});

// Server
gulp.task('server', () => {
  nodemon({
    script: './server/index.js',
  });
});

// Default task
gulp.task('default', ['clean', 'build']);
