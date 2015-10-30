<div class="pull-right">
	<% if(!me){ %>
	<button class="btn btn-default editor-toggle" href="#">
		私信TA&nbsp;
		<span class="caret"></span>
	</button>
	<% } %>
</div>
<% if(me){ %>
<h2>我的发表</h2>
<% }else{ %>
<h2>TA的发表</h2>
<p class="bg-success" id="feedback"></p>
<% } %>

<hr>
<div class="status-editor">
</div>
<div id="list"></div>