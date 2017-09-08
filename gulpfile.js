var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var minHTML = require('gulp-htmlmin');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var strip = require('gulp-strip-comments');
var htmlReplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');

const destinationFolder= releaseFolder();

var buildTasksToRun=['clean','html','resources'];

function releaseFolder() {
    var arr = __dirname.split("/");
    var fldr = arr.pop();
    arr.push(fldr + "_release");
    return arr.join("/");
}

console.log(">> Building to " , destinationFolder);

gulp.task('clean',function(){
    return del([destinationFolder],{force: true});
});

/*
Define a task called 'html' the recursively loops through
the widget and control folders, processes each html file and puts
 a processes copy in the 'build' folder
 */
gulp.task('html', function(){
    return gulp.src(['widget/**/*.html','control/**/*.html'],{base: '.'})
    /// replace all the <!-- build:bundleJSFiles  --> comment bodies
    /// with scripts.min.js with cache buster
        .pipe(htmlReplace({
            bundleJSFiles:"scripts.min.js?v=" + (new Date().getTime())
            ,bundleCSSFiles:"styles.min.css?v=" + (new Date().getTime())
        }))

        /// then strip the html from any comments
        .pipe(minHTML({removeComments:true,collapseWhitespace:true}))

        /// write results to the 'build' folder
        .pipe(gulp.dest(destinationFolder));
});

gulp.task('resources', function(){
    return gulp.src(['resources/*', 'plugin.json'],{base: '.'})
        .pipe(gulp.dest(destinationFolder ));
});

var cssTasks=[
    {name:"widgetCSS",src:"widget/**/*.css",dest:"/widget"}
    ,{name:"controlContentCSS",src:"control/content/**/*.css",dest:"/control/content"}
    ,{name:"controlDesignCSS",src:"control/design/**/*.css",dest:"/control/design"}
    ,{name:"controlSettingsCSS",src:"control/settings/**/*.css",dest:"/control/settings"}
];

var cssTaskNames = [cssTasks[0].name, cssTasks[1].name, cssTasks[2].name, cssTasks[3].name];

gulp.task(cssTasks[0].name, function(){
    return gulp.src(cssTasks[0].src, {base: '.'})

    /// minify the CSS contents
        .pipe(minifyCSS())

        ///merge
        .pipe(concat('styles.min.css'))

        /// write result to the 'build' folder
        .pipe(gulp.dest(destinationFolder + cssTasks[0].dest))
});

gulp.task(cssTasks[1].name, function(){
    return gulp.src(cssTasks[1].src, {base: '.'})

    /// minify the CSS contents
        .pipe(minifyCSS())

        ///merge
        .pipe(concat('styles.min.css'))

        /// write result to the 'build' folder
        .pipe(gulp.dest(destinationFolder + cssTasks[1].dest))
});

gulp.task(cssTasks[2].name, function(){
    return gulp.src(cssTasks[2].src, {base: '.'})

    /// minify the CSS contents
        .pipe(minifyCSS())

        ///merge
        .pipe(concat('styles.min.css'))

        /// write result to the 'build' folder
        .pipe(gulp.dest(destinationFolder + cssTasks[2].dest))
});

gulp.task(cssTasks[3].name, function(){
    return gulp.src(cssTasks[3].src, {base: '.'})

    /// minify the CSS contents
        .pipe(minifyCSS())

        ///merge
        .pipe(concat('styles.min.css'))

        /// write result to the 'build' folder
        .pipe(gulp.dest(destinationFolder + cssTasks[3].dest))
});

var jsTasks =[
    {name:"widgetJS",src:"widget/**/*.js",dest:"/widget"}
    ,{name:"controlContentJS",src:"control/content/**/*.js",dest:"/control/content"}
    ,{name:"controlDesignJS",src:"control/design/**/*.js",dest:"/control/design"}
    ,{name:"controlSettingsJS",src:"control/settings/**/*.js",dest:"/control/settings"}
];

var jsTasksNames = [jsTasks[0].name, jsTasks[1].name, jsTasks[2].name, jsTasks[3].name];

gulp.task(jsTasks[0].name, function() {
    return gulp.src(jsTasks[0].src, {base: '.'})

    /// obfuscate and minify the JS files
        .pipe(uglify())

        /// merge all the JS files together. If the
        /// order matters you can pass each file to the function
        /// in an array in the order you like
        .pipe(concat('scripts.min.js'))

        ///output here
        .pipe(gulp.dest(destinationFolder + jsTasks[0].dest));
});

gulp.task(jsTasks[1].name, function() {
    return gulp.src(jsTasks[1].src, {base: '.'})

    /// obfuscate and minify the JS files
        .pipe(uglify())

        /// merge all the JS files together. If the
        /// order matters you can pass each file to the function
        /// in an array in the order you like
        .pipe(concat('scripts.min.js'))

        ///output here
        .pipe(gulp.dest(destinationFolder + jsTasks[1].dest));
});

gulp.task(jsTasks[2].name, function() {
    return gulp.src(jsTasks[2].src, {base: '.'})

    /// obfuscate and minify the JS files
        .pipe(uglify())

        /// merge all the JS files together. If the
        /// order matters you can pass each file to the function
        /// in an array in the order you like
        .pipe(concat('scripts.min.js'))

        ///output here
        .pipe(gulp.dest(destinationFolder + jsTasks[2].dest));
});

gulp.task(jsTasks[3].name, function() {
    return gulp.src(jsTasks[3].src, {base: '.'})

    /// obfuscate and minify the JS files
        .pipe(uglify())

        /// merge all the JS files together. If the
        /// order matters you can pass each file to the function
        /// in an array in the order you like
        .pipe(concat('scripts.min.js'))

        ///output here
        .pipe(gulp.dest(destinationFolder + jsTasks[3].dest));
});


gulp.task('build', function(callback){
    runSequence('clean', 'html', 'resources', jsTasksNames, cssTaskNames, callback);
});