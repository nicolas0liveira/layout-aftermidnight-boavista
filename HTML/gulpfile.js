const browsersync = require('browser-sync').create();
const cached = require('gulp-cached');
const cssnano = require('gulp-cssnano');
const del = require('del');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const npmdist = require('gulp-npm-dist');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref-plus');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require('gulp-clean-css');
const rtlcss = require('gulp-rtlcss');

const paths = {
  base: {
    base: {
      dir: './'
    },
    node: {
      dir: './node_modules'
    },
    packageLock: {
      files: './package-lock.json'
    }
  },
  dist: {
    base: {
      dir: './dist',
      files: './dist/**/*'
    },
    libs: {
      dir: './dist/assets/libs'
    },
    css: {
      dir: './dist/assets/css',
    },
    js: {
      dir: './dist/assets/js',
      files: './dist/assets/js/pages',
    },
  },
  src: {
    base: {
      dir: './src',
      files: './src/**/*'
    },
    css: {
      dir: './src/assets/css',
      files: './src/assets/css/**/*'
    },
    html: {
      dir: './src',
      files: './src/**/*.html',
    },
    img: {
      dir: './src/assets/images',
      files: './src/assets/images/**/*',
    },
    js: {
      dir: './src/assets/js',
      pages: './src/assets/js/pages',
      files: './src/assets/js/pages/*.js',
      main: './src/assets/js/*.js',
    },
    partials: {
      dir: './src/partials',
      files: './src/partials/**/*'
    },
    scss: {
      dir: './src/assets/scss',
      files: './src/assets/scss/**/*',
      main: './src/assets/scss/*.scss'
    }
  }
};

function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask

