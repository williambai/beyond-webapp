var expect = require('expect.js');
var util = require('util');
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var opencv = require('opencv');

var captchaParser = require('../../libs/captcha');

describe('gm ImageMagick module:', function() {
	it('gm can run', function() {
		gm(path.join(__dirname, 'input/test1.jpeg'))
			.resize(100, 100)
			.write(path.join(__dirname, '_output/test1_result.jpeg'), function(err) {
				expect(err).to.be(undefined);
			});
	});
});

describe('opencv module:', function() {
	it('opencv can run', function() {
		opencv.readImage(path.join(__dirname, 'input/test1.jpeg'), function(err, mat) {
			mat.save(path.join(__dirname, '_output/test1_opencv_result.jpeg'));
		});
	});
});

describe('captcha parser lib', function() {
	it('export properties is defined ok.', function() {
		// console.log(util.inspect(captchaParser));
		expect(captchaParser).to.be.an(Object);
		//not exports
		expect(captchaParser).to.have.property('isWhite');
		//exports
		expect(captchaParser).to.have.property('loadTrainData');
		expect(captchaParser).to.have.property('getAllOcr');
		expect(captchaParser.getAllOcr).to.be.an(Function);
	});
});

describe('captcha testing:', function() {
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
	it('isWhite()', function() {
		var white = captchaParser.isWhite([255, 255, 255]);
		expect(white).to.be(1);
		var black = captchaParser.isWhite([0, 0, 0]);
		expect(black).to.be(0);
	});
	xit('removeBackground()', function() {
		
	});
	it('splitImage()', function(done) {
		opencv.readImage(path.join(__dirname, 'input/test1.jpeg'), function(err, img) {
			expect(err).to.be(null);
			var imgCopy = img.clone();
			var imgs = captchaParser.splitImage(imgCopy);
			expect(imgs[0]).to.be.a(opencv.Matrix);
			done();
		});
	});
	it('loadTrainData()', function() {
		var map = captchaParser.loadTrainData();
		// console.log(util.inspect(map));
		expect(map).to.be.an(Array);
	});
	it('getSingleCharOcr()', function(done) {
		var map = captchaParser.loadTrainData();
		var img = opencv.readImage(path.join(__dirname, '_output/char_1.png'), function(err, img) {
			var result = captchaParser.getSingleCharOcr(img, map);
			console.log(result);
			done();
		});
	});
	it('getAllOcr()', function(done) {
		var map = captchaParser.loadTrainData();
		captchaParser.getAllOcr(path.join(__dirname, 'input/test1.jpeg'),map, function(err, result) {
			console.log(result);
			done();
		});
	});
});