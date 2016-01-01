var gulp = require('gulp');
var sass = require('gulp-sass');
var sync = require('browser-sync');
var concat = require('gulp-concat');
var connect = require('gulp-connect');


gulp.task('styles', function() {
  return gulp.src('assets/sass/**/*.sass',{ style: 'expanded' })
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('assets/css/'))
});
gulp.task('index_sass', function(){
    return gulp.src('assets/sass/shared/*.sass',{ style: 'expanded' })
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css/shared/'))
});
gulp.task('watch', function() {
  gulp.watch('assets/sass/**/*.sass',['styles','index_sass']);
});

gulp.task('concat',function(){
  return gulp.src('app/components/*/*/*.js')
      .pipe(concat('controllers.js'))
      .pipe(gulp.dest('app/'));
});

gulp.task('serve', function(){
    connect.server();
});

gulp.task('broswer-sync',function(){
  sync.init(["assets/css/**/*.css",
    "app/*/*/*/*.js",
    "app/*/*/*/*.html",
     "app/*/*/*.js",
     "*.html",
     "app/*/*/*.html",
     "app/*.js"], {
        server: {
            baseDir: "./"
        }
    });
})


gulp.task('default',['watch','broswer-sync','styles'], function(){
  
})
