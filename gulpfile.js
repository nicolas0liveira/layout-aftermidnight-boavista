//https://symfonycasts.com/screencast/gulp/sass

const gulp = require('gulp');

const npmdist = require('gulp-npm-dist');


//provides you with a simple web server and auto-reloads the page in all browsers on all devices
const browsersync = require('browser-sync').create("the cave-server");

//transform Sass into CSS
const sass = require('gulp-sass')(require('sass'));

const cached = require('gulp-cached');

//minifies CSS
const cssnano = require('gulp-cssnano');//cssnano insted of gulp-cssnano

//clears the build directory and deletes everything in it
const clean = require('gulp-clean');

const gulpif = require('gulp-if');

const fileinclude = require('gulp-file-include');

const replace = require('gulp-replace');

//adds .min to the name of a minified file
const rename = require('gulp-rename');

const useref = require('gulp-useref-plus');

// adds vendor prefixes to CSS rules 
//const autoprefixer = require("autoprefixer");//autoprefixer insted of gulp-autoprefixer
const autoprefixer = require("gulp-autoprefixer");

//maps the CSS styles back to the original SCSS file in your browser dev tools
const sourcemaps = require("gulp-sourcemaps");

//merges several CSS or several JS files
const concat = require('gulp-concat');

//minifies JS
const uglify = require('gulp-uglify');

//minify the css
const cleanCSS = require('gulp-clean-css');

//gerar documentação do css
const sassdoc = require('sassdoc');
const sassdocextras = require('sassdoc-extras');


//paths para reuso
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
  doc: {
    dir: './docs',
    cssdir: './docs/css'
  },
  dist: {
    dir: './dist',
    files: './dist/**/*',
    libsdir: './dist/libs',
    pages: {
      dir: './dist/js/pages',
      files: './dist/js/pages/**/*.js'
    },
    css: {
      dir: './dist/css',
    },
    js: {
      dir: './dist/js',
      dirpages: './dist/js/pages'
    }
  },
  src: {
    dir: './src',
    files: './src/**/*',
    dir: './src',
    files: './src/**/*',
    img: {
      dir: './src/img',
      files: './src/img/**/*'
    },
    js: {
      dir: './src/js',
      files: './src/js/**/*.js',
      basefiles: './src/js/*.js',
      pages:{
        dir: './src/js/pages',
        files: './src/js/pages/**/*.js',
        basefiles: './src/js/pages/*.js'
      }
    },
    scss: {
      dir: './src/scss',
      files: './src/scss/**/*.scss',
      basefiles: './src/scss/**/*.scss'
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

gulp.task('sassdoc', function () {
  let options = {
    dest: paths.doc.cssdir,
    verbose: false,
    package: 'package.json',
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true,
    },
    groups: {
      'undefined': 'General',
      helpers: 'Helpers',
      bar: 'Bar group',
    },

    shortcutIcon: paths.src.img.dir +'/favicon.ico',

  };
  return gulp.src(paths.src.scss.files)
    .pipe(sassdoc(options));
});

gulp.task('clean:sassdoc', function (callback) {
  return gulp.src(paths.doc.cssdir, {
    allowEmpty: true,
    read: false
  })
    .pipe(clean());
  callback();
});

gulp.task('clean:dist', function (callback) {
  return gulp.src(paths.dist.dir, {
    allowEmpty: true,
    read: false
  })
    .pipe(clean());
  callback();
});

gulp.task('copy:libs', function () {
  return gulp
    .src(npmdist(), { base: paths.node.dir })
    .pipe(rename(function (path) {
        path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
    }))
    .pipe(gulp.dest(paths.dist.libsdir));
});

//copy every file except negative globs, indicated by !
gulp.task('copy:otherfiles', function (callback) {
  return gulp
    .src([
      paths.src.files,
      '!' + paths.src.html.dir + '/**',
      '!' + paths.src.html.partials.dir + '/**',
      '!' + paths.src.scss.dir + '/**',
      '!' + paths.src.js.dir + '/**',
    ])
    .pipe(gulp.dest(paths.dist.dir));
  callback();
});

gulp.task('process:css', function (callback) {
  gulp.src(paths.src.scss.files)
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
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.css.dir));
  callback();
});

// concatenate and copy all JavaScript (except vendor scripts)
gulp.task('process:js', function (callback) {
  return gulp.src([paths.src.js.files])
    .pipe(gulp.dest(paths.dist.js.dir))
    .pipe(concat('app-all.js'))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(paths.dist.js.dir));
  callback();
});

gulp.task('process:jspages', function (callback) {
  return gulp.src([paths.src.js.pages.files])
    .pipe(gulp.dest(paths.dist.js.pages.dir))
    .pipe(concat('pages-all.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js.pages.dir));
  callback();
})

gulp.task('process:html', function () {
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
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1/libs'))
    .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1/libs'))
    .pipe(useref())
    .pipe(cached())
    .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('browsersync', function (callback) {
  browsersync.init({
    server: {
      baseDir: [paths.dist.dir, paths.src.dir, paths.base.dir]
    },
  });
  callback();
});

gulp.task('browsersyncReload', function (callback) {
  browsersync.reload();
  callback();
});

gulp.task('watch', function () {
  gulp.watch([paths.src.scss.files], gulp.series('process:css', 'browsersyncReload'));
  gulp.watch([paths.src.js.dir], gulp.series('process:js', 'browsersyncReload'));
  gulp.watch([paths.src.html.files, paths.src.html.partials.files], gulp.series('process:html', 'browsersyncReload'));
});

gulp.task('build', gulp.series('clean:dist', 'copy:libs', 'copy:otherfiles', 'process:css', 'process:js', 'process:html','sassdoc'));

gulp.task('default', 
gulp.series('clean:dist', 'copy:libs', 'copy:otherfiles', 'process:css', 'process:js', 'process:html'
  , gulp.parallel('browsersync', 'watch')));

