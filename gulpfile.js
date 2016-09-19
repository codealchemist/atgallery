var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();

gulp.task('clean', function () {
  return del('dist/**/*');
});

gulp.task('bundle', function() {
  // Single entry point to browserify
  gulp.src('src/main.js')
    .pipe($.browserify({
      insertGlobals : true
    }))
    .pipe($.rename('bundle.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
  return gulp.src('src/index.html')
    .pipe($.useref({ searchPath: ['./', 'src'] }))
    // .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss()))
    .pipe(gulp.dest('dist'));
});

gulp.task('inject', function () {
  var target = gulp.src('dist/index.html');
  var sources = gulp.src(['dist/bundle.js'], {read: false});

  return target
    .pipe($.inject(sources, {transform: (file) => {
      file = file.replace('/dist/', '')
      return `<script src="${file}"></script>`
    }}))
    .pipe(gulp.dest('dist'));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy', function() {
  gulp.src(['twitter-server.json'])
    .pipe(gulp.dest('dist'));

  return gulp.src([
      'src/**/*',
      '!**/index.html',
      '!**/styles.css',
      '!**/*.ts',
      '!**/*.js'
      ],
      { base : './src' }
    )
    .pipe(gulp.dest('dist'))
});

//------------------------------

gulp.task('build', $.sequence('clean', ['bundle', 'html', 'copy'], 'inject'))
