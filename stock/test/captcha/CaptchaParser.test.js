var showConsoleLog = false;
var expect = require('expect.js');
var captcha = require("./CaptchaParser");
var fs = require("fs");
var path = require('path');

describe('Captcha Parser', function() {
	before(function() {
		showConsoleLog = true;
	});
	after(function() {
	});
	it('期望：CaptchaParser 正确', function() {
		if (showConsoleLog) {
			var logger = console.log;
			console.log = function() {};
		}
		var buf = fs.readFileSync(path.join(__dirname,'../fixtures/captchas/Captcha1-1IQ074.bmp'));
		var pixMap = captcha.getPixelMapFromBuffer(buf);
		var text = captcha.getCaptcha(pixMap).toString();
		// console.log(text);		
		expect(text).to.be.equal('1IQ074');
		if (showConsoleLog) {
			console.log = logger;
		}
	});

	xit('期望：CaptchaParser citic 正确', function() {
		if (showConsoleLog) {
			var logger = console.log;
			console.log = function() {};
		}
		var buf = fs.readFileSync(path.join(__dirname,'../fixtures/captchas/citic/captcha-n83c.bmp'));
		var pixMap = captcha.getPixelMapFromBuffer(buf);
		var text = captcha.getCaptcha(pixMap).toString();
		// console.log(text);		
		expect(text).to.be.equal('n83c');
		if (showConsoleLog) {
			console.log = logger;
		}
	});
	xit('测试用例模板', function() {
		if (showConsoleLog) {
			var logger = console.log;
			console.log = function() {};
		}
		//write your code here
		
		if (showConsoleLog) {
			console.log = logger;
		}
	});
});
