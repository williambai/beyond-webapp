var unirest = require("unirest");
var captcha = require("./CaptchaParser");
var fs = require("fs");
var path = require('path');
var captchaUri = 'https://etrade.cs.ecitic.com/ymtrade/pic/Kaptcha.jpg';

var onRequest = function (response) {
    if (response.error) {
        console.log('VIT Academics connection failed');
    }
    else {
    	// pixMap = captcha.getPixelMapFromBuffer(response.body);
    	fs.writeFileSync(path.join(__dirname,'../fixtures/captchas/citic',"captcha.bmp"), response.body);
        // console.log(captcha.getCaptcha(pixMap));
    }
};
unirest.get(captchaUri)
    .encoding(null)
    .set('Content-Type', 'image/bmp')
    .end(onRequest);