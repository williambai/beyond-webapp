/**
 * 设置 60s 超时
 * > mocha -t 60000 index.test.js
 * 
 */
var expect = require('expect.js');
var util = require('util');
var fs = require('fs');
var path = require('path');
var getPixels = require('get-pixels');
var savePixels = require('save-pixels');

var captchaParser = require('../lib/parse');

describe('parse captcha', function() {

	it('get/save pixels', function(done) {
		getPixels(path.join(__dirname, 'input/test1.jpeg'), function(err, pixels) {
			expect(err).to.be(null);
			var writeStream = fs.createWriteStream(path.join(__dirname,'_output/test1.png'),{flag:'w'});
			savePixels(pixels,'png').pipe(writeStream);
			writeStream.on('close', function(){
				done();
			});
		});
	});
	
	it('splitImages', function() {
		getPixels(path.join(__dirname, 'input/test1.jpeg'), function(err, pixels) {
			expect(err).to.be(null);
			var imgs = captchaParser.splitImage(pixels);
			// console.log(imgs[0].shape[0]);
			// console.log(imgs[1].shape[1]);
			// console.log(imgs[0].get(0,0,0));
			// console.log(imgs[0].get(0,0,1));
			// console.log(imgs[0].get(0,0,2));
			// console.log((imgs[0].pick(0,0,null)));
			imgs.forEach(function(img,i){
				var writeStream = fs.createWriteStream(path.join(__dirname,'_output/test1_'+ i +'.png'),{flag:'w'});
				savePixels(img,'png').pipe(writeStream);
				writeStream.on('close', function(){
				});
			});
		});
	});	

	it('loadTrainData', function(done) {
		captchaParser.loadTrainData(function(err,map){
			if(err) console.log(err);
			console.log('map length: ' + map.length);
			done();
		});
	});

	it('loadTrainDataSync', function() {
		var map = captchaParser.loadTrainDataSync();
		// console.log('map length: ' + map.length);
	});

	it('getSingleCharOcr', function(done) {
		var map = captchaParser.loadTrainDataSync();
		console.log('map length: ' + map.length);

		getPixels(path.join(__dirname, '_output/test1_1.png'), function(err, pixels) {
			if(err) console.log(err);
			var result = captchaParser.getSingleCharOcr(pixels, map, function(err,result){
				console.log('result:' + result);
				// expect(result).to.be('k');
				done();
			});
		});
	});

	it('getAllOcr', function(done) {
		var map = captchaParser.loadTrainDataSync();
		console.log('map length: ' + map.length);

		captchaParser.getAllOcr(path.join(__dirname, 'input/test1.jpeg'), map, function(err,result){
			if(err) console.log(err);
			console.log('result:' + result);
			// expect(result).to.be('k');
			done();
		});
	});

	it('getAllOcrSimple', function(done) {
		captchaParser.getAllOcrSimple(path.join(__dirname, 'input/test1.jpeg'), function(err,result){
			if(err) console.log(err);
			console.log('result:' + result);
			// expect(result).to.be('k');
			done();
		});
	});

});

describe('动态抓取验证码图片并测试', function() {
	it('人工比较验证码是否正确', function(done){
		var map = captchaParser.loadTrainDataSync();
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
