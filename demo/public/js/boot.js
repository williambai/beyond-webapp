require.config({
	baseUrl: '/js',
	paths: {
		'jQuery': 'libs/jquery',
		'Underscore': 'libs/underscore',
		'Backbone': 'libs/backbone',
		'text': 'libs/text',
		'templates': '../templates',
		'Sockets': 'libs/socket.io'
	},
	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'SocialNet': ['Backbone']
	},
	// urlArgs: "v=0.0.12"
});

require(['main']);