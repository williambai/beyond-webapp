define(['text!templates/projectContacts.html','text!templates/projectBottomBar.html','views/ScrollableView','views/ProjectContact','models/Project','models/ContactCollection'],
	function(contactsTemplate,projectBarTemplate,ScrollableView,ContactView, Project, ContactCollection){
	var ContactsView = ScrollableView.extend({
		el: '#content',
		
		template: _.template(contactsTemplate),
		templateBar: _.template(projectBarTemplate),
		
		initialize: function(options){
			this.pid = options.pid;
			this.account = options.account;
			this.model = new Project();
			this.model.url = '/projects/' + options.pid;
			this.model.on('change', this.render,this);
			this.collection = new ContactCollection();
			this.collection.url = '/projects/' + options.pid + '/contacts';
			this.collectionUrl = this.collection.url;
			this.collection.on('add', this.contactAdded, this);
			this.collection.on('reset', this.contactCollectionReset, this);
			this.on('load',this.load,this);
		},
		
		events: {
			'scroll': 'scroll',
		},

		load: function(){
			var that = this;
			this.model.fetch({
				success: function(model){
					if(that.account.id == model.get('accountId')){
						model.set('isOwner', true);
					}
					that.collection.fetch();
				}
			});
		},
		contactAdded: function(contact){
			var contactHtml = (new ContactView({project: this.model, model: contact,removeButton:true})).render().el;
			$(contactHtml).appendTo('#contactlist').hide().fadeIn('slow');
		},

		contactCollectionReset: function(collection){
			var that = this;
			collection.each(function(contact){
				that.contactAdded(contact);
			});
		},

		render: function(){
			//增加 bottom Bar
			if($('.navbar-absolute-bottom').length == 0){
				// var bottomBarView = new BottomBarView({
				// 		id: this.pid,
				// 		account: this.account,
				// 		project: this.model,
				// 		socketEvents: this.socketEvents,
				// 		parentView: this,
				// 	});
				// $(bottomBarHtml).prependTo('.app');
				var bottomBarHtml = this.templateBar({id:this.pid});
				$('.app').prepend('<div class="bottom-bar">' +bottomBarHtml + '</div>');
				if(!$('body').hasClass('has-navbar-bottom')){
					$('body').addClass('has-navbar-bottom');
				}
			}
			this.$el.html(this.template({project:this.model.toJSON()}));
			return this;
		}

	});

	return ContactsView;
});