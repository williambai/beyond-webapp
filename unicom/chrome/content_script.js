/**
 * 参考
 * http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
 *
 * 
 */
// var postInfo = $("div.postDesc");
// if(postInfo.length!=1){
// 	chrome.runtime.sendMessage({type:"cnblog-article-information", error:"获取文章信息失败."});
// }
// else{
// 	var msg = {
// 		type: "cnblog-article-information",
// 		title : $("#cb_post_title_url").text(),
// 		postDate : postInfo.find("#post-date").text(),
// 		author : postInfo.find("a").first().text(),
// 		url: document.URL
// 	};
// 	chrome.runtime.sendMessage(msg);
// }


// chrome.extensions.onRequest.addListener(function(request, sender, sendResponse){

// });

var loginPlugin = {};
$('#dmsg2').hide();
$('#main').show();
$('#LOGIN_PROVINCE_CODE').attr('value','85');
$('#captureImage').attr('src','https://gz.cbss.10010.com/image?mode=validate&width=60&height=20');
$('#LOGIN_PROVINCE_REDIRECT_URL').attr('value','https://gz.cbss.10010.com/essframe');

var node = document.querySelector('input[type=button]');
$('input[type="button"]').remove();
console.log('++++++')
// console.log(node.outerHTML)
// $('div.submit').prepend(node.outerHTML.replace('checkSubmit()','checkSubmit1()'));
$('div.submit').prepend('<input value=" " class="button" type="submit" onmouseout="this.className=\'button buttonOff\'" onmouseover="this.className=\'button buttonOver\'">');
$('#staffLogin').attr('action','https://gz.cbss.10010.com/essframe?service=page/LoginProxy&login_type=redirectLogin');
// $('input[type="button"]').click();
// $('input[type="button"]').attr('onclick','alert("ok!");');


// var s = document.createElement('script');
// // TODO: add "script.js" to web_accessible_resources in manifest.json
// s.src = chrome.extension.getURL('inject.js');
// s.onload = function() {
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);



function scriptFromFile(file) {
    var script = document.createElement("script");
    script.src = chrome.extension.getURL(file);
    return script;
}

function scriptFromSource(source) {
    var script = document.createElement("script");
    script.textContent = source;
    return script;
}

function inject(scripts) {
    if (scripts.length === 0)
        return;
    var otherScripts = scripts.slice(1);
    var script = scripts[0];
    var onload = function() {
        script.parentNode.removeChild(script);
        inject(otherScripts);
    };
    if (script.src != "") {
        script.onload = onload;
        document.head.appendChild(script);
    } else {
        document.head.appendChild(script);
        onload();
    }
}
// var formulaImageUrl = chrome.extension.getURL("formula.png");
// var codeImageUrl = chrome.extension.getURL("code.png");

inject([
    // scriptFromSource("var formulaImageUrl = '" + formulaImageUrl + "';"),
    // scriptFromSource("var codeImageUrl = '" + codeImageUrl + "';"),
    // scriptFromFile("EqEditor/eq_editor-lite-17.js"),
    // scriptFromFile("EqEditor/eq_config.js"),
    // scriptFromFile("highlight/highlight.pack.js"),
    scriptFromFile("patch/login.js"),
    scriptFromFile('patch/public.js'),
    scriptFromFile('patch/ajax.js'),
    // scriptFromFile('patch/ChangeElement.js'),
    scriptFromFile('patch/login_submit.js')
]);