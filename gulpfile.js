let gulp = require('gulp');
let minifyCSS = require('gulp-minify-css');
let minifyJS = require('gulp-babel-minify');
let concat = require('gulp-concat');
// let browserSync = require('browser-sync').create();

// Global styles
gulp.task('minify-global-css', function(clean) {
    gulp.src(['./public/css/buttons.css',
     './public/css/styles.css',
     './public/css/index.css',
     './public/css/media-queries.css',
    ])
    .pipe(minifyCSS())
    .pipe(concat('global.min.css'))
    .pipe(gulp.dest('public/css/compressed/'));
    // .pipe(browserSync.reload({
    //     stream: true
    // }));
    
    return clean();
});

// Chat page specific styles
gulp.task('minify-chat-css', function(clean) {
    gulp.src([
        './public/css/themes.css',
        './public/css/modal.css',
        './public/css/chat.css',
    ])
   .pipe(minifyCSS())
   .pipe(concat('chat.min.css'))
   .pipe(gulp.dest('public/css/compressed/'));
//    .pipe(browserSync.reload({
//         stream: true
//     }));

   return clean();
});

gulp.task('minify-css', gulp.parallel('minify-global-css', 'minify-chat-css'));

// gulp.task('browserSync', function() {
//     browserSync.init({
//       server: {
//         baseDir: 'server'
//       },
//     })
// });

gulp.task('minify-js', function(clean) {
    gulp.src([
        './public/js/getCookie.js',
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
    .pipe(concat('bundle.min.js'))
    .pipe(minifyJS())
    .pipe(gulp.dest('public/js/compressed/'));
    
    return clean();
});

gulp.task('watch', function(clean) {
    return gulp.watch(['./public/css/*.css', './public/js/*.js'], gulp.parallel('minify-css', 'minify-js'));
});