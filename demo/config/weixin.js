exports = module.exports = {
	mp: {
		token: 'token',
		appid: 'appid', //mp
		encodingAESKey: '',
		secret: 'secret',
	},
	qy: {
		token: 'token',
		corpid: 'corpid', //qy
		agentid: 'agentid',
		encodingAESKey: '',
		secret: 'secret',
	},
	payment: {
		partnerKey: "<partnerkey>",
		appId: "<appid>",
		mchId: "<mchid>",
		notifyUrl: "/weixin/payment/notify",
		// pfx: fs.readFileSync("<location-of-your-apiclient-cert.p12>")
	}
};