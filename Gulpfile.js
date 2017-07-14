var gulp = require('gulp');
var Hexo = require('hexo');

var pump = require('pump');
var runSequence = require('run-sequence');

var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var hexo = new Hexo(process.cwd(), {});

inhex = hexo.init();

function exec_hexo(fn, args, cb) {
  inhex.then(function() { return hexo.call(fn, args); })
      .then(function() { return hexo.exit(); })
      .then(function() { return cb() })
      .catch(function(err) {
        console.log(err);
        hexo.exit(err);
        return cb(err);
      })
}

gulp.task('clean', function(cb) { exec_hexo('clean', {}, cb); })

gulp.task('generate',
          function(cb) { exec_hexo('generate', {watch : false}, cb); })

gulp.task('js-compress', function(cb) {
  pump([ gulp.src('./public/**/*.js'), uglify(), gulp.dest('./public') ], cb);
});

gulp.task('css-compress', function(cb) {
  pump(
      [
        gulp.src('./public/**/*.css'),
        minifyCss(
            {debug : true, level : 1, rebase : false},
            function(details) {
              console.log(details.name + ': ' + details.stats.originalSize);
              console.log(details.name + ': ' + details.stats.minifiedSize);
            }),
        gulp.dest('./public')
      ],
      cb);
});

gulp.task('html-compress', function(cb) {
  pump(
      [
        gulp.src('./public/**/*.html'), htmlclean(), htmlmin({
          minifyJS : true,
          minifyCSS : true,
          minifyURLs : true,
          removeComments : true,
          removeRedundantAttributes : true,
          sortAttributes : true,
          sortClassName : true
        }),
        gulp.dest('./public')
      ],
      cb);
});

gulp.task('image-compress', function(cb) {
  pump(
      [
        gulp.src('./public/images/**/*.+(jpg|jpeg|gif|png)'), imagemin([
          imagemin.gifsicle({interlaced : true}),
          imagemin.jpegtran({progressive : true}),
          imagemin.svgo({plugins : [ {removeViewBox : true} ]}),
          pngquant({speed : 1, quality : 85, verbose : true})
        ]),
        gulp.dest('./public/images')
      ],
      cb);
});

gulp.task('compress', function(cb) {
  runSequence(
      [ 'html-compress', 'js-compress', 'image-compress', 'css-compress' ], cb);
});

gulp.task('build',
          function(cb) { runSequence('clean', 'generate', 'compress', cb) });

gulp.task('default', [])
