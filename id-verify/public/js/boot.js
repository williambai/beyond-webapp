require.config({
	paths: {
		'jQuery': '/js/libs/jquery',
		'Underscore': '/js/libs/underscore',
		'Backbone': '/js/libs/backbone',
		'text': '/js/libs/text',
		'templates': '../templates',
		'Chart': '../bower_components/Chart.js/Chart',
		'Sockets': '/socket.io/socket.io',
		'IdInfo': '/js/libs/idinfo',
	},
	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'main': ['Backbone'],
	}
});

require(['main']);