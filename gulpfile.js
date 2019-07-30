let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let minifyCSS = require('gulp-minify-css');
let minifyJS = require('gulp-babel-minify');
let concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
let workboxBuild = require('workbox-build');
let del = require('del');

// let browserSync = require('browser-sync').create();

let clean = () => del([
    './public/css/compressed/*',
    './public/js/compressed/*'
]);

// Global styles
gulp.task('minify-global-css', function(done) {
    gulp.src(['./public/css/buttons.css',
     './public/css/styles.css',
     './public/css/index.css',
     './public/css/media-queries.css',
     './public/css/deviceSpecific.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(minifyCSS())
    .pipe(concat('global.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css/compressed/'));
    // .pipe(browserSync.reload({
    //     stream: true
    // }));
    
    return done();
});

// Chat page specific styles
gulp.task('minify-chat-css', function(done) {
    gulp.src([
        './public/css/themes.css',
        './public/css/modal.css',
        './public/css/chat.css',
    ])
    .pipe(sourcemaps.init())
   .pipe(minifyCSS())
   .pipe(concat('chat.min.css'))
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest('public/css/compressed/'));
//    .pipe(browserSync.reload({
//         stream: true
//     }));

   return done();
});

gulp.task('minify-css', gulp.parallel('minify-global-css', 'minify-chat-css'));

gulp.task('minify-js', function(done) {
    gulp.src([
        './public/js/cookie.min.js',
        './public/js/util.js',
        './public/js/deparam.js',
        './public/js/classie.js',
        './public/js/rendering.js',
        './public/js/chat.js',
        './public/js/messageFormHandlers.js',
        './public/js/TimelineMax.js',
        './public/js/TweenMax.js',
        './public/js/sendSvgAnim.js',
        './public/js/stickerSearch.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.min.js'))
    .pipe(minifyJS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js/compressed/'));
    
    return done();
});


gulp.task('nodemon', function (cb) {
    var callbackCalled = false;
    return nodemon({
        script: './server/server.js',
        ext: 'css js html',
        env: { 'NODE_ENV': 'dev' }
    }).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});

gulp.task('service-worker', function(done) {
    return workboxBuild.injectManifest({
        swSrc: 'public/service-worker-src.js',
        swDest: 'public/service-worker.js',
        globDirectory: 'public',
        globPatterns: [
          'css/compressed/*.css',
          'index.html',
          'chat.html',
          'js/**/*.js',
          'img/**/*.*',
          'manifest.json',
          'manifest.webmanifest'
        ]
    }).then(resources => {
        console.log(`Injected ${resources.count} resources for precaching, ` +
        `totaling ${resources.size} bytes.`);
        return done();

    }).catch(err => {
        console.log('Uh oh 😬', err);
        return done();

    });
});

gulp.task('nodemon-watch', gulp.series('service-worker', 'nodemon', function(done) {
    gulp.watch('./public/service-worker-src.js', gulp.series('service-worker'));

    return gulp.watch(
        ['./public/css/*.css', './public/js/*.js'], 
        gulp.series(clean, 'minify-css', 'minify-js')
    );
}));

gulp.task('build', gulp.series(clean, 'minify-css', 'minify-js', 'service-worker'));


// gulp.task('server', function() {
//     browserSync.init({
//       server: {
//         baseDir: './public/',
//         server: 'server/server.js',
//       },
//     })
// });

/* ******* BrowserSync and Socket.io conflict ******* */
// gulp.task('browserSync', gulp.series('server', 'watch', browserSync.reload));
