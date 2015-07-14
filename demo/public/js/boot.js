require.config({
	baseUrl: '/js',
	paths: {
		'jQuery': 'libs/jquery',
		'Underscore': 'libs/underscore',
		'Backbone': 'libs/backbone',
		'Backbone.modal': 'libs/backbone.modal',
		'text': 'libs/text',
		'templates': '../templates',
		'Sockets': 'libs/socket.io'
	},
	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'Backbone.modal': ['Backbone'],
		'SocialNet': ['Backbone','Backbone.modal']
	},
	// urlArgs: "v=0.0.12"
});

require(['main']);