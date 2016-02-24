var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    appTpl = require('../templates/_entityPlatformApp.tpl'),
	PlatformApp = require('../models/PlatformApp');
var config = require('../conf');
var PlatformFeatureCollection  = require('../models/PlatformFeatureCollection');

exports = module.exports = FormView.extend({

	el: '#platformAppForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new PlatformApp({_id: options.id});
		var page = $(appTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			this.loadFeatures();
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	loadFeatures: function(callback){
		var that = this;
		var platformFeatureCollection = new PlatformFeatureCollection();
		platformFeatureCollection.fetch({
			xhrFields: {
				withCredentials: true
			},
			data: {
				action: 'all'
			},
			success: function(collection){
				collection = collection || [];
				var featuresView = '';
				collection.each(function(model){
					featuresView += '<input type="checkbox" name="features[]" value="'+ model.get('nickname') +'">&nbsp;&nbsp;'+ model.get('name') +'&nbsp;&nbsp;&nbsp;<br/>';
				});
				that.$('#features').html(featuresView);
				callback && callback();
			}
		});
	},

	inputText: function(evt){
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);				
			}
		})
		return false;
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('.form-group').removeClass('has-error');
		this.$('.form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				errors.push(error);
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
			}
		});
		if(!_.isEmpty(errors)) return false;
		//validate finished.

		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	
	cancel: function(){
		this.router.navigate('app/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
			//get features
			this.loadFeatures(function(){
				//set features
				var features = that.model.get('features');
				_.each(features, function(feature){
					that.$('input[name="features[]"][value="'+ feature +'"]').attr('checked', true);
				});
			});

		}else{
			//second fetch: submit
			this.router.navigate('app/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()) this.$('.panel-title').text('新增应用');
		return this;
	},
});