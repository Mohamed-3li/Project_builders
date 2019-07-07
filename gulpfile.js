const { src, dest, parallel } = require('gulp');
const pug          = require('gulp-pug');
const sass         = require('gulp-sass');
const prefixer     = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const livereload   = require('gulp-livereload');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');
const zip          = require('gulp-zip');
const imagemin     = require('gulp-imagemin');
const plumber      = require('gulp-plumber');
const watch        = require('gulp-watch');
const rename       = require('gulp-rename');

// This Function For HTML Task
function html() {
    return watch('src/pug/**/*.pug', function () {
        src('src/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(dest('build'))
        .pipe(livereload())
        livereload.listen()
    }) 
}

// This Function For Css Task
function css() {
    return watch('src/styles/**/*.scss', function () {
        src('src/styles/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputstyle: 'expanded'}))
        .pipe(prefixer('last 2 versions'))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
        .pipe(livereload())
        livereload.listen()
    })
}

// This Function For Js Task
function js() {
    return watch('src/scripts/**/*.js', function () {
        src('src/scripts/*.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(dest('build/js'))
        .pipe(livereload())
        livereload.listen()
    })
}

// This Function For Compress All Images 
function images() {
    return watch('src/images/**.*', function () {
        src('src/images/**.*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'))
        .pipe(livereload())
        livereload.listen()
    })
}

// This Function For Compress Files 
function compress() {
    return watch('build/**/*.*', function () {
        src('build/**/*.*')
        .pipe(zip('.zip'))
        .pipe(dest('.'))
    })
}

// Watching All Tasks 
exports.html = html;
exports.css = css
exports.js = js
exports.images = images
exports.compress = compress
exports.default = parallel(html, css, js, images, compress);