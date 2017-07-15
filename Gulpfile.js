var gulp = require('gulp');
var Hexo = require('hexo');
var request = require('request');
var gutil = require('gulp-util');

var pump = require('pump');
var runSequence = require('run-sequence');

var browserify = require('gulp-browserify');

var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var hexo = new Hexo(process.cwd(), {});

var cloudflare = {
  email : process.env.CF_EMAIL,
  auth_key : process.env.CF_AUTH_KEY
};

function get_cloudflare_zone_id(cb) {

  var on_response = function(err, response, body) {
    if (err) {
      throw err;
    }

    if (!body.success) {
      throw new Error(JSON.stringify(body));
    }

    cb(body.result[0]['id']);
  };

  request({
    url : 'https://api.cloudflare.com/client/v4/zones?name=oded.blog',
    method : 'GET',
    headers : {
      'X-AUTH-EMAIL' : cloudflare.email,
      'X-Auth-Key' : cloudflare.auth_key,
      'Content-Type' : 'application/json'
    },
    json : true
  },
          on_response);
};

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

gulp.task('hexo-server',
          function(cb) { exec_hexo('server', {port : 8080}, cb); });

gulp.task('hexo-deploy', function(cb) { exec_hexo('deploy', {}, cb); });

gulp.task('purge-cloudflare-cache', function(cb) {
  var on_response = function(err, response, body) {
    if (err) {
      throw err;
    }

    if (!body.success) {
      throw new Error(JSON.stringify(body));
    }
    console.log("cloudflare cached purged successully");

    cb();
  };

  get_cloudflare_zone_id(function(zone_id) {
    request({
      url : 'https://api.cloudflare.com/client/v4/zones/' + zone_id +
                '/purge_cache',
      method : 'DELETE',
      headers : {
        'X-AUTH-EMAIL' : cloudflare.email,
        'X-Auth-Key' : cloudflare.auth_key,
        'Content-Type' : 'application/json'
      },
      body : {purge_everything : true},
      json : true
    },
            on_response);
  });
});

gulp.task('hexo-clean', function(cb) { exec_hexo('clean', {}, cb); })

gulp.task('hexo-generate',
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

gulp.task('concat-js', function(cb) {
  pump(
      [
        gulp.src('./public/js/bootstrap.js'),
        browserify({insertGlobals : true, debug : true}), uglify(),
        gulp.dest('./public/js')
      ],
      cb);
});

gulp.task('compress', function(cb) {
  runSequence(
      'concat-js',
      [ 'html-compress', 'js-compress', 'image-compress', 'css-compress' ], cb);
});

gulp.task('build',
          function(cb) { runSequence('hexo-clean', 'hexo-generate', cb) });

gulp.task('server', function(cb) { runSequence('build', 'hexo-server', cb) });

gulp.task('deploy', function(cb) {
  runSequence('build', 'compress', 'hexo-deploy', 'purge-cloudflare-cache', cb)
});

gulp.task('default', [])
