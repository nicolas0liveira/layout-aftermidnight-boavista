

const gulp = require('gulp');

//Time - saving synchronised browser testing.
const browsersync = require('browser-sync').create("the cave-server");

//SASS + CSS Injecting
const sass = require('gulp-sass')(require('sass'));

const cached = require('gulp-cached');
const cssnano = require('gulp-cssnano');
//const del = require('del');
const fileinclude = require('gulp-file-include');
const gulpif = require('gulp-if');
const npmdist = require('gulp-npm-dist');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref-plus');
const rename = require('gulp-rename');
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require('gulp-clean-css');

const paths = {
  base: {
    dir: './'
  },
  node: {
    dir: './node_modules'
  },
  packageLock: {
    files: './package-lock.json'
  },
  dist: {
    dir: './dist',
    files: './dist/**/*',
    libsdir: './dist/assets/libs',
    css: {
      dir: './dist/assets/css',
    },
    js: {
      dir: './dist/assets/js',
      dirpages: './dist/assets/js/pages'
    }
  },
  src: {
    dir: './src',
    files: './src/**/*',
    assets: {
      dir: './src/assets',
      files: './src/assets/**/*',
      fonts: {
        dir: './src/assets/fonts',
        files: './src/assets/fonts/**/*'
      },
      img: {
        dir: './src/assets/img',
        files: './src/assets/img/**/*'
      },
      js: {
        dir: './src/assets/js',
        files: './src/assets/js/**/*.js',
        basefiles: './src/assets/js/*.js',
        pages:{
          dir: './src/assets/js/pages',
          files: './src/assets/js/pages/**/*.js',
          basefiles: './src/assets/js/pages/*.js'
        }
      },
      scss: {
        dir: './src/assets/sass',
        files: './src/assets/sass/**/*.scss',
        basefiles: './src/assets/sass/**/*.scss'
      }
    },
    html: {
      dir: './src/html',
      files: './src/html/**/*.html',
      basefiles: './src/html/*.html',
      partials: {
        dir: './src/html/partials',
        files: './src/html/partials/**/*.html',
        default: {
          dir: './src/html/partials/default',
          files: './src/html/partials/default/**/*.html'
        },
        simple: {
          dir: './src/html/partials/simple',
          files: './src/html/partials/simple/**/*'
        }
      }
    }
  }
};


gulp.task('browsersync', function (callback) {
  browsersync.init({
    server: {
      baseDir: [paths.dist.base.dir, paths.src.base.dir, paths.base.base.dir]
    },
  });
  callback();
});

gulp.task('browsersyncReload', function (callback) {
  browsersync.reload();
  callback();
});

gulp.task('watch', function () {
  gulp.watch([paths.src.assets.scss.files], gulp.series('scss', 'browsersyncReload'));
  gulp.watch([paths.src.assets.js.dir], gulp.series('js', 'browsersyncReload'));
  gulp.watch([paths.src.assets.js.pages], gulp.series('jsPages', 'browsersyncReload'));
  gulp.watch([paths.src.html.files], gulp.series('fileinclude', 'browsersyncReload'));
});

gulp.task('js', function () {
  return gulp
    .src(paths.src.assets.js.basefiles)
    // .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js.dir));
});

gulp.task('jsPages', function () {
  return gulp
    .src(paths.src.assets.js.pages.files)
    //  .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js.pages.dir));
});

gulp.task('scss', function () {
  gulp
    .src(paths.src.assets.scss.files)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(paths.dist.css.dir));

  return gulp;
});

gulp.task('fileinclude', function (callback) {
  return gulp
    .src([
      paths.src.html.files,
      '!' + paths.dist.dir,
      '!' + paths.src.html.partials.dir
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(cached())
    .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('clean:packageLock', function (callback) {
  //del.deleteSync(paths.packageLock.files);
  callback();
});

gulp.task('clean:dist', function (callback) {
 // del.deleteSync(paths.dist.dir);
  callback();
});

gulp.task('copy:all', function () {
  return gulp
    .src([
      paths.src.files,
      '!' + paths.src.html.partials.dir, '!' + paths.src.html.partials.files,
      '!' + paths.src.assets.scss.dir, '!' + paths.src.assets.scss.files,
      '!' + paths.src.assets.js.dir, '!' + paths.src.assets.js.files, '!' + paths.src.assets.js.basefiles,
      '!' + paths.src.html.files,
    ])
    .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('copy:libs', function () {
  return gulp
    .src(npmdist(), { base: paths.node.dir })
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
    }))
    .pipe(gulp.dest(paths.dist.libsdir));
});

gulp.task('html', function () {
  return gulp
    .src([
      paths.src.html.files,
      '!' + paths.dist.files,
      '!' + paths.src.html.partials.files
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1assets/libs'))
    .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1assets/libs'))
    .pipe(useref())
    .pipe(cached())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cssnano({ svgo: false })))
    .pipe(gulp.dest(paths.dist.dir));
});

// gulp.task('build', gulp.series(gulp.parallel('clean:tmp', 'clean:packageLock', 'clean:dist', 'copy:all', 'copy:libs'), 'scss', 'html'));
gulp.task('build', gulp.series(gulp.parallel('clean:packageLock', 'clean:dist', 'copy:all', 'copy:libs'), 'scss', 'html'));

gulp.task('default', gulp.series(gulp.parallel('fileinclude', 'scss'), gulp.parallel('browsersync', 'watch')));
//gulp.task('default', gulp.series(gulp.parallel('clean:packageLock', 'clean:dist', 'copy:all', 'copy:libs', 'fileinclude', 'scss', 'js', 'jsPages', 'html'), gulp.parallel('browsersync', 'watch')));
