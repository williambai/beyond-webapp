require.config({
	paths: {
		'jQuery': '/js/libs/jquery',
		'Underscore': '/js/libs/underscore',
		'Backbone': '/js/libs/backbone',
		'text': '/js/libs/text',
		'templates': '../templates',
		'Sockets': '/socket.io/socket.io'
	},
	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'EBiz': ['Backbone']
	}
});

require(['EBiz'], function(EBiz){
	(new EBiz).initialize();
});