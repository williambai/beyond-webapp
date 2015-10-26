<% if(project.isOwner){ %>
<% if(!!project.closed){ %>
<button class="toggle-project btn btn-primary pull-right">开放</button>
<% }else{ %>
<button class="toggle-project btn btn-danger pull-right">关闭</button>
<% } %>
<% } %>
<h3>
	<%= project.name %></h3>
<span class="toast"></span>
<hr>
<p>
	项目描述：
	<%= project.description %></p>
<p>
	成员人数：
	<%= project.members %></p>
<p>
	项目状态：
	<% if(!!project.closed){ %>
	关闭
	<% }else{ %>
	开放
	<% } %></p>
<div>
	主持：
	<p><%= project.createby.username %></p>
	<img src="<%= project.createby.avatar %>
	">
</div>
<div>
	参与：
</div>
	<hr>
<div>
	<p>可公开信息区域。。。</p>		
</div>
