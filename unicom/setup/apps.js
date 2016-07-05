exports = module.exports = [
    {
        "name": "系统管理",
        "nickname": "superadmin",
        "description": "后台系统配置管理",
        "features": [
            "protect_feature",
            "protect_app",
            "protect_account",
            "protect_role",
            "protect_file",
            "protect_session",
            "protect_cbss_account",
            "protect_wechat_customer",
            "protect_wechat",
            "protect_monitor",
            "protect_database"
        ]
    },
    {
        "name": "运营后台管理",
        "nickname": "admin",
        "description": "运营后台管理员使用",
        "features": [
            "protect_product_direct",
            "protect_product_category",
            "protect_customer",
            "protect_order",
            "protect_account",
            "protect_goods",
            "protect_sms",
            "protect_finance_bank",
            "protect_finance_bank_apply",
            "protect_finance_bonus",
            "protect_department",
            "channel_category",
            "protect_media",
            "protect_carousel",
            "protect_stats_cities"
        ]
    },
    {
        "name": "渠道沃助手",
        "nickname": "channel",
        "description": "渠道人员使用的APP",
        "features": [
        ],
        "isDefault": true
    }
]