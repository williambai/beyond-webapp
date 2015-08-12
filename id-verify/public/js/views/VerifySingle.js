define(['text!templates/verifySingle.tpl','text!templates/_itemVerify.tpl'], function(verifySingleTemplate,itemVerifyTemplate){
	var VerifySingleView = Backbone.View.extend({
		el: '#content',
		template: _.template(verifySingleTemplate),
		templateResult: _.template(itemVerifyTemplate),
		events: {
			'submit form': 'verify',
		},

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.on('load', this.load,this);
		},

		load: function(){
			this.render();
		},

		verify: function(){
			var that = this;
			var card_id = this.$('input[name=card_id]').val();
			var card_name = this.$('input[name=card_name]').val();

			$.ajax('/persons/verify', {
				method: 'POST',
				dataType: 'json',
				data: {
					card_id: card_id,
					card_name: card_name
				},
				success: function(data){
					var person = data[0] || {};
					that.$('#result').html(that.templateResult({person: person}));
				},
				error: function(){
					that.$('#result').html('<p>服务器错误</p>');
				}
			});
			this.$('input[name=card_id]').val('');
			this.$('input[name=card_name]').val('');
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}

	});

	return VerifySingleView;
})