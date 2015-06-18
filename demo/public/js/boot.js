require.config({
	paths: {
		'jQuery': '/js/libs/jquery',
		'Underscore': '/js/libs/underscore',
		'Backbone': '/js/libs/backbone',
		'text': '/js/libs/text',
		'templates': '../templates',
		'Sockets': '/js/libs/socket.io'
	},
	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'SocialNet': ['Backbone']
	}
});

require(['SocialNet'], function(SocialNet){
	(new SocialNet).initialize();
});