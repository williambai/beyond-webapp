<h3>应用接口参数</h3>
<hr>
<a class="btn btn-danger pull-right regenerate">重新设置</a>
<h4><strong>app_id：</strong><span><%= user.app.app_id %></span></h4>
<h4><strong>app_secret：</strong><span><%= user.app.app_secret %></span></h4>
<hr>
<p>注意：重新设置可能会使正在使用的服务失效，请确保您明白您所做的行为。</p>
<form>
	<div class="form-group">
		<label><h4>API权限：</h4></label>
		<div class="">
			<input type="checkbox" name="app" value="verify" <% if(user.app.apis.verify){ %>checked <% } %>/> 校验服务
			<input type="checkbox" name="app" value="base" <% if(user.app.apis.base){ %>checked <% } %>/> 获取基本信息
            <input type="checkbox" name="app" value="whole" <% if(user.app.apis.whole){ %>checked <% } %>/> 获取高级信息
		</div>
	</div>
	<div class="form-group">
		<input type="submit" class="btn btn-primary btn-block" value="提交">
	</div>
</form>
<hr>
<h4>AppId/AppSecret签名通讯协议</h4>

<h6>定义：</h6>

<p>一、系统参数</p>

名称	类型	是否必须	描述
app_id	String	必须	App ID 在这里获取 AppId 和 AppSecret
method	String	必须	API接口名称
timestamp	String	必须	时间戳，格式为yyyy-mm-dd HH:mm:ss，例如：2013-05-06 13:52:03。服务端允许客户端请求时间误差为10分钟。
format	String	否	可选，指定响应格式。默认json,目前支持格式为json
v	String	必须	API协议版本，可选值:1.0
sign	String	必须	对 API 输入参数进行 md5 加密获得，详细参考签名章节
sign_method	String	否	可选，参数的加密方法选择。默认为md5，可选值是：md5


应用参数

名称	类型	是否必须	描述
参见各个 API 内的参数说明
三、签名方法

调用 API 时需要对请求参数进行签名验证，服务器会对该请求参数进行验证是否合法的。方法如下：

根据参数名称（除签名和图片文件）将所有请求参数按照字母先后顺序排序:key + value .... key + value
例如：将foo=1,bar=2,baz=3 排序为bar=2,baz=3,foo=1，参数名和参数值链接后，得到拼装字符串bar2baz3foo1

系统暂时只支持MD5加密方式：
md5：将 secret 拼接到参数字符串头、尾进行md5加密，格式是：md5(secretkey1value1key2value2...secret)

注：我们需要的是32位的字符串，字母全部小写（如果是md5出来的是大写字母，请转为小写），图片文件不用加入签名中测试。
四、调用示例

调用API：verify，应用参数num_iid=3838293428，使用MD5加密，因为各开发语言语法不一致，以下实例只体现逻辑。
为便于说明，假设 appid、appsecret 值均为 test。

1）输入参数为：
    method=kdt.item.get
    timestamp=2013-05-06 13:52:03
    format=json
    app_id=test
    v=1.0
    sign_method=md5
    num_iid=3838293428

2）按照参数名称升序排列：
    app_id=test
    format=json
    method=kdt.item.get
    num_iid=3838293428
    sign_method=md5
    timestamp=2013-05-06 13:52:03
    v=1.0
    
3）连接字符串
    连接参数名与参数值,并在首尾加上secret，如下：
    testapp_idtestformatjsonmethodkdt.item.getnum_iid3838293428sign_methodmd5timestamp2013-05-06 13:52:03v1.0test

4）生成签名：
    32位MD5值 -> 74d4c18b9f077ed998feb10e96c58497

5）拼装HTTP请求
    将所有参数值转换为UTF-8编码，然后拼装，通过浏览器访问该地址，即成功调用一次接口，如下：
    https://id.pdbang.cn/api/entry?sign=74d4c18b9f077ed998feb10e96c58497&timestamp=2013-05-06%2013:52:03&v=1.0&app_id=test&method=verify&sign_method=md5&format=json&num_iid=3838293428