var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    statementTpl = require('../templates/_entityStatement.tpl');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var Bonus = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/finance/statements',

	validation: {
	},
});

//** 主视图
exports = module.exports = FormView.extend({
	el: '#importForm',

	modelFilled: false,

	initialize: function(options){
		this.router = options.router;
		this.model = new Bonus();
		var page = $(statementTpl);
		var importTemplate = $('#statementImportTemplate', page).html();
		var reportTemplate = $('#statementImportReportTemplate',page).html();
		this.template = _.template(_.unescape(importTemplate || ''));
		this.reportTemplate = _.template(_.unescape(reportTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'addAttachment',
		'click .attachment': 'removeAttachment',
		'submit form': 'submit',
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
		window.history.back();
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

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var columns = [{
                header: '账期',
                key: 'month',
                width: 10
            }, {
                header: '城市',
                key: 'city',
                width: 10,
            }, {
                header: '用户ID',
                key: 'userCode',
                width: 10,
            }, {
                header: '号码',
                key: 'mobile',
                width: 20,
            }, {
                header: '当前套餐编码',
                key: 'mainProductCode',
                width: 10,
            }, {
                header: '当前套餐名称',
                key: 'mainProductName',
                width: 10,
            }, {
                header: '入网套餐编码',
                key: 'originProductCode',
                width: 10,
            }, {
                header: '入网套餐名称',
                key: 'originproductName',
                width: 10,
            }, {
                header: '入网时间',
                key: 'originTime',
                width: 15,
             }, {
                header: '发展人编码',
                key: 'vandorCode',
                width: 20,
            }, {
                header: '发展人名称',
                key: 'vandorName',
                width: 20,
            }, {
                header: '发展渠道编码',
                key: 'vandorChannelCode',
                width: 20,
            }, {
                header: '发展渠道名称',
                key: 'vandorChannelName',
                width: 10,
            }, {
                header: '支付渠道编码',
                key: 'paymentChannelCode',
                width: 10,
            }, {
                header: '支付渠道名称',
                key: 'paymentChannelName',
                width: 20,
            }, {
                header: '政策名称',
                key: 'policyName',
                width: 20,
            }, {
                header: '受理时间',
                key: 'createDate',
                width: 10,
            }, {
                header: '佣金类型',
                key: 'bonusType',
                width: 10,
            }, {
                header: '佣金净额',
                key: 'bonusNet',
                width: 10,
            }, {
                header: '佣金税额',
                key: 'bonusTax',
                width: 10,
            }, {
                header: '佣金总额',
                key: 'bonusTotal',
                width: 10,
            }, {
                header: '增值业务产品编码',
                key: 'productCode',
                width: 20,
            }, {
                header: '增值业务产品名称',
                key: 'productName',
                width: 20,
            }];
        columns.forEach(function(row, index) {
            this.$('tbody').append('<tr><td>' + (1 + index) + '</td><td>' + row.header + '</td><td>' + (row.description ? row.description : '') + '</td></tr>');
        });

	},
});