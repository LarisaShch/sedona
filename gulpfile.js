'use strict';

const gulp = require('gulp'),
  scss = require('gulp-sass'),
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync'),
  minify = require("gulp-csso"),
  imagemin = require("gulp-imagemin"),
  postcss = require("gulp-postcss"),
  posthtml = require("gulp-posthtml"),
  rename = require("gulp-rename"),
  uglify = require('gulp-uglify'),
  server = require("browser-sync").create(),
  reload = browserSync.reload,
  webp = require("gulp-webp"),
  run = require("run-sequence"),
  del = require("del"),
  plumber = require("gulp-plumber"),
  include = require("posthtml-include");;



gulp.task("style", function () {
  gulp.src("src/scss/style.scss")
    .pipe(plumber())
    .pipe(scss())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("build/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("src/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("build/img"));

});

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
      "src/img/**",
      "src/js/**",
      "src/*.html"
    ], {
      base: "src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("js", function () {
  return gulp.src(["src/js/*.js", "!js/*.min.js"])
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"))
});

gulp.task("serve", function () {
  server.init({
    server: "build/"
  });

  gulp.watch("src/scss/**/*.scss", ["style"]);
  gulp.watch("src/*.html", ["html"]);
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "webp",
    "js",
    "html",
    done
  );
});