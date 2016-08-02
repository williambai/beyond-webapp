var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
	el: '#sidebar-left',
	// template: _.template($('#tpl-sidebar-left').html()),

	initialize: function(options){
		this.on('update:menu', this.updateMenu,this);
	},

	events: {
		'click .list-group-item': 'activeItem',
	},

	updateMenu: function(features){
		var menuView = '<div class="list-group">';
			// menuView += '<a class="list-group-item active" href="#index">' +
			//                 '<i class="fa fa-meh-o fa-fw"></i>&nbsp;首页' +
			//                 '<i class="fa fa-chevron-right pull-right"></i>' +
			//             '</a>';
		_.each(features,function(feature){
			menuView += '<a class="list-group-item" href="#'+ feature.hash +'">' +
			                '<i class="fa fa-meh-o fa-fw"></i>&nbsp;' +  feature.name +
			                '<i class="fa fa-chevron-right pull-right"></i>' +
			            '</a>';
		});
		menuView += '</div>';
		menuView += '<br/><br/><br/>';
		this.$('#menu').html(menuView);
		this.$('.list-group-item').first().addClass('active');
	},

	activeItem: function(evt){
		var currentItem = evt.currentTarget;
		this.$('.list-group-item').removeClass('active');
		this.$(currentItem).addClass('active');
	},

	render: function(){
		return this;
	},
});
