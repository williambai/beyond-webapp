var mongoose = require('mongoose');
var connection = mongoose;

var schema = new mongoose.Schema({
		session: {
			user: { //** 用户相关
				id: String, //** 用户ID
				username: String, //** 用户名称
			},
			app: { //** 应用相关
				app_id: String,
				app_secret: String,
				app_domain: String,
				app_grant: [],//** application授权
				app_role: [], //** application中的角色
			},
			permission: { //** 资源相关
				//** RESTful访问权限集合
			}, 
		},
		expires: Date, //** 到期时间：短
	});

schema.set('collection','token.access');

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('AccessToken', schema);
};
