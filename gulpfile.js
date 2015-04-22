var gulp = require('gulp');

/* Auto load plugins using grung-load-plugins */
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

/* Variables */
var source_directory = 'src/';
var destination_directory = 'public/';

/** Scripts **/
gulp.task('scripts:vendor', function(){
      mainFiles = plugins.mainBowerFiles().concat(source_directory + 'js');
      return gulp.src(mainFiles)
          .pipe(plugins.filter('*.js'))
          .pipe(plugins.concat('vendor.js'))
          .pipe(plugins.uglify())
          .pipe(gulp.dest(destination_directory + 'js'))
});

gulp.task('scripts:app', function() {
    return gulp.src(source_directory + 'js/**/*')
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest(destination_directory + 'js'));
});

gulp.task('scripts', ['scripts:vendor', 'scripts:app']);

/** styles **/
gulp.task('styles:app', function() {
    gulp.src(source_directory + 'scss/**/*.{scss,sass}')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest(destination_directory + 'css'));
});

gulp.task('styles:vendor', function() {
    return gulp.src(plugins.mainBowerFiles('**/*.css'))
        .pipe(plugins.filter('*.css'))
        /* order plugins here
        .pipe(plugins.order([
            'normalize.css',
            '*'
        ]))
        */
        .pipe(plugins.concat('vendor.css'))
        .pipe(gulp.dest(destination_directory + 'css'))
});

gulp.task('styles', ['styles:vendor', 'styles:app']);

/** Clean up **/
gulp.task('clean', function (cb) {
    console.log("Cleaning up");
    var del = require('del');
    del([
        destination_directory + '**/*',
        //'!dist/mobile/deploy.json' negative pattern
    ], cb);
});

/** Watch **/
gulp.task('watch', function() {
    //gulp.watch(source_directory + 'bower_components', ['js:vendor']);
    gulp.watch(source_directory +  'js/**/*.js', ['scripts:app']);
    gulp.watch(source_directory + 'scss/**/*.scss', ['styles:app']);
    console.log("Watching for changes");
});

gulp.task('prod', ['clean', 'styles', 'scripts']);
gulp.task('dev', ['clean', 'styles', 'scripts', 'watch']);
gulp.task('default', ['dev']);

gulp.task('deploy', function(){
    //all the chmoding, moving, renaming would go here
});