var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
$.vinylPaths = require("vinyl-paths"),
	$.del = require('del'),
	$.vinylPaths = require('vinyl-paths'),
	$.browserSync = require('browser-sync');

//构建的基本信息
var version = "1.0.1";
//初始化项目结构
var mkdirp = require('mkdirp');
var fs = require('fs');

var moduledir={
	srcPages:'./src/pages/',
	srcJS : './src/js/', //JS生产目录
	srcLess : './src/less/', //less源文件目录
	srcCss :'./src/css/', //less源文件目录
	srcCSSbase : './src/less/base', //less源文件目录
	srcCSScomp : './src/less/components', //less源文件目录
	srcCSScomp : './src/less/components', //less源文件目录
	srcCSSmixin : './src/less/base/mixin', //less源文件目录
	srcFont : './src/fonts/', //字体图标源文件目录 
	srcImage : './src/img/', //图片源文件目录
	libs :'./libs', //生产目录
	test : './test', //生产目录
	doc : './doc', //生产目录doc
	dest : './dist'; //生产目录
}
var files={
	srcCSSbutton : './src/less/components/button.less', //less源
	srcCSSinput : './src/less/components/input.less', //less源文件
	srcCSScombine : './src/less/style.less', //less源文件目录
	srcCSSvars : './src/less/base/variables.less', //less源文件目录
	srcCSSreset : './src/less/base/reset.less', //less源文件目录
	srcCSSglobal : './src/less/base/global.less', //less源文件目录
	srcCSSgrid : './src/less/base/grid.less', //less源文件目录
readme : './README.md'; //生产目录
//bowermodule="./dist/lib" //依赖资源文档的目录
bowermoduleFile : "./.bowerrc";
gitignore : './.gitignore'; //生产目录
}
var srcPages = './src/pages/', //页面源文件目录
	srcJS = './src/js/', //JS生产目录
	srcLess = './src/less/', //less源文件目录
	srcCss = './src/css/', //less源文件目录
	srcCSSbase = './src/less/base', //less源文件目录
	srcCSScomp = './src/less/components', //less源文件目录
	srcCSScomp = './src/less/components', //less源文件目录
	srcCSSbutton = './src/less/components/button.less', //less源文件目录
	srcCSSinput = './src/less/components/input.less', //less源文件目录
	srcCSScombine = './src/less/style.less', //less源文件目录
	srcCSSvars = './src/less/base/variables.less', //less源文件目录
	srcCSSreset = './src/less/base/reset.less', //less源文件目录
	srcCSSglobal = './src/less/base/global.less', //less源文件目录
	srcCSSgrid = './src/less/base/grid.less', //less源文件目录
	srcCSSmixin = './src/less/base/mixin', //less源文件目录
	//  src = './dist', //生产目录
	srcFont = './src/fonts/', //字体图标源文件目录 
	srcImage = './src/img/', //图片源文件目录
	libs = './libs', //生产目录
	test = './test', //生产目录
	doc = './doc', //生产目录doc
	dest = './dist'; //生产目录
readme = './README.md'; //生产目录
//bowermodule="./dist/lib" //依赖资源文档的目录
bowermoduleFile = "./.bowerrc";
gitignore = './.gitignore'; //生产目录
//添加到数组当中
var dirs = [srcPages, srcJS, srcLess, srcCss, srcCSSbase, srcCSSmixin, srcCSScomp, srcFont, srcImage, libs, test, doc, dest];
var fsfiles = [srcCSSinput, srcCSSbutton, srcCSScombine, srcCSSvars, srcCSSreset, srcCSSglobal, srcCSSgrid, gitignore, readme,bowermoduleFile];
//初始化目录结构
gulp.task("initdir", function() {
		dirs.forEach(function(e) {
			mkdirp(e, function(err) {
				if(err) console.error(err);
				else console.log(e + " was created!");
			});
		})
	})
	//初始化文件  书写多行内容 后面添加
gulp.task("initfile", function() {
	fsfiles.forEach(function(e) {
		var initStr;
		switch(e) {
			case "./.gitignore":
				initStr = "node_modules";
				break;
			case "./.bowerrc":
				initStr = '{"directory" : "libs"}';
				break;
			default:
				initStr = "";
				break

		}
		fs.writeFile(e, initStr, function(err) {
			if(err) {
				return console.log(err);
			} else console.log(e + " was saved!");
		})
	})
})
gulp.task("browserSync", function() {
	$.browserSync({
		files: "test/view/demo.css",
		server: {
			baseDir: "./"
		}
	});
});

gulp.task("imgmin", function() {
	return gulp.src('src/images/*')
		.pipe(imgmin())
		.pipe(gulp.dest("dist/images"))
});
//dist 将css目录下的不必要的文件清空
gulp.task("delcss", function() {
	return gulp.src("dist/css/*.css")
		.pipe($.vinylPaths($.del));
});

//css的处理：删除样式表，编译、前缀、压缩、重命名、导出两份样式文件
gulp.task("build:css", ["delcss"], function() { //如果有任务依赖 放在依赖任务列表中
	return gulp.src('src/less/style.less') //需要执行的编译文件
		.pipe($.less()) //less编译 
		.pipe($.autoprefixer({
			browsers: ">1%"
		}))
		.pipe($.rename({
			suffix: "." + version,
			baseme: "zjsdcdstyle"
		})) //basename就是主文件的名字  
		.pipe(gulp.dest('dist/css')) //可以同时生成一个不压缩的样式文件
		.pipe($.cleanCss()) //压缩css文件
		.pipe($.rename({
			suffix: ".min." + version,
			basename: "zjstyle"
		})) //basename就是主文件的名字  
		.pipe(gulp.dest('dist/css')); //编译为同名的文件,如果没有这个文件夹 会创建这个文件

});
//dist 压缩图片：对必要的图片进行压缩
gulp.task("build:imgmin", function() {
	return gulp.src('src/images/*')
		.pipe($.imagemin())
		.pipe(gulp.dest("dist/images"));

});
//删除清空不必要的js文件
gulp.task("deljs", function() {
	return gulp.src("dist/js/*.js")
		.pipe($.vinylPaths($.del))
});
//js目录的整理  包括删除产出目录的文档 ，压缩生产结构的脚本，压缩，重命名，导出
gulp.task("build:js", ["deljs"], function() {
	return gulp.src('src/js/*.js')
		.pipe($.concat("combine.js"))
		.pipe($.uglify())
		.pipe($.rename({
			suffix: ".min"
		}))
		.pipe($.concat("combine.js"))
		.pipe($.uglify())
		.pipe($.rename({
			suffix: "." + version + ".min",
			basename: "zjframe"
		}))
		.pipe(gulp.dest('dist/js'));

});
//删除清空不必要的html文件
gulp.task("delhtml", function() {
	return gulp.src("dist/pages/**/*")
		.pipe($.htmlclean())
		.pipe($.vinylPaths($.del));
});
//拷贝页面文件
var htmlclean = require('gulp-htmlclean');
gulp.task("build:copyhtmldir", ["delhtml"], function() {
	return gulp.src(['src/pages/**/*'])
		.pipe(gulp.dest('dist/pages'));
});
//编译发布过程,所有任务异步执行
gulp.task("build", ["build:css", "build:js", "build:imgmin", "build:copyhtmldir"], function() {
	console.log("--------------导出生产版本文件，进行项目构建--------------");
});
//测试gulp 是否安装成功
gulp.task("test", function() {
	console.log("gulp安装成功命令");
});
//获取仓库的主文件
var mainBowerFiles = require("main-bower-files");
//吧下载的前端模块的主文件加载到lib当中 ,如何配置获取压缩版本的主文件？只获取主文件，不同项目需要的文件可以手动配置
gulp.task("bowerfiles", function() {
		return gulp.src(mainBowerFiles({
				paths: "",
				group: "basic"
			}))
			.pipe(gulp.dest("lib"));
	})
	//bower 本身为命令行模块的方式 可以下载 安装 等操作 cnpm install bower --save-dev;bower install jquery --save ;bower init ;
	//bower install --save
	//拷贝了整个目录可以做一系列的操作 ,cwd为参考的bower的文件 ，dir为生成的资源目录 与 bower区别就是可以通过工作流的方式进行
	/*var　bower=require("bower");
	gulp.task("gulpbower",function(){
	     return bower({ directory: './my_bower_components', cwd: './app' })
	     .pipe(gulp.dest("lib"));
	})*/
	//gulp.watch((["src/less/style.less", "src/less/**/*.less"]), ["less"]);
	/*gulp.watch('src/less/style.less',function(event){
	    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});*/

var datet = require("datet");
gulp.task("testd", function() {
	var date = new Date();
	console.log(datet(date));
})