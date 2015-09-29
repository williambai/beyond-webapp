var _ = require('underscore');

exports = module.exports = {

	buildContent: function(type,content){
		var type = type || '';

		switch(type){
			case 'text':
				var body = (content.body && content.body.trim()) || '';
				var newContent = '';
				if(/^http.*(png|jpg|git)$/.test(body)){
					newContent += '<img src="' + body +'" width="50%" target-data="'+ body +'" target-type="image">';
				}else if(/^http.*pdf$/.test(body)){
					newContent += '<a href="' + body + '">';
					newContent += '<img src="images/pdf.png" target-data="'+ body +'" target-type="pdf">';
					newContent += '</a>'; 
				}else{
					newContent += '<span>'+ body + '</span>';
				}
				return newContent;

			case 'file':
				newContent = '<p>'+ content.body + '</p>';
				return newContent;

			case 'image':
				return '<span><img src="' + content.urls + '" target-data="'+ content.urls +'" target-type="image"></span>';
			
			case 'mixed':
				var newContent = '<span>' + content.body + '</span>';
				for(var i=0; i<content.urls.length; i++){
					if(/[png|jpg]$/.test(content.urls[i])){
						newContent += '<img src="' + content.urls[i] +'" width="' + parseInt(50/content.urls.length-1) +'%" target-data="'+ content.urls[i] +'" target-type="image">';
					}else if(/[pdf]$/.test(content.urls[i])){
						newContent += '<a href="' + content.urls[i] + '">';
						newContent += '<img src="images/pdf.png" target-data="'+ content.urls[i] +'" target-type="pdf">';
						newContent += '</a>'; 
					}
				}
				return newContent;
			
			case 'link':
				var newContent = '<a href="' + content.urls + '" target="_blank">';
				newContent += '<h4>' +content.subject + '</h4>';
				newContent += '<span>'+ content.body + '</span>';
				return newContent;

			case 'video':
				break;
			case 'shortvideo':
				break;
			case 'location':
				break;
			case 'email':
				break;
			default:
				break;	
		}
	},

	convertContent: function(contentObject){
		if(!contentObject){
			return;
		}
		if(typeof contentObject == 'string'){
			var contentString = contentObject.trim();
			var newString = '';
			if(!/^http/.test(contentString)){
				newString += '<p>'+ contentString + '</p>'
			}else{
				if(/^http.*(png|jpg|git)$/.test(contentString)){
					newString += '<img src="' + contentString +'" width="50%" target-data="'+ contentString +'" target-type="image">';
				}else if(/^http.*(mp4|mov)$/.test(contentString)){
				}else if(/^http.*(mp3|amr)$/.test(contentString)){

				}else if(/[pdf]$/.test(contentString)){
					newString += '<a href="' + contentString + '">';
					newString += '<img src="images/pdf.png" target-data="'+ contentString +'" target-type="pdf">';
					newString += '</a>'; 
				}else{
					newString += '<a href="' + contentString + '">';
					newString += '<img src="images/unknown.png" target-data="'+ contentString +'" target-type="unknown">';
					newString += '</a>'; 
				}
			}
			return newString;
		}else{
			var newContent = '';
			if(contentObject.MsgType == 'text'){
				newContent += '<p>' + contentObject.Content + '</p>';
			}else if(contentObject.MsgType == 'image'){ 
				if(contentObject.PicUrl){
					newContent += '<p><img src="' + contentObject.PicUrl + '">';	
				}
			}else if(contentObject.MsgType == 'mixed'){
				newContent += '<p>' + contentObject.Content + '</p>';
				for(var i=0; i<contentObject.Urls.length; i++){
					if(/[png|jpg]$/.test(contentObject.Urls[i])){
						newContent += '<img src="' + contentObject.Urls[i] +'" width="' + parseInt(50/contentObject.Urls.length-1) +'%" target-data="'+ contentObject.Urls[i] +'" target-type="image">';
					}else if(/[pdf]$/.test(contentObject.Urls[i])){
						newContent += '<a href="' + contentObject.Urls[i] + '">';
						newContent += '<img src="images/pdf.png" target-data="'+ contentObject.Urls[i] +'" target-type="pdf">';
						newContent += '</a>'; 
					}
				}
			}else if(contentObject.MsgType == 'link'){
				newContent += '<a href="' + contentObject.Url + '">';
				newContent += '<h4>' +contentObject.Title + '</h4>';
				newContent += '<p>'+ contentObject.Description + '</p>';
			}
			return newContent;
		}
	},

	transformTime: function(createtime){
		var deltatime = (_.now() - new Date(createtime).getTime())/1000;
		var days = parseInt(deltatime/(24*60*60));
		var hours = parseInt(deltatime/(60*60));
		var mins = parseInt(deltatime/60);
		if(days>0){
			return days + ' 天之前';
		}else if(hours>0){
			return hours + ' 小时之前';
		}else if(mins>0){
			return mins + ' 分钟之前';
		}else{
			return '刚刚';
		}
	},
};
