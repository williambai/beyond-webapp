<div class="media">
	<div class="pull-left">
		<a href="#profile/<%= model.fromId %>">
			<img class="media-object" src="<%= model.avatar %>" width="64px;" height="64px;">
		</a>
	</div>
	<div class="media-body">
		<a href="#space/<%= model.fromId %>">
			<h4 class="media-heading"><%= model.username %></h4>
		</a>
		<%= model.content %>
		<div class="statusControl">
		</div>
		<p><a class="level">重要度：<%= model.level %></a>&nbsp; <a class="good">顶</a>&nbsp;<a class="bad">砸</a>&nbsp;评分：<span><%= model.score %></span></p>
		<div class="levelControl"></div>
	</div>
	<div class="media-right">
	</div>
</div>
<hr>