<div class="pull-right">
	<p class="text-right">
	<% if(user.roles.app){ %>
	<a href="#user/app/<%= user._id %>">应用管理</a>&nbsp;
	<% } %>
	<a href="#user/edit/<%= user._id %>">修改</a>&nbsp;<a href="#delete" id="">删除</a></p>
	<% if(account.roles.agent){ %>
	<p class="text-right"><a href="#lottery/3d/<%= user._id %>">赠送彩票</a></p>
	<% } %>
</div>
<div>
	<h4>用户名：<%= user.username %></h4>
	<p>登录账号：<%= user.email %>, 用户状态：<%= !!(user.enable) ? '有效' : '禁用'  %></p>
</div>
<hr>
