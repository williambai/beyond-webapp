<% if(project.isOwner){ %>
	<% if(project.closed){ %>
		<button class="toggle-project btn btn-primary pull-right">
		开放
		</button>
	<% }else{ %>
		<button class="toggle-project btn btn-danger pull-right">
		关闭
		</button>
	<% } %>
<% } %>
<h3><%= project.name %></h3><span class="toast"></span>
<hr>
<p>项目描述：<%= project.description %></p>
<p>成员人数：<%= contacts_num %></p>
<p>项目状态：
	<% if(project.closed){ %>
	关闭
	<% }else{ %>
	开放
	<% } %>
</p>