/**
 * Created by Rich
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
gulp.task('build', function () {
    var tsResult = gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            //declaration: "true",
            removeComments: "true",
            module: "commonjs",
            sortOutput: "true",
            out: "game.js"
        }));
    return [
        tsResult.js.pipe(sourcemaps.write(".")).pipe(gulp.dest('bin-debug')),
        //tsResult.dts.pipe(gulp.dest('bin-debug'))//生成d.ts文件
    ];
});
