var messages = [];

messages.push({
	type: 'image',
	content:{
		urls: 'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
	}
});

messages.push({
	type: 'mixed',
	content:{
		body: '',
		urls: [
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
			'http://g.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e373b6a504cc2d562853568c0.jpg',
		]
	},
});

messages.push({
	type: 'link',
	content:{
		subject: '百度首页',
		body: '百度新闻是包含海量资讯的新闻服务平台，真实反映每时每刻的新闻热点。您可以搜索新闻事件、热点话题、人物动态、产品资讯等，快速了解它们的最新进展。',
		urls: 'http://www.baidu.com',
	},
});

messages.push({
	type: 'voice',
	content:{
		urls: '',
		format: 'mp3',
	},
});

messages.push({
	type: 'shortvideo',
	content:{
		urls: 'http://www.w3school.com.cn/i/movie.mp4',
		thumbnails: 'http://i2.letvimg.com/lc01_yunzhuanma/201509/22/09/07/c27ccc1c317580bf811b7a77db23ea67_35207705/thumb/2_400_225.jpg',
	},
});

messages.push({
	type: 'video',
	content:{
		urls: 'http://www.w3school.com.cn/i/movie.mp4',
		thumbnails: 'http://i2.letvimg.com/lc01_yunzhuanma/201509/22/09/07/c27ccc1c317580bf811b7a77db23ea67_35207705/thumb/2_400_225.jpg',
	},
});

messages.push({
	type: 'location',
	content:{
		location_x: 120.0000,
		location_y: 36.0000,
		scale: 10,
		subject: '',
	},
});

messages.push({
	type: 'email',
	content:{
		subject: '',
		body: '',
		urls: '',
	},
});

exports = module.exports = messages;
