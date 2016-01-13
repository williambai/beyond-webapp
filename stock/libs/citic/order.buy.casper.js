/**
 * buy stock
 */
var fs = require('fs');
var system = require('system');
var server = require('webserver').create();
var casper = require('casper').create({
	// clientScripts: ['jquery.js'],
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 100000,
	logLevel: "info",
	verbose: true
});
//** setup params
console.log(JSON.stringify(casper.cli.options));
var id = casper.cli.options['id'] || '';
var cookie = casper.cli.options['cookie'] || '';
var buy_code = casper.cli.options['buy_code'] || '';
var buy_price = casper.cli.options['buy_price'] || '';
var buy_quantity = casper.cli.options['buy_quantity'] || '';
var callback_url = casper.cli.options['callback_url'] || '';

var cookies = [];
try {
	cookies = JSON.parse(cookie);
} catch (e) {

}
// console.log(cookie);
// console.log('+++')
// console.log(JSON.stringify(cookies));
phantom.cookiesEnabled = true;
phantom.cookies = cookies;

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');

casper.then(function(){
	casper.wait(2000);
});

casper.waitFor(function(){
	return casper.exists('#menuTD');
});

casper.then(function clickBuy(){
	this.echo('buy');
	this.click('#gp_buy');
});

casper.withFrame('mainFrame',function(){
	casper.then(function buyForm(){
		this.capture('../_tmp/buyForm.png');
	});
	casper.then(function(){
		// this.echo(this.getHTML());
	});
	casper.then(function buyFormFill(){
		this.sendKeys('input[name="stkcode"]',buy_code,{reset:true});
		this.wait(2000);
		// this.waitFor(function check(){
		// 	return this.evaluate(function(){
		// 		return document.querySelector('input[name="price"]').getAttibute('name');
		// 	});
		// });
		this.capture('../_tmp/buyFormCodeFilled.png');
	});
	casper.then(function buyFormFillPrice(){
		this.sendKeys('input[name="price"]',buy_price,{reset:true});
		this.wait(1000);
		this.capture('../_tmp/buyFormPriceFilled.png');
	});
	casper.then(function buyFormFillQuantity(){
		this.sendKeys('input[name="qty"]',buy_quantity,{reset:true});
		this.wait(1000);
		this.capture('../_tmp/buyFormQuantityFilled.png');
	});
	casper.then(function buyFormSubmit(){
		this.click('input[type="button"]');
	});
	casper.then(function buyFormSubmitPopup(){
		this.waitForSelector('div#popup_container');
		this.capture('../_tmp/buyPopup.png');
	});
	casper.then(function buyFormSubmitConfirm(){
		this.click('#popup_cancel');
		this.capture('../_tmp/buyPopupConfirmed.png');
	});
});

casper.wait(2000);

casper.then(function() {
	//** notification success or not
	var success = false;
	if (casper.exists('#menuTD')) {
		success = true;
	}
	casper.evaluate(function(url, id, cookies, success) {
		__utils__.sendAJAX(url, 'POST', {
			action: 'updateOrder',
			id: id,
			cookies: cookies,
			success: success
		}, false);
	}, callback_url, id, JSON.stringify(phantom.cookies || []), success);
});

casper.run();