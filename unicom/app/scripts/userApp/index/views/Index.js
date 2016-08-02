var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-index').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	events: {
	},

	load: function() {
		var that = this;
		that.render();
		$.ajax({
			url: config.api.host +'/protect/carousels',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data) {
			//** set carousel inner content
			var carouselInnerHtml = '';
			_.each(data,function(img){
				carouselInnerHtml += '<div class="item">';
				carouselInnerHtml += '<a href="' + img.target_url + '" target="_blank">';
				carouselInnerHtml += '<img src="'+ img.img_url +'" alt="..." width="100%">';
				carouselInnerHtml += '</a>';
				carouselInnerHtml += '<div class="carousel-caption">'+ img.name + '</div>';
				carouselInnerHtml += '</div>';
			});
			that.$('.carousel-inner').html(carouselInnerHtml);
			that.$('.item').first().addClass('active');
			//** setInterval
			var carousel =	setInterval(function(){
				var current = that.$('.carousel-inner .item.active');
				if(current.length == 0) return clearInterval(carousel);
				var next = that.$('.carousel-inner .item.active').next();
				if(next.length == 0) next = that.$('.carousel-inner .item')[0];
				$(next).addClass('active');
				$(current).removeClass('active');
				console.log('carousel running.');
			},10000);
		});
	},
	
	render: function() {
		this.$el.html(this.template());
		return this;
	},
});