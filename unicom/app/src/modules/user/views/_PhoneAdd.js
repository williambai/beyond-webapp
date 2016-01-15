var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    productTpl = require('../templates/_entityPhone.tpl'),
	ProductPhone = require('../models/ProductPhone');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#orderForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductPhone({_id: options.id});
		var page = $(productTpl);
		var editTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
		'click .view': 'phoneView',
		'click .packageSelect': 'packageSelect',
	},

	load: function(){
		if(this.model.isNew()){
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
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

	phoneView: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('phone/view/'+ id,{trigger: true});
		return false;
	},

	packageSelect: function(evt){
		this.$('.packageSelect').find('i').removeClass('fa-dot-circle-o');
		this.$('.packageSelect').find('i').addClass('fa-circle-o');
		var id = this.$(evt.currentTarget).attr('id');
		this.$(evt.currentTarget).find('i').removeClass('fa-circle-o').addClass('fa-dot-circle-o');
		this.$('input[name="package[id]"]').val(id);
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
		this.router.navigate('phone/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
			//set phonePackage
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
		}else{
			//second fetch: submit
			this.router.navigate('phone/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()) this.$('#panel-title').text('推荐终端');
		//set image
		var thumbnail_url = this.model.get('thumbnail_url');
		if(thumbnail_url) that.$('img#thumbnail_url').attr('src',thumbnail_url);
		return this;
	},
});