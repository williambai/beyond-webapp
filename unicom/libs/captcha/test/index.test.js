/**
 * 设置 60s 超时
 * > mocha -t 60000 index.test.js
 * 
 */
var expect = require('expect.js');
var util = require('util');
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var opencv = require('opencv');

var captchaParser = require('../index');

xdescribe('gm ImageMagick module:', function() {
	it('gm can run', function() {
		gm(path.join(__dirname, 'input/test1.jpeg'))
			.resize(100, 100)
			.write(path.join(__dirname, '_output/test1_result.jpeg'), function(err) {
				expect(err).to.be(undefined);
			});
	});
});

xdescribe('opencv module:', function() {
	it('opencv can run', function() {
		opencv.readImage(path.join(__dirname, 'input/test1.jpeg'), function(err, mat) {
			mat.save(path.join(__dirname, '_output/test1_opencv_result.jpeg'));
		});
	});
});

xdescribe('captcha parser lib', function() {
	it('export properties is defined ok.', function() {
		// console.log(util.inspect(captchaParser));
		expect(captchaParser).to.be.an(Object);
		//not exports
		// expect(captchaParser).to.have.property('isWhite');
		//exports
		expect(captchaParser).to.have.property('loadTrainData');
		expect(captchaParser).to.have.property('getAllOcr');
		expect(captchaParser.getAllOcr).to.be.an(Function);
	});
});

xdescribe('captcha testing:', function() {
	xit('opencv.Matrix functions', function(done) {
		opencv.readImage(path.join(__dirname, 'input/test1.jpeg'), function(err, img) {
			expect(err).to.be(null);
			console.log(util.inspect(opencv.Matrix.prototype))
			console.log(img.width())
			console.log(img.height());
			console.log(img.pixel(0,0));
			console.log(img.pixelRow(10));
			console.log(img.crop(0, 0, 10, 10))
			done();
		});
	});
	it('test file exist.', function(done) {
		var input = path.join(__dirname, 'input/test1.jpeg');
		fs.readFile(input, function(err, content) {
			expect(err).to.be(null);
			// console.log(content)
			done();
		});
	});
	xit('isWhite()', function() {
		var white = captchaParser.isWhite([255, 255, 255]);
		expect(white).to.be(1);
		var black = captchaParser.isWhite([0, 0, 0]);
		expect(black).to.be(0);
	});
	xit('removeBackground()', function() {
		
	});
	xit('splitImage()', function(done) {
		opencv.readImage(path.join(__dirname, 'input/test1.jpeg'), function(err, img) {
			expect(err).to.be(null);
			var imgCopy = img.clone();
			var imgs = captchaParser.splitImage(imgCopy);
			expect(imgs[0]).to.be.a(opencv.Matrix);
			done();
		});
	});
	xit('loadTrainData()', function() {
		var map = captchaParser.loadTrainData();
		// console.log(util.inspect(map));
		expect(map).to.be.an(Array);
	});
	xit('getSingleCharOcr()', function(done) {
		var map = captchaParser.loadTrainData();
		var img = opencv.readImage(path.join(__dirname, '_output/char_1.png'), function(err, img) {
			var result = captchaParser.getSingleCharOcr(img, map);
			console.log(result);
			done();
		});
	});
	xit('getAllOcr()', function(done) {
		var map = captchaParser.loadTrainData();
		captchaParser.getAllOcr(path.join(__dirname, 'input/test1.jpeg'),map, function(err, result) {
			console.log(result);
			done();
		});
	});
});

describe('动态抓取验证码图片并测试', function() {
	it('人工比较验证码是否正确', function(done){
		var map = captchaParser.loadTrainData();
		var trunks = [];
		var spawn = require('child_process').spawn;
		var child = spawn(
						'casperjs',[
							'index.test.casper.js',
							'--ignore-ssl-errors=true'
						],{
							cwd: __dirname,
						}
					);
		child.on('error', function(err){
			console.log(err);
			callback(err);
		});
		child.stderr.on('data', function(err){
			console.log(err);
			callback(err);
		});
		child.stdout.on('data', function(data){
			trunks.push(data);
		});
		child.on('close', function(code){
			if(code != 0) {
				// expect(code).tobe(0);
				console.log('casperjs 进程非正常退出 code: ' + code);
				return done();
			}
			var data = trunks.join('').toString().replace(/\n/g,'');
			// console.log('获取验证码图片程序返回内容: ' + data);
			var captcha = {};
			try{
				captcha = JSON.parse(data);
			}catch(err){
			}
			captchaParser.getAllOcr(path.join(__dirname, '/_tmp/captcha.jpg'), map, function(err, result) {
				console.log('验证码图片：' + path.join(__dirname, '/_tmp/captcha.jpg'));
				console.log('验证码字符：' + result);
				done();
			});
		});
		// child.stdout.pipe(process.stdout);
		// process.stdin.pipe(child.stdin);
	});
});