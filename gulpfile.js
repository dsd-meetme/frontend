var gulp = require('gulp');
var sass = require('gulp-sass');
var sync = require('browser-sync');
var concat = require('gulp-concat');
var connect = require('gulp-connect');


gulp.task('sass_compile_org', function () {
    return gulp.src('assets/sass/components/organization/organization.sass', {style: 'expanded'})
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css/generated'))
});
gulp.task('sass_compile_user', function () {
    return gulp.src('assets/sass/components/user/user.sass', {style: 'expanded'})
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css/generated'))
});
gulp.task('sass_compile_global', function () {
    return gulp.src('assets/sass/global/global.sass', {style: 'expanded'})
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css/generated'))
});
gulp.task('sass_compile_presentation', function(){
    return gulp.src('assets/sass/components/presentation/*.sass', {style: 'expanded'})
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css/generated'))
});
gulp.task('sass_compile', ['sass_compile_global','sass_compile_user', 'sass_compile_org','sass_compile_presentation']);
gulp.task('broswer-sync', function () {
    sync.init(["assets/css/generated/*.css",
        "app/*/*/*/*.html",
        "*.html",
        "app/*/*/*.html",
        "app/dist/*.js"], {
        server: {
            baseDir: "./"
        }
    });
});
gulp.task('watch', function () {
    gulp.watch('assets/sass/**/*.sass', ['sass_compile']);
    gulp.watch('app/*/*/*/*.js', ['concat']);
    gulp.watch('app/configuration/*.js', ['concat']);
});
gulp.task('concat_presentation', function(){
    return gulp.src('app/components/presentation/*.js')
        .pipe(concat('controllers_presentation.js'))
        .pipe(gulp.dest('app/dist'));
});
gulp.task('concat_controllers_user', function () {
    return gulp.src('app/components/user/*/*.js')
        .pipe(concat('controllers_user.js'))
        .pipe(gulp.dest('app/dist'));
});
gulp.task('concat_controllers_organization', function () {
    return gulp.src('app/components/organization/*/*.js')
        .pipe(concat('controllers_org.js'))
        .pipe(gulp.dest('app/dist'));
});
gulp.task('concat_services_directives', function () {
    return gulp.src('app/shared/*/*.js')
        .pipe(concat('services_directives.js'))
        .pipe(gulp.dest('app/dist'));
});
gulp.task('concat_configuration', function () {
    return gulp.src('app/configuration/*.js')
        .pipe(concat('angular_app_config.js'))
        .pipe(gulp.dest('app/dist'));
});
gulp.task('concat', ['concat_configuration', 'concat_services_directives', 'concat_controllers_organization', 'concat_controllers_user', 'concat_presentation']);


gulp.task('production', ['sass_compile','concat']);


gulp.task('dev', ['watch', 'broswer-sync', 'sass_compile', 'concat']);

gulp.task('default', ['watch', 'broswer-sync', 'sass_compile'], function () {

});
