let gulp = require('gulp');
let gulp_sass = require('gulp-sass');
let browser_sync = require('browser-sync');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let del = require('del');
let autoprefixer = require('gulp-autoprefixer');

gulp.task('clean', async function(){
    del.sync('dist')
});

gulp.task('scss_to_css', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(gulp_sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browser_sync.reload({stream: true}))
});

gulp.task('css', function(){
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browser_sync.reload({stream: true}))
});

gulp.task('html', function(){
    return gulp.src('app/*.html')
        .pipe(browser_sync.reload({stream: true}))
});

gulp.task('script', function(){
    return gulp.src('app/js/*.js')
        .pipe(browser_sync.reload({stream: true}))
});

gulp.task('js', function(){
    return gulp.src([
        'node_modules/slick-carousel/slick/slick.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browser_sync.reload({stream: true}))
});

gulp.task('browser_sync', function(){
    browser_sync.init({
        server: {
            baseDir: 'app/'
        }
    });
});

gulp.task('export', function(){
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
    
  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));   
});

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss_to_css'));
    gulp.watch('app/*.html', gulp.parallel('html'));
    gulp.watch('app/js/*.js', gulp.parallel('script'));
});

gulp.task('build', gulp.series('clean', 'export'))

gulp.task('default', gulp.parallel('css', 'scss_to_css', 'script', 'browser_sync', 'watch'));