var gulp = require('gulp');
var sass = require('gulp-sass');
var sync = require('browser-sync');


gulp.task('login_sass',function(){
  return gulp.src('assets/sass/components/login/login.sass')
    .pipe(sass([{ includePaths: ['sass'], outputStyle: 'expanded'}]))
    .pipe(gulp.dest('assets/css'))
})
gulp.task('broswer-sync',function(){
  sync.init(["assets/css/*.css", "app/*/*/*.js","*.html","app/*/*/*.html","app/*.js"], {
        server: {
            baseDir: "./"
        }
    });
})
gulp.task('default',['login_sass'], function(){
  //gulp.watch('assets/sass/*/*',['login_sass'])
})
