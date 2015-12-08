var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    channelCategoryTpl = require('../templates/_entityChannelCategory.tpl'),
	ChannelCategory = require('../models/ChannelCategory');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new ChannelCategory();
		var page = $(channelCategoryTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		var that = this;
		this.render();
		$.ajax({
			url: config.api.host + '/platform/features',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data){
			data = data || [];
			var checkboxs = '';
			data.forEach(function(item){
				checkboxs += '<input type="checkbox" name="features[]" value="'+ item.nickname +'">&nbsp;'+ item.name +'&nbsp';
			});
			that.$('#features').html(checkboxs);
		});
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		if(object.status.code == 0){
			object.status.message = '无效';
		}else{
			object.status.message = '有效';
		}
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	cancel: function(){
		this.router.navigate('channel/category/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.router.navigate('channel/category/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});