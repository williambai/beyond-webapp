define(['text!templates/loading.html','text!templates/profileEdit.html','models/Account'], function(loadingTemplate,profileEditTemplate,Account){
	var ProfileEditView = Backbone.View.extend({

		el: '#content',
		template: _.template(profileEditTemplate),

		loaded: false,
		loadingTemplate: _.template(loadingTemplate),

		initialize: function(options){
			this.model = new Account();
			this.model.url = '/accounts/me';

			this.model.bind('change', this.render, this);
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.model.fetch();
		},
		
		events: {
			'change input[name=avatar]': 'uploadAvatar',
			'submit form': 'updateProfile',
		},

		uploadAvatar: function(evt){
			var that = this;
			var formData = new FormData();
			formData.append('files',evt.currentTarget.files[0]);
			$.ajax({
				url: '/accounts/me/avatar',
				type: 'POST',
				data: formData,
				cache: false,//MUST be false
				processData: false,//MUST be false
				contentType:false,//MUST be false
				success: function(data){
					that.model.set('avatar', data);
				},
				error: function(err){
				  console.log(err);
				},
			});
          return false;
		},

		updateProfile: function(){
			$.post(
				'/accounts/me',
				{
					username: this.$('input[name=username]').val(),
					realname: this.$('input[name=realname]').val(),
					biography: this.$('textarea[name=biography]').val(),
				},
				function success(){
					window.location.hash = 'profile/me';
				},function failure(err){
					console.log(err);
				}
			);
			return false;
		},

		render: function(){
			if(!this.loaded){
				this.$el.html(this.loadingTemplate);
			}else{
				this.$el.html(this.template(this.model.toJSON()));
			}
			return this;
		}
	});
	return ProfileEditView;
});