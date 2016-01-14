/**
 * Created by Rich
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
gulp.task('buildJS', function () {
    var tsResult = gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            declaration: "true",
            //removeComments: "true",//去除注释
            module: "commonjs",
            sortOutput: "true",
            out: "engine.js"
        }));
    return [
        tsResult.js.pipe(sourcemaps.write(".")).pipe(gulp.dest('bin-debug'))
    ];
});

gulp.task('buildDTS', function () {
    var tsResult = gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            declaration: "true",
            //removeComments: "true",//去除注释
            module: "commonjs",
            sortOutput: "true",
            out: "engine.js"
        }));
    return [
        tsResult.dts.pipe(gulp.dest('bin-debug'))//发布d.ts文件
    ];
});
