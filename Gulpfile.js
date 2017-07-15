var gulp = require('gulp');
var Hexo = require('hexo');
var request = require('request');
var jeditor = require('gulp-json-editor');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var pump = require('pump');
var runSequence = require('run-sequence');

var browserify = require('gulp-browserify');

var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var jpegrecompress = require('imagemin-jpeg-recompress');

var hexo = new Hexo(process.cwd(), {});

var cloudflare = {
  email : process.env.CF_EMAIL,
  auth_key : process.env.CF_AUTH_KEY,
};

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

function cloudflare_api(url, method, body, cb) {
  return request({
           url : url,
           method : method,
           headers : {
             'X-AUTH-EMAIL' : cloudflare.email,
             'X-AUTH-KEY' : cloudflare.auth_key,
             'Content-Type' : 'application/json'
           },
           body : body,
           json : true
         })
      .pipe(source('resp'))
      .pipe(streamify(jeditor((resp) => {
        if (!resp.success) {
          throw new Error(JSON.stringify(resp.errors));
        };
        return cb(resp);
      })));
};

function purge_cloudflare_cache(zone_id) {
  var url =
      'https://api.cloudflare.com/client/v4/zones/' + zone_id + '/purge_cache';

  return cloudflare_api(url, 'DELETE', {purge_everything : true}, (r) => {
    console.log("cloudflare cache purged successully");
    return r;
  });
};

function get_cloudflare_zoneid(cb) {

  var url = 'https://api.cloudflare.com/client/v4/zones?name=oded.blog';

  return cloudflare_api(url, 'GET', {}, (r) => cb(r.result[0].id));
};

gulp.task('hexo-server', (cb) => { exec_hexo('server', {port : 8080}, cb); });

gulp.task('hexo-deploy', (cb) => { exec_hexo('deploy', {}, cb); });

gulp.task('purge-cloudflare-cache',
          (cb) => { return get_cloudflare_zoneid(purge_cloudflare_cache); });

gulp.task('hexo-clean', (cb) => { exec_hexo('clean', {}, cb); })

gulp.task('hexo-generate',
          (cb) => { exec_hexo('generate', {watch : false}, cb); })

gulp.task('js-compress', (cb) => {
  pump([ gulp.src('./public/**/*.js'), uglify(), gulp.dest('./public') ], cb);
});

gulp.task('css-compress', (cb) => {
  pump(
      [
        gulp.src('./public/**/*.css'),
        minifyCss(
            {debug : true, level : 1, rebase : false},
            (details) => {
              console.log(details.name + ': ' + details.stats.originalSize);
              console.log(details.name + ': ' + details.stats.minifiedSize);
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
          pngquant({speed : 1, quality : 85, verbose : true}), jpegrecompress({
            accuracy : true,
            quality : "high",
            progressive : true,
            strip : true,
            target : 0.85,
            loops : 5
          })
        ]),
        gulp.dest('./public/images')
      ],
      cb);
});

gulp.task('concat-js', (cb) => {
  pump(
      [
        gulp.src('./public/js/bootstrap.js'),
        browserify({insertGlobals : true, debug : true}), uglify(),
        gulp.dest('./public/js')
      ],
      cb);
});

gulp.task('compress', (cb) => {
  runSequence(
      'concat-js',
      [ 'html-compress', 'js-compress', 'image-compress', 'css-compress' ], cb);
});

gulp.task('build', (cb) => {runSequence('hexo-clean', 'hexo-generate', cb)});

gulp.task('server', (cb) => {runSequence('build', 'hexo-server', cb)});

gulp.task('deploy', (cb) => {runSequence('build', 'compress', 'hexo-deploy',
                                         'purge-cloudflare-cache', cb)});

gulp.task('default', [])
