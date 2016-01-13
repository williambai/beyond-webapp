/**
 * sale stock
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
if(casper.cli.options.length < 8) {
	this.echo('参数不对');
	this.exit();
}
var id = casper.cli.options['id'] || '';
var cookie = casper.cli.options['cookie'] || '';
var sale_code = casper.cli.options['sale_code'] || '';
var sale_price = casper.cli.options['sale_price'] || '';
var sale_quantity = casper.cli.options['sale_quantity'] || '';
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

casper.then(function clickSell(){
	this.echo('sale');
	this.click('#gp_sale')
});
casper.withFrame('mainFrame',function(){
	casper.then(function saleForm(){
		this.capture('../_tmp/saleForm.png');
	});
	casper.then(function(){
		// this.echo(this.getHTML());
	});
	casper.then(function saleFormFill(){
		this.sendKeys('input[name="stkcode"]',sale_code,{reset:true});
		this.wait(2000);
		this.capture('../_tmp/saleFormCodeFilled.png');
	});
	casper.then(function saleFormFillPrice(){
		this.sendKeys('input[name="price"]',sale_price,{reset:true});
		this.wait(1000);
		this.capture('../_tmp/saleFormPriceFilled.png');
	});
	casper.then(function saleFormFillQuantity(){
		this.sendKeys('input[name="qty"]',sale_quantity,{reset:true});
		this.wait(1000);
		this.capture('../_tmp/saleFormQuantityFilled.png');
	});
	casper.then(function saleFormSubmit(){
		this.click('input[type="button"]');
	});
	casper.then(function saleFormSubmitPopup(){
		this.waitForSelector('div#popup_container');
		this.capture('../_tmp/salePopup.png');
	});
	casper.then(function saleFormSubmitConfirm(){
		this.click('#popup_cancel');
		this.capture('../_tmp/salePopupConfirmed.png');
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
			type: 'sale',
			id: id,
			cookies: cookies,
			success: success
		}, false);
	}, callback_url, id, JSON.stringify(phantom.cookies || []), success);
});

casper.run();