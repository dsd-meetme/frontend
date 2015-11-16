var gulp = require('gulp');
var sass = require('gulp-sass');
var sync = require('browser-sync');


gulp.task('index_css',function(){
  return gulp.src('assets/sass/index_sass.sass')
    .pipe(sass([{ includePaths: ['sass'], outputStyle: 'expanded'}]))
    .pipe(gulp.dest('assets/css'))
})
gulp.task('broswer-sync',function(){
  sync.init(["assets/css/*.css", "app/*/*.js","*.html"], {
        server: {
            baseDir: "./"
        }
    });
})
gulp.task('default',['index_css','broswer-sync'], function(){
  gulp.watch('assets/sass/*',['index_css'])
})
