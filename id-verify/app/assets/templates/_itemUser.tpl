<div class="pull-right">
	<% if(user.roles.app){ %>
	<a href="#user/app/<%= user._id %>">应用管理</a>
	<% } %>
	<a href="#user/edit/<%= user._id %>">修改</a>
</div>
<div>
	<h4>用户名：<%= user.username %></h4>
	<p>登录账号：<%= user.email %></p>
</div>
<hr>
