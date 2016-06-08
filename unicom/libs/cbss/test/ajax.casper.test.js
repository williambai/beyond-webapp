var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	// clientScripts: ['https//gz.cbss.10010.com/component/scripts/ajax.js'],
	pageSettings: {
		XSSAuditingEnabled: false,
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false,
	},
	timeout: 100000,
	logLevel: "debug",
	verbose: true,
});
var tempdir = casper.cli.options['tempdir'] || './_tmp';

casper.on('resource.requested',function(resource){
	if(!/\.(css|gif|png|jpg)$/.test(resource.url)){
		if(true) fs.write(tempdir + '/' + 'test_ajax_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
	}
});

casper.on('resource.error',function(resource){
	if(true) fs.write(tempdir + '/' + 'test_ajax_resource_error.txt', resource.url,'a');
});

casper.on('remote.message', function(message){
	if(true) fs.write(tempdir + '/' + 'test_ajax_remote_message.txt', resource.url,'a');
});


casper.start('http://www.sina.com.cn/');

casper.wait(5000);

casper.run();