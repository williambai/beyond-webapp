exports = module.exports = [{
	"name": "系统管理员",
	"nickname": "superadmin",
	"description": "系统管理员角色",
	"grant": {
		"protect_feature": {
			"route": "/protect/features",
			"nickname": "protect_feature",
			"name": "功能管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_app": {
			"route": "/protect/apps",
			"nickname": "protect_app",
			"name": "应用管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_account": {
			"route": "/protect/accounts",
			"nickname": "protect_account",
			"name": "用户管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_role": {
			"route": "/protect/roles",
			"nickname": "protect_role",
			"name": "角色管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_session": {
			"route": "/protect/sessions",
			"nickname": "protect_session",
			"name": "会话管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_file": {
			"route": "/protect/files",
			"nickname": "protect_file",
			"name": "文件管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_cbss_account": {
			"route": "/protect/cbss/accounts",
			"nickname": "protect_cbss_account",
			"name": "CBSS账号管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_wechat_customer": {
			"route": "/protect/wechat/customers",
			"nickname": "protect_wechat_customer",
			"name": "微信客户管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_wechat_menu": {
			"route": "/protect/wechat/menus",
			"nickname": "protect_wechat_menu",
			"name": "微信菜单管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_wechat": {
			"route": "/protect/wechats",
			"nickname": "protect_wechat",
			"name": "微信公众号设置",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_database": {
			"route": "/protect/databases",
			"nickname": "protect_database",
			"name": "数据维护",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		}
	}
}, {
	"name": "后台管理员",
	"nickname": "admin",
	"description": "管理产品、用户、订单等",
	"grant": {
		"protect_product_direct": {
			"route": "/protect/product/directs",
			"nickname": "protect_product_direct",
			"name": "直通产品管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_product_category": {
			"route": "/protect/product/categories",
			"nickname": "protect_product_category",
			"name": "产品分类管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_customer": {
			"route": "/protect/customers",
			"nickname": "protect_customer",
			"name": "客户管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_order": {
			"route": "/protect/orders",
			"nickname": "protect_order",
			"name": "订单管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_account": {
			"route": "/protect/accounts",
			"nickname": "protect_account",
			"name": "用户管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_department": {
			"route": "/protect/departments",
			"nickname": "protect_department",
			"name": "营业厅管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},

		"protect_goods": {
			"route": "/protect/goods",
			"nickname": "protect_goods",
			"name": "物料管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_sms": {
			"route": "/protect/smses",
			"nickname": "protect_sms",
			"name": "SMS管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_media": {
			"route": "/protect/medias",
			"nickname": "protect_media",
			"name": "媒体文件管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_carousel": {
			"route": "/protect/carousels",
			"nickname": "protect_carousel",
			"name": "首页轮播管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_page": {
			"route": "/platform/pages",
			"nickname": "platform_page",
			"name": "静态网页管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_finance_bank": {
			"route": "/protect/finance/banks",
			"nickname": "protect_finance_bank",
			"name": "银行卡管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_finance_bank_apply": {
			"route": "/protect/finance/bank/applys",
			"nickname": "protect_finance_bank_apply",
			"name": "银行卡申请审核",
			"remove": "false",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
		"protect_finance_bonus": {
			"route": "/protect/finance/bonuses",
			"nickname": "protect_finance_bonus",
			"name": "佣金管理",
			"remove": "true",
			"update": "true",
			"add": "true",
			"getMore": "true",
			"getOne": "true"
		},
	}
}]