var expect = require('expect.js');
var captcha = require("./CaptchaParser");
var fs = require("fs");
var path = require('path');

describe('Captcha Parser', function() {
	it('期望：CaptchaParser 正确', function() {
		var buf = fs.readFileSync(path.join(__dirname,'../fixtures/captchas/Captcha1-1IQ074.bmp'));
		var pixMap = captcha.getPixelMapFromBuffer(buf);
		var text = captcha.getCaptcha(pixMap).toString();
		// console.log(text);		
		expect(text).to.be.equal('1IQ074');
	});

	it('期望：CaptchaParser citic 正确', function() {
		var buf = fs.readFileSync(path.join(__dirname,'../fixtures/captchas/citic/captcha-n83c.bmp'));
		var pixMap = captcha.getPixelMapFromBuffer(buf);
		var text = captcha.getCaptcha(pixMap).toString();
		// console.log(text);		
		expect(text).to.be.equal('n83c');
	});

});
