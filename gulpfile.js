let gulp = require('gulp');
let minifyCSS = require('gulp-minify-css');
let concat = require('gulp-concat');
let browserSync = require('browser-sync').create();

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

gulp.task('watch', function() {
    return gulp.watch('./public/css/*.css', gulp.series('minify-css'));
});