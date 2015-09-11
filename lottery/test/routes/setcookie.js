var should = require('should');
var request = require('./request');
var fs = require('fs');
var path = require('path');

describe('should set cookie successfully.', function() {
	it('should save cookie for admin role.', function(done) {
		request({
			url: request.host + '/authenticated',
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Cookie: request.cookies.admin
			},
		},function(err,res,body){
			should.not.exist(err);
			if(body.errcode){
				request({
					url: request.host + '/login',
					method: 'POST',
					data: {email:'admin@pdbang.cn',password:'123456'},
				},function(err,res,body){
					var body = res.body;
					if(!body.errcode){
						fs.writeFileSync(path.join(__dirname,'../fixtures/cookie_admin.txt'),res.header['set-cookie'][0].split(';')[0]);
					}
					done();
				});
			}else{
				done();
			}			
		});
	});

	it('should save cookie for agent role.', function(done) {
		request({
			url: request.host + '/authenticated',
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Cookie: request.cookies.agent
			},
		},function(err,res,body){
			should.not.exist(err);
			if(body.errcode){
				request({
					url: request.host + '/login',
					method: 'POST',
					data: {email:'agent@pdbang.cn',password:'123456'},
				},function(err,res,body){
					var body = res.body;
					if(!body.errcode){
						fs.writeFileSync(path.join(__dirname,'../fixtures/cookie_agent.txt'),res.header['set-cookie'][0].split(';')[0]);
					}
					done();
				});
			}else{
				done();
			}			
		});
	});

	it('should save cookie for user role.', function(done) {
		request({
			url: request.host + '/authenticated',
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Cookie: request.cookies.user
			},
		},function(err,res,body){
			should.not.exist(err);
			if(body.errcode){
				request({
					url: request.host + '/login',
					method: 'POST',
					data: {email:'139000@pdbang.cn',password:'123456'},
				},function(err,res,body){
					var body = res.body;
					if(!body.errcode){
						fs.writeFileSync(path.join(__dirname,'../fixtures/cookie_user.txt'),res.header['set-cookie'][0].split(';')[0]);
					}
					done();
				});
			}else{
				done();
			}			
		});
	});

});
