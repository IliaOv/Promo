var gulp = require("gulp"),
  sass = require("gulp-sass"),
  replace = require('gulp-replace'),
  rigger = require('gulp-rigger'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  //uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  cssmin = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  rimraf = require('rimraf'),
  browserSync = require("browser-sync"),
  reload = browserSync.reload;

var path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: 'build/',
    css: 'build/css/',
    js: 'build/js/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: { //Пути откуда брать исходники
    html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    style: 'src/sass/style.scss',
    js: 'src/*.js',
    img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    fonts: 'src/fonts/**/*.*'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'src/**/*.html',
    style: 'src/blocks/**/*.scss',
    js: 'src/*.js',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: "./build"
  },
  //tunnel: true,
  host: 'localhost',
  port: 3000,
  logPrefix: "Frontend_Dev"
};

/*gulp.task("sass", function () {
  return gulp.src("src/sass/style.scss")
    .pipe(sass())
    .pipe(gulp.dest("sass"));
});*/

gulp.task('html:build', function () {
  return gulp.src(path.src.html) //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('style:build', function () {
  return gulp.src(path.src.style) //Выберем наш main.scss
    .pipe(sourcemaps.init()) //То же самое что и с js
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    })) //Скомпилируем
    .pipe(replace('../../', '../'))
    .pipe(prefixer()) //Добавим вендорные префиксы
    .pipe(cssmin()) //Сожмем
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css)) //И в build
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  return gulp.src(path.src.js) //Выберем наш main.scss
    .pipe(sourcemaps.init()) //То же самое что и с js
    .pipe(gulp.dest(path.build.js)) //И в build
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  return gulp.src(path.src.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img)) //И бросим в build
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', gulp.parallel('html:build', 'style:build', 'js:build', 'image:build', 'fonts:build'));


/*gulp.task('watch', function () {
  watch([path.watch.html], function (event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function (event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.img], function (event, cb) {
    gulp.start('image:build');
  });
});*/

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) { //удалить папку build
  rimraf(path.clean, cb);
});

gulp.task('watch', function () {
  gulp.watch(path.watch.html, gulp.series('html:build'));
  gulp.watch(path.watch.style, gulp.series('style:build'));
  gulp.watch(path.watch.js, gulp.series('js:build'));
  gulp.watch(path.watch.img, gulp.series('image:build'));
  gulp.watch(path.watch.fonts, gulp.series('fonts:build'));

});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));