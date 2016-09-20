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
    .pipe(gulp.dest('dist/app'));
});

gulp.task('html', function () {
  return gulp.src('src/index.html')
    .pipe($.useref({ searchPath: ['./', 'src'] }))
    // .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss()))
    .pipe(gulp.dest('dist/app'));
});

gulp.task('inject', function () {
  var target = gulp.src('dist/app/index.html');
  var sources = gulp.src(['dist/app/bundle.js'], {read: false});

  return target
    .pipe($.inject(sources, {transform: (file) => {
      file = file.replace('/dist/app/', '')
      return `<script src="${file}"></script>`
    }}))
    .pipe(gulp.dest('dist/app'));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy', function() {
  // twitter-server config
  gulp.src(['twitter-server.json'])
    .pipe(gulp.dest('dist/app'));

  // lightgallery fonts and images
  gulp.src(['node_modules/lightgallery/dist/fonts/*'])
    .pipe(gulp.dest('dist/fonts'));

  gulp.src(['node_modules/lightgallery/dist/img/*'])
    .pipe(gulp.dest('dist/img'));

  return gulp.src([
      'src/**/*',
      '!**/index.html',
      '!**/styles.css',
      '!**/*.ts',
      '!**/*.js'
      ],
      { base : './src' }
    )
    .pipe(gulp.dest('dist/app'))
});

//------------------------------

gulp.task('build', $.sequence('clean', ['bundle', 'html', 'copy'], 'inject'))
