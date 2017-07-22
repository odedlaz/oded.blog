var gulp = require('gulp');
var Hexo = require('hexo');
var inlinesource = require('gulp-inline-source');
var request = require('request');
var jeditor = require('gulp-json-editor');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
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
var yaml = require('yamljs');

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

function purge_cf_cache(zone_id) {
  var url =
      'https://api.cloudflare.com/client/v4/zones/' + zone_id + '/purge_cache';

  return cloudflare_api(url, 'DELETE', {purge_everything : true}, (r) => {
    console.log("cloudflare cache purged successully");
    return r;
  });
};

function get_cf_zone_id(cb) {
  var url = 'https://api.cloudflare.com/client/v4/zones?name=oded.blog';
  return cloudflare_api(url, 'GET', {}, (r) => cb(r.result[0].id));
};

gulp.task('ifttt-webhook', (cb) => {
  var url = "https://maker.ifttt.com/trigger/blog-deployed/with/key/";
  return request({url : url + process.env.IFTTT_KEY, method : 'POST'},
                 (err, resp, body) => { console.log(body); });
});

gulp.task('hexo-deploy', (cb) => { exec_hexo('deploy', {}, cb); });

gulp.task('purge-cloudflare-cache',
          (cb) => { return get_cf_zone_id(purge_cloudflare_cache); });

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
          pngquant({speed : 1, quality : 80, verbose : true}), jpegrecompress({
            method : 'ssim',
            accurate : true,
            progressive : true,
            strip : true,
            target : 0.80,
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

gulp.task('fix-css-font-path', () => {
  var url = yaml.load('_config.yml').url;
  return gulp.src('./public/css/style.css')
      .pipe(replace(/\.\.\/fonts/g, url + '/fonts'))
      .pipe(gulp.dest('./public/css'));
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
  runSequence([ 'concat-js', 'fix-css-font-path' ],
              [ 'js-compress', 'css-compress' ], 'inline-css',
              [ 'html-compress', 'image-compress' ], cb);
});

gulp.task('build', (cb) => {runSequence('hexo-clean', 'hexo-generate', cb)});

gulp.task('post-deploy',
          (cb) => {runSequence([ 'purge-cf-cache', 'ifttt-webhook' ], cb)});

gulp.task('default', (cb) => {runSequence('build', 'compress', cb)});

gulp.task('deploy', (cb) => {runSequence('default', 'google-verification',
                                         'hexo-deploy', 'post-deploy', cb)});
