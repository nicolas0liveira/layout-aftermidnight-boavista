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

// dds vendor prefixes to CSS rules 
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
        dir: './src/assets/scss',
        files: './src/assets/scss/**/*.scss',
        basefiles: './src/assets/scss/**/*.scss'
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


gulp.task('clean:dist', function () {
  return gulp.src(paths.dist.dir, {
    allowEmpty: true,
    read: false
  })
    .pipe(clean());
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
gulp.task('copy:otherfiles', function (done) {
  return gulp
    .src([
      paths.src.files,
      '!' + paths.src.html.files,
      '!' + paths.src.html.partials.dir,
      '!' + paths.src.html.partials.files,
      '!' + paths.src.assets.scss.dir,
      '!' + paths.src.assets.scss.files,
      '!' + paths.src.assets.js.dir,
      '!' + paths.src.assets.js.files,
    ])
    .pipe(gulp.dest(paths.dist.dir));
  done();
});

gulp.task('process:css', function (done) {
  gulp.src(paths.src.assets.scss.files)
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
  done();
});

// concatenate and copy all JavaScript (except vendor scripts)
gulp.task('process:js', function (done) {
  return gulp.src([paths.src.assets.js.files])
    .pipe(gulp.dest(paths.dist.js.dir))
    .pipe(concat('bundle-all.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js.dir));
  done();
});

gulp.task('process:html', function () {
  return gulp
    .src([
      paths.src.html.files,
      '!' + paths.dist.base.files,
      '!' + paths.src.partials.files
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
    .pipe(gulp.dest(paths.dist.base.dir));
});


gulp.task('build', gulp.series('clean:dist', 'copy:libs', 'copy:otherfiles', 'process:css', 'process:js'));

