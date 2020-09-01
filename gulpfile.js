// Main variables and packages
let {src, dest} = require('gulp');
let gulp = require('gulp');


// Added NPM packages
let browsersync = require('browser-sync').create();
let fileinclude = require('gulp-file-include');
let del = require('del');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let group_media = require('gulp-group-css-media-queries');
let clean_css = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let webphtml = require('gulp-webp-html');
let babel = require('gulp-babel');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');

// Main folders destination
let project_folder = 'dist';
let source_folder = '#src';

// Main paths for files
let path = {
    build: {
        html: `${project_folder}/`,
        css: `${project_folder}/css/`,
        js: `${project_folder}/js/`,
        img: `${project_folder}/img/`,
        fonts: `${project_folder}/fonts/`,
    },
    src: {
        html: [`${source_folder}/*.html`, `!${source_folder}/_*.html`],
        css: `${source_folder}/scss/style.scss`,
        js: `${source_folder}/js/script.js`,
        img: `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
        fonts: `${source_folder}/fonts/*.ttf`,
    },
    watch: {
        html: `${source_folder}/**/*.html`,
        css: `${source_folder}/scss/**/*.scss`,
        js: `${source_folder}/js/**/*.js`,
        img: `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
    },
    clean: `./${project_folder}/`
}

// Work with .html files
function html () {
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

// Work with .js files
function js () {
    return src(path.src.js)
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({extname: `.min.js`}))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

// Work with .css / .scss files
function css () {
    return src(path.src.css)
    .pipe(scss({outputStyle: `expanded`}))
    .pipe(group_media())
    .pipe(
        autoprefixer({
            overrideBrowserslist: [`last 5 versions`],
            cascade: true
        })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({extname: `.min.css`}))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

// Work with images
function images () {
    return src(path.src.img)
    .pipe(webp({quality: 70}))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

// Work with fonts
function fonts () {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

// Manual task for gulp fonter [otf]
gulp.task('otf2ttf', function () {
    return gulp.src([`${source_folder}/fonts/*.otf`])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(`${source_folder}/fonts/`))
})

// Run the browsersync code
function browserSync () {
    browsersync.init({
        server: { baseDir: `./${project_folder}/` },
        port: 3000,
        notify: false
    })
}
// Watch files on change
function watchFiles () {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

// Cleaner
function clean () {
    return del(path.clean);
}

// Gulp working
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts))
let watch = gulp.parallel(build, watchFiles, browserSync);

// Expose functions
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;