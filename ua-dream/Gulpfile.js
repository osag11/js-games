'use strict'

const paths = require('./config').basePaths

const gulp = require('gulp')
const { dest, series, src } = require('gulp');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
// const rev = require('gulp-rev');
// const revRewrite = require('gulp-rev-rewrite');


function assetsScripts() {
	return (
		gulp
			.src([paths.tilecraft.scripts.src])
			.pipe(gulp.dest(paths.tilecraft.scripts.build))
	)
}

function assetsImages() {
	return (
		gulp
			.src(paths.tilecraft.images.src)
			.pipe(gulp.dest(paths.tilecraft.images.release))
	)
}

let rev;
let revRewrite;

const revision = series(
	async () => {
		rev = await import('gulp-rev');
		revRewrite = await import('gulp-rev-rewrite');
	},

	() => src(`${paths.tilecraft.build}/**/*.{css,js}`)
		.pipe(rev.default())
		.pipe(src(`${paths.tilecraft.build}/**/*.html`))
		.pipe(revRewrite.default())
		.pipe(dest(paths.tilecraft.release))
);

function cleanFolders() {
	return gulp.src([
		paths.tilecraft.build + '*', 
		paths.tilecraft.release + '*'
	], { read: false })
	.pipe(clean());

}

function zipRelease() {

	return (
		gulp.src(`${paths.tilecraft.release}/**`)
			.pipe(zip('tilecraft.zip'))
			.pipe(gulp.dest(paths.tilecraft.release))
	)
}



const assets = gulp.series(assetsImages, assetsScripts);
const build = gulp.series(cleanFolders, assets, revision, zipRelease);

exports.default = build;
exports.build = build;
exports.clean = cleanFolders;
