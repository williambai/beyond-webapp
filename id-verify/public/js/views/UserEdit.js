define(['text!templates/userEdit.tpl', 'models/Account'], function(userEditTemplate,Account){
	
	var UserEditView = Backbone.View.extend({
			el: '#content',
			
			template: _.template(userEditTemplate),

			events: {
				'submit form': 'submit',
			},

			initialize: function(options){
				this.id = options.id;
				this.account = options.account;
				this.model = new Account();
				this.on('load', this.load, this);
				this.model.on('change', this.render,this);
			},

			load: function(){
				if(this.id){
					this.model.url = '/accounts/' + this.id;
					this.model.fetch();
				}
				this.render();
			},

			submit: function(){
				var account = {
						email: this.$('input[name=email]').val(),
						username: this.$('input[name=username]').val(),
						roles: {
							admin: this.$('input[value=admin]').is(':checked'),
							agent: this.$('input[value=agent]').is(':checked'),
							user: this.$('input[value=user]').is(':checked'),
							app: this.$('input[value=app]').is(':checked'),
						},
						business: {
							stage: this.$('input[name=stage]:checked').val(),
							times: this.$('input[name=times]').val(),
							expired: this.$('input[name=expired]').val()
						},
						enable: this.$('input[name=enable]:checked').val(),
					};
				
				var password = this.$('input[name=password]').val();
				var password2 = this.$('input[name=password2]').val();
				if(password.length>5 && password2.length>5 && password == password2){
					account.password = password;
				}

				if(this.model.get('_id')){ //update
					$.ajax('/accounts/'+ this.model.get('_id'),{
						method: 'POST',
						data: account,
						success: function(){
							window.location.hash = 'user/index';
						},
						error: function(){

						}
					});

				}else{ // create
					$.ajax('/accounts',{
						method: 'POST',
						data: account,
						success: function(){
							window.location.hash = 'user/index';
						},
						error: function(){

						}
					});
				}

				return false;
			},

			render: function(){
				this.$el.html(this.template({user: this.model.toJSON(),account: this.account}));
				return this;
			},
		});
	return UserEditView;
});