/**
 * params: 
 * content [text | json object]
 * MsgType:[text|image|vioce|video|shortvideo|location|moreimage]
 *
 * JSON Object MUST HAS:
 * 
 * {
 *    MsgType:'text',
 *    CreateTime:
 *    Content:
 * }
 * {
 *    MsgType:'image',
 *    CreateTime:
 *    Url:
 * }
 * {
 *    MsgType:'mixed',
 *    CreateTime:
 *    Content:
 *    Urls:[]
 * }
 * {
 *    MsgType:'link',
 *    CreateTime:
 *    Title:
 *    Description:
 *    Url:
 * }
 * {
 *    MsgType:'voice',
 *    CreateTime:
 *    Url:
 *    Format:[amr,speex]
 * }
 * {
 *    MsgType:'shortvideo',
 *    CreateTime:
 *    Url:
 *    ThumbUrl:
 * }
 * {
 *    MsgType:'video',
 *    CreateTime:
 *    Url:
 *    ThumbUrl:
 * }
 * {
 *    MsgType:'location',
 *    CreateTime:
 *    Location_X:
 *    Location_Y:
 *    Scale:
 *    Label:
 * }
 * {
 * 	  MsgType: 'email',
 * 	  CreateTime:
 * 	  From:
 * 	  To:
 * 	  CC:
 * 	  Subject:
 * 	  Url:
 * }
 * 
 * -- OR --
 * 
 * String: display directly
 */

module.exports = exports = function(app,mongoose){

	//new version
	var schema = new mongoose.Schema({
			from: {
				uid: String,
				username: String,
				avatar: String,
			},
			to: {
				uid: String,
				username: String,
				avatar: String,
			},
			type: String,//text|image|vioce|video|shortvideo|location|moreimage
			content: {
				subject: String,
				body: String,
				url: String,
				thumbnail: String,
				format: String,
				urls: [],
				location_x: Number,
				location_y: Number,
				scale: Number,
				label: String,
			},
			tags: [],
			comments:[{
				uid: String,
				username: String,
				avatar: String,
				content: {},
				replies: [{
					uid: String,
					username: String,
					avatar: String,
					content: {},
				}]				
			}],
			weight: Number, // important index: 0~100
			voters:[],//accountId
			votes: [],//accountId,username,vote(good or bad)
			good: Number,
			bad: Number,
			score: Number,
			lastupdatetime: Date
		});

	schema.set('collection', 'account.messages');

	return mongoose.model('AccountMessage', schema);
};