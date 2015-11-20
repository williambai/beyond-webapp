<p></p>
<p></p>
<div class="">
	<div class="">
		<div class="">
			<div class="panel panel-default">
				<% if(success){ %>
				<div class="panel-heading">
					<h3 class="panel-title text-center">账号激活成功</h3>
				</div>
				<div class="panel-body">
					<p>您的账号已激活，可以登录。</p>
					<p>
						请
						<a href="/">登录</a>
					</p>
				</div>
				<% }else{ %>
				<div class="panel-heading">
					<h3 class="panel-title text-center">账号激活失败</h3>
				</div>
				<div class="panel-body">
					<p>错误信息：</p>
					<p><%= message.code %>: <%= message.errmsg %></p>
				</div>
				<% } %></div>
		</div>
	</div>
</div>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<div class="text-center">
	<hr>
	<p>版权所有@2014~2015&nbsp;&nbsp;苏州白杨软件有限公司</p>
	<p>
		支持IPhone、IPad、Android等移动终端。Windows、Mac等桌面系统，请使用&nbsp;Chrome&nbsp;谷歌最新浏览器访问
		<a href="https://www.baidu.com/s?wd=chrome浏览器官方下载" target="_blank">下载</a>
	</div>