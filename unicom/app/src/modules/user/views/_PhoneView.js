var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    phoneTpl = require('../templates/_entityPhone.tpl'),
	ProductPhone = require('../models/ProductPhone');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#phoneView',

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductPhone({_id: options.id});
		var page = $(phoneTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.model.on('change', this.change ,this);
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	change: function(){
		var that = this;
		this.render();
			//set phonePackage
			var pkgs = this.model.get('packages') || [];
			_.each(pkgs, function(pkg){
				var newPackageView = '';
				var id= pkg._id;
				newPackageView += '<div id="'+ id +'"><input type="hidden" name="packages[]" value="'+ id +'"><div class="pull-left">';
				newPackageView += '<button class="btn btn-danger packageRemove"><i class="fa fa-lock fa-lg"></i></button>';
				newPackageView += '</div>';
				newPackageView += '<div style="padding-left:60px;">';
				newPackageView += '<h4>'+ pkg.name +'</h4>';
				newPackageView += '<p>'+ pkg.price.toFixed(2) +'元</p>';
				newPackageView += '</div><hr/></div>';
				that.$('#packages').append(newPackageView);
			});		
	},

	back: function(){
		window.history.back();
		// this.router.navigate('phone/index',{trigger: true, replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		//set image
		var thumbnail_url = this.model.get('thumbnail_url');
		if(thumbnail_url) this.$('img#thumbnail_url').attr('src',thumbnail_url);
		return this;
	},
});