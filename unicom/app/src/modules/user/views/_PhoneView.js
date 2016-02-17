var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    phoneTpl = require('../templates/_entityPhone.tpl'),
	ProductPhone = require('../models/ProductPhone');
var config = require('../conf');

Backbone.$ = $;

var PhoneOrderView = require('./_PhoneOrder');

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
		'click .detail': 'phoneDetail',
		'click .packageSelect': 'packageSelect',
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
		//** set phonePackage
		var pkgs = this.model.get('packages') || [];
		var newPackageView = '';
		newPackageView += '<input type="hidden" name="package[id]">';
		newPackageView += '<span class="help-block"></span>';
		_.each(pkgs, function(pkg){
			newPackageView += '<div><div class="pull-left">';
			newPackageView += '<button class="btn btn-danger packageSelect" id="'+ pkg._id +'"><i class="fa fa-circle-o fa-lg"></i></button>';
			newPackageView += '</div>';
			newPackageView += '<div style="padding-left:60px;">';
			newPackageView += '<h4>'+ pkg.name +'</h4>';
			newPackageView += '<p>'+ pkg.description +'</p>';
			newPackageView += '<p>'+ pkg.price.toFixed(2) +'元</p>';
			newPackageView += '</div><hr/></div>';
		});		
		that.$('#packages').append(newPackageView);
		//** set image
		var thumbnail_url = this.model.get('thumbnail_url');
		if(thumbnail_url) that.$('img#thumbnail_url').attr('src',thumbnail_url);

		this.orderView = new PhoneOrderView({
			router: this.router,
			el: '#addView',
			phoneModel: this.model,
		});
		this.orderView.trigger('load');
	},


	phoneDetail: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('phone/detail/'+ id,{trigger: true});
		return false;
	},

	packageSelect: function(evt){
		this.$('.packageSelect').find('i').removeClass('fa-dot-circle-o');
		this.$('.packageSelect').find('i').addClass('fa-circle-o');
		var id = this.$(evt.currentTarget).attr('id');
		this.$(evt.currentTarget).find('i').removeClass('fa-circle-o').addClass('fa-dot-circle-o');
		this.$('input[name="package[id]"]').val(id);
		var pkgs = [];
		var packages = this.model.get('packages') || [];
		_.each(packages,function(pkg){
			if(pkg._id == id){
				pkgs.push(pkg);
			}
		});
		// console.log(pkgs);
		this.orderView.trigger('change:packages',pkgs);
		return false;
	},

	back: function(){
		window.history.back();
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});