var casper = require('casper').create({
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
phantom.cookiesEnabled = true;

var fs = require('fs');
var system = require('system');
//load cookie
var data = fs.read('../_tmp/_cookie.txt') || "[]";
phantom.cookies = JSON.parse(data);
//load account
var account = JSON.parse(fs.read('../../config/citic.json') || "{}");
//captcha
var code = '';

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://etrade.cs.ecitic.com/ymtrade/professional.jsp',function(){
	this.wait(1000);
	this.capture('../_tmp/professional.png');
});

casper.thenBypassIf(function isLogin(){
	return this.exists('#menuTD');
},6);

casper.then(function openLoginPage(){
	casper.open('https://etrade.cs.ecitic.com/ymtrade/login/login.jsp?ssl=false&ftype=pro');
});

casper.then(function hasLoginForm() {
	this.waitForSelector('div.login_content_l');
	this.capture('../_tmp/captcha.png');
	this.echo('captcha.png has been download, please open ../_tmp/captcha.png and read the code.','INFO');
});

casper.then(function inputCaptcha() {
	var confirm = '';
	while (confirm != 'yes') {
		this.echo('please input "' + account.username + '" password: ', 'INFO');
		account.password = system.stdin.readLine();
		this.echo(account.password,'INFO');
		this.echo('please input captcha code: ','INFO');
		code = system.stdin.readLine();
		this.echo('captcha code is "' + code + '"', 'INFO');
		this.echo('yes or no?', 'WARNING');
		confirm = system.stdin.readLine();
	}
});

casper.then(function loginFormFill(){
	this.evaluate(function(username, password, vcode) {
		document.querySelector('select[name="inputtype"]').setAttribute('value','Z');
		document.querySelector('input[name="inputid"]').setAttribute('value', username);
		document.querySelector('input[name="trdpwd"]').setAttribute('value', password);
		document.querySelector('input[name="vcode"]').setAttribute('value', vcode);
	}, account.username, account.password, code);
	// this.sendKeys('input[name="inputid"]',account.username);
	// this.sendKeys('input[name="trdpwd"]',account.password);
	// this.sendKeys('input[name="vcode"]',code);
	this.capture('../_tmp/login.png');
	this.capture('../../public/images/captcha.png');
});

// casper.then(function loginSubmit(){
// 	this.click('input#submit_btn');
// });

// casper.then(function loginSubmitSuccess(){
// 	this.capture('../_tmp/professional2.png');
// 	var fs = require('fs');
// 	var cookies = JSON.stringify(phantom.cookies);
// 	// this.echo(JSON.stringify(phantom.cookies));
// 	fs.write('../_tmp/_cookie.txt', cookies, 644);
// 	// this.wait(4000);
// 	//require('utils').dump(phantom);
// });

// casper.then(function openprofessionalPage(){
// 	casper.open('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');
// });

// casper.then(function(){
// 	// this.echo(this.getHTML());
// 	this.capture('../_tmp/professional3.png');
// });

// casper.then(function(){
// 	if(!this.exists('#menuTD')){
// 		this.echo('do not authenticated.','ERROR');
// 		this.exit();
// 	}
// });

// var bid = 'sale';
// var stock = {
// 	code: '600218',
// 	price: '12.80',
// 	quantity: '1000',
// };

// if(bid == 'buy'){	
// 	casper.then(function clickBuy(){
// 		this.echo('buy');
// 		this.click('#gp_buy');
// 	});

// 	casper.withFrame('mainFrame',function(){
// 		casper.then(function buyForm(){
// 			this.capture('../_tmp/buyForm.png');
// 		});
// 		casper.then(function(){
// 			// this.echo(this.getHTML());
// 		});
// 		casper.then(function buyFormFill(){
// 			this.sendKeys('input[name="stkcode"]',stock.code,{reset:true});
// 			this.wait(2000);
// 			// this.waitFor(function check(){
// 			// 	return this.evaluate(function(){
// 			// 		return document.querySelector('input[name="price"]').getAttibute('name');
// 			// 	});
// 			// });
// 			this.capture('../_tmp/buyFormCodeFilled.png');
// 		});
// 		casper.then(function buyFormFillPrice(){
// 			this.sendKeys('input[name="price"]',stock.price,{reset:true});
// 			this.wait(1000);
// 			this.capture('../_tmp/buyFormPriceFilled.png');
// 		});
// 		casper.then(function buyFormFillQuantity(){
// 			this.sendKeys('input[name="qty"]',stock.quantity,{reset:true});
// 			this.wait(1000);
// 			this.capture('../_tmp/buyFormQuantityFilled.png');
// 		});
// 		casper.then(function buyFormSubmit(){
// 			this.click('input[type="button"]');
// 		});
// 		casper.then(function buyFormSubmitPopup(){
// 			this.waitForSelector('div#popup_container');
// 			this.capture('../_tmp/buyPopup.png');
// 		});
// 		casper.then(function buyFormSubmitConfirm(){
// 			this.click('#popup_cancel');
// 			this.capture('../_tmp/buyPopupConfirmed.png');
// 		});
// 	});
// }else if(bid == 'sale'){
// 	casper.then(function clickSell(){
// 		this.echo('sale');
// 		this.click('#gp_sale')
// 	});
// 	casper.withFrame('mainFrame',function(){
// 		casper.then(function saleForm(){
// 			this.capture('../_tmp/saleForm.png');
// 		});
// 		casper.then(function(){
// 			// this.echo(this.getHTML());
// 		});
// 		casper.then(function saleFormFill(){
// 			this.sendKeys('input[name="stkcode"]',stock.code,{reset:true});
// 			this.wait(2000);
// 			this.capture('../_tmp/saleFormCodeFilled.png');
// 		});
// 		casper.then(function saleFormFillPrice(){
// 			this.sendKeys('input[name="price"]',stock.price,{reset:true});
// 			this.wait(1000);
// 			this.capture('../_tmp/saleFormPriceFilled.png');
// 		});
// 		casper.then(function saleFormFillQuantity(){
// 			this.sendKeys('input[name="qty"]',stock.quantity,{reset:true});
// 			this.wait(1000);
// 			this.capture('../_tmp/saleFormQuantityFilled.png');
// 		});
// 		casper.then(function saleFormSubmit(){
// 			this.click('input[type="button"]');
// 		});
// 		casper.then(function saleFormSubmitPopup(){
// 			this.waitForSelector('div#popup_container');
// 			this.capture('../_tmp/salePopup.png');
// 		});
// 		casper.then(function saleFormSubmitConfirm(){
// 			this.click('#popup_cancel');
// 			this.capture('../_tmp/salePopupConfirmed.png');
// 		});
// 	});
// }

//save cookies
// casper.then(function saveCookie(){
// 	var fs = require('fs');
// 	var cookies = JSON.stringify(phantom.cookies);
// 	// this.echo(JSON.stringify(phantom.cookies));
// 	fs.write('../_tmp/_cookie.txt', cookies, 644);
// });

casper.run();