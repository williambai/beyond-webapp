var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    bankTpl = require('../templates/_entityBank.tpl');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var Bank = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/finance/banks',
});

//** 主视图
exports = module.exports = FormView.extend({
	el: '#importForm',

	modelFilled: false,

	initialize: function(options){
		this.router = options.router;
		this.model = new Bank();
		var page = $(bankTpl);
		var importTemplate = $('#importTemplate', page).html();
		var reportTemplate = $('#importReportTemplate',page).html();
		this.template = _.template(_.unescape(importTemplate || ''));
		this.reportTemplate = _.template(_.unescape(reportTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'addAttachment',
		'click .attachment': 'removeAttachment',
		'submit form': 'submit',
		'click .exportTpl': 'exportTpl',
		'click .back': 'cancel',
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

	showFileExplorer: function() {
		$('input[name=file]').click();
		return false;
	},

	addAttachment: function(evt) {
		var that = this;
		var formData = new FormData();
		formData.append('files', evt.currentTarget.files[0]);
		$.ajax({
			url: config.api.host + '/public/attachments',
			type: 'POST',
			data: formData,
			xhrFields: {
				withCredentials: true
			},
			cache: false, //MUST be false
			processData: false, //MUST be false
			contentType: false, //MUST be false
		}).done(function(data) {
			if (data) {
				that.$('.attachments').append('<span class="attachment"><input type="hidden" name="attachment" value="' + data.url + '"><img src="/images/excel.jpg" width="80px" height="80px">&nbsp;</span>');
				that.$('input[name=file]').val('');
			}
		}).fail(function(err) {
			console.log(err);
		});
		return false;
	},

	removeAttachment: function(evt) {
		if (confirm('放弃上传它吗？')) {
			var that = this;
			var filename = $(evt.currentTarget).find('img').attr('src');
			$.ajax({
				url: config.api.host + '/public/attachments',
				type: 'DELETE',
				data: {
					filename: filename
				},
				xhrFields: {
					withCredentials: true
				},
			}).done(function() {
				//remove attatchment
				$(evt.currentTarget).remove();
			}).fail(function() {

			});
		}
		return false;
	},


	exportTpl: function(){
		window.location.href = config.api.host + '/protect/finance/banks?action=exportTpl';
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
		this.router.navigate('bank/index',{trigger: true, replace: true});
		return false;
	},

	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();

		}else{
			//second fetch: submit
			// this.router.navigate('account/index',{trigger: true, replace: true});
			//reset form
			// that.$('input[name=file]').val('');
			// that.$('.attachments').empty();
			that.$el.html(this.reportTemplate({}));
		}
	},

	render: function() {
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
        var rows = [{
            name: '序号',
            description: '可以为空'
        }, {
            name: '用户姓名'
        }, {
            name: '手机号码'
        }, {
            name: '银行卡姓名',
            description: ''
        }, {
            name: '银行卡号码',
            description: '',
        }, {
            name: '银行卡有效期',
            description: '如，2019-12',
        }, {
            name: '身份证号码',
            description: '银行卡实名制',
        }, {
            name: '银行名称',
            description: '',
        }, {
            name: '银行代码',
            description: ''
        }, {
            name: '银行地址',
            description: '',
        }];
        rows.forEach(function(row, index) {
            this.$('tbody').append('<tr><td>' + (1 + index) + '</td><td>' + row.name + '</td><td>' + (row.description ? row.description : '') + '</td></tr>');
        });
		return this;
	},
});