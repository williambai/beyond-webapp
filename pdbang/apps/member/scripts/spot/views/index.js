define(['text!../templates/index.tpl'],function(indexTpl){
	var PageView = Backbone.View.extend({
		el: '#content',
		template: _.template(indexTpl),

		initialize: function(options){
			this.context = options.context;
			this.getLocation();
		},

		events: {
			'click input[name=spot_name]': 'search',
			'submit': 'submit',
		},

		getLocation: function(){
			var that = this;
			var locationOptions = {
					// 指示浏览器获取高精度的位置，默认为false
					enableHighAccuracy: true,
					// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
					timeout: 5000,
					// 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
					maximumAge: 30000
				};
			var locationSuccess = function(position){
					if(!position) {
						console.log("Geolocation is not supported by this browser.");
						return false;
					}
					var coords = position.coords || {};
					console.log("Latitude: " + coords.latitude +	"<br />Longitude: " + coords.longitude);
					$.ajax({
						url: that.context.api_prefix + '/spots?action=near1&lat=' + coords.latitude + '&lon=' + coords.longitude,
						type: 'GET',
						xhrFields: {
							withCredentials: true,
						},
						crossDomain: true,
					}).done(function(body){
						//** 定位成功，获取最近的景点名称
						body = body || {};
						if(body.name){
							that.$('input[name="spot_name"]').val(body.name);
						}else{
							that.$('input[name="spot_name"]').attr('placeholder','请选择景点');
						}
					}).fail(function(xhr,body){
						that.$('input[name="spot_name"]').attr('placeholder','定位失败，请选择景点');
					});
					return false;
				};
			var locationError = function(error){
			    switch(error.code) {
			        case error.TIMEOUT:
			            console.log("A timeout occured! Please try again!");
			            break;
			        case error.POSITION_UNAVAILABLE:
			            console.log('We can\'t detect your location. Sorry!');
			            break;
			        case error.PERMISSION_DENIED:
			            console.log('Please allow geolocation access for this to work.');
			            break;
			        case error.UNKNOWN_ERROR:
			            console.log('An unknown error occured!');
			            break;
			    }
				that.$('input[name="spot_name"]').attr('placeholder','定位失败，请选择景点');
			};
			if (navigator.geolocation){
				setTimeout(function(){
					that.$('input[name="spot_name"]').attr('placeholder','定位中...');
					setTimeout(function(){
					navigator.geolocation.getCurrentPosition(locationSuccess, locationError,locationOptions);
					}, 1000);
				}, 1000);
			}else{
				// that.$('input[name="spot_name"]').attr('placeholder','无法定位，请选择景点');
			}
		},

		search: function(){
			this.context.navigate('spot/search',{trigger: true});
			return false;
		},

		submit: function(){
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return PageView;	
});