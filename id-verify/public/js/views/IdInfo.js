define(['text!templates/idInfo.tpl','IdInfo'], function(idInfoTemplate,IdInfo){
	var IdInfoView = Backbone.View.extend({
		el: '#content',
		template: _.template(idInfoTemplate),
		events: {
			'submit form': 'getInfo',
		},

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.on('load', this.load,this);
		},

		load: function(){
			this.render();
		},

		getInfo: function(){
			var card_id = this.$('input[name=card_id]').val();
			var card_name = this.$('input[name=card_name]').val();
			var idInfo = IdInfo.build(card_id);
			this.$('#result').html('<h4>解析结果：</h4>' + idInfo);
			this.$('input[name=card_id]').val('');
			this.$('input[name=card_name]').val('');
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}

	});

	return IdInfoView;
})