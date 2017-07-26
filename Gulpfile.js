var gulp = require('gulp');
var Hexo = require('hexo');
var inlinesource = require('gulp-inline-source');
var request = require('request');
var pump = require('pump');
var runSequence = require('run-sequence');
var del = require('del');
var rename = require("gulp-rename");
var browserify = require('gulp-browserify');
var vinylPaths = require('vinyl-paths');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var replace = require('gulp-replace');
var jpegrecompress = require('imagemin-jpeg-recompress');
var jpegtran = require('imagemin-jpegtran');
var yaml = require('yamljs');
var URL = require('url-parse');
var download = require('gulp-download');
var autoprefixer = require('gulp-autoprefixer');

var hexo = new Hexo(process.cwd(), {});

var cloudflare = require('gulp-cloudflare');

inhex = hexo.init();

function exec_hexo(fn, args, cb) {
  inhex.then(() => hexo.call(fn, args))
      .then(() => hexo.exit())
      .then(() => cb())
      .catch((err) => {
        console.log(err);
        hexo.exit(err);
        return cb(err);
      });
};

gulp.task('ifttt-webhook', (cb) => {
  var url = "https://maker.ifttt.com/trigger/blog-deployed/with/key/";
  return request({url : url + process.env.IFTTT_KEY, method : 'POST'},
                 (err, resp, body) => { console.log(body); });
});

gulp.task('hexo-deploy', (cb) => { exec_hexo('deploy', {}, cb); });

gulp.task('purge-cf-cache', (cb) => {
  var url = new URL(yaml.load('_config.yml').url);
  cloudflare({
    email : process.env.CF_EMAIL,
    token : process.env.CF_AUTH_KEY,
    domain : url.hostname,
    action : 'fpurge_ts',
    skip : false
  });
});

gulp.task('hexo-clean', (cb) => { exec_hexo('clean', {}, cb); })

gulp.task('hexo-generate',
          (cb) => { exec_hexo('generate', {watch : false}, cb); })

gulp.task('js-compress', (cb) => {
  pump([ gulp.src('./public/**/*.js'), uglify(), gulp.dest('./public') ], cb);
});

gulp.task('css-compress', (cb) => {
  pump(
      [
        gulp.src('./public/**/*.css'), autoprefixer(),
        minifyCss({debug : true, level : 1, rebase : false},
                  (details) => {
                    console.log(details.name + ': ' +
                                details.stats.originalSize + ' => ' +
                                details.stats.minifiedSize);
                  }),
        gulp.dest('./public')
      ],
      cb);
});

gulp.task('html-compress', (cb) => {
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

gulp.task('image-compress', (cb) => {
  pump(
      [
        gulp.src('./public/images/**/*.+(jpg|jpeg|gif|png|svg)'), imagemin([
          imagemin.gifsicle({interlaced : true}),
          imagemin.svgo({plugins : [ {removeViewBox : true} ]}),
          pngquant({speed : 1, quality : 80, verbose : true}),
          jpegtran({progressive : true}), jpegrecompress({
            method : 'ssim',
            accurate : true,
            progressive : true,
            strip : true,
            target : 0.80,
            loops : 6
          })
        ]),
        gulp.dest('./public/images')
      ],
      cb);
});

gulp.task('inline-css', () => {
  return gulp.src('./public/**/*.html')
      .pipe(inlinesource({compress : true, rootpath : 'public'}))
      .pipe(gulp.dest('./public'));
});

gulp.task('google-verification', (cb) => {
  return gulp.src("./public/google010b2effcd572c56")
      .pipe(vinylPaths(del))
      .pipe(rename("./public/google010b2effcd572c56.html"))
      .pipe(gulp.dest("./"));
});

gulp.task('compress', (cb) => {
  runSequence([ 'js-compress', 'css-compress' ], 'inline-css',
              [ 'html-compress', 'image-compress' ], cb);
});

gulp.task('fix-css-font-path', () => {
  var url = yaml.load('_config.yml').url;
  return gulp.src('./public/css/fonts.css')
      .pipe(replace(/\.\.\/fonts/g, url + '/fonts'))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('browserify', (cb) => {
  pump(
      [
        gulp.src('./public/js/bootstrap.js'),
        browserify({insertGlobals : true, debug : true}), uglify(),
        gulp.dest('./public/js')
      ],
      cb);
});

gulp.task('fetch-newest-gitment', function() {
  return download('https://imsun.github.io/gitment/dist/gitment.browser.js')
      .pipe(replace(/gh-oauth\.imsun\.net/g, 'gh-auth.oded.blog'))
      .pipe(gulp.dest('./public/js'))
});
gulp.task(
    'build',
    (cb) => {runSequence(
        'hexo-clean', 'hexo-generate',
        [ 'browserify', 'fix-css-font-path', 'fetch-newest-gitment' ], cb)});

gulp.task('post-deploy',
          (cb) => {runSequence([ 'purge-cf-cache', 'ifttt-webhook' ], cb)});

gulp.task('default', (cb) => {runSequence('build', 'compress', cb)});

gulp.task('deploy', (cb) => {runSequence('default', 'google-verification',
                                         'hexo-deploy', 'post-deploy', cb)});
