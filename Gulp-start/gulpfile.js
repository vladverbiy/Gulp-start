const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");

const cssFiles = ["./src/css/main.css", "./src/css/media.css"];

const jsFiles = ["./src/js/lib.js", "./src/js/main.js"];

function styles() {
  return gulp
    .src(cssFiles)

    .pipe(concat("style.css"))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )

    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(jsFiles)

    .pipe(concat("script.js"))

    .pipe(
      uglify({
        toplevel: true
      })
    )

    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream());
}

function clean() {
  return del(["build/*"]);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("./src/css/**/*.css", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./*.html").on("change", browserSync.reload);
  gulp.watch("./src/scss/**/*.scss", gulpCompile);
}

function gulpCompile() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./src/css/"));
}

gulp.task("del", clean);
gulp.task("styles-concat", styles);
gulp.task("scripts-concat", scripts);
gulp.task("gulpCompile", gulpCompile);
gulp.task("watch", watch);
gulp.task("build", gulp.series(clean, styles, scripts,));
