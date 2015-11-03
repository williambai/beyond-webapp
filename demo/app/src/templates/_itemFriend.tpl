<hr>
<div class="media">
	<div class="pull-left">
		<a href="#profile/<%= model.fid %>">
			<img class="media-object" src="<%= model.avatar %>" width="64px;" height="64px;">
		</a>
	</div>
	<div class="actionArea pull-right">
		<button class="removebutton btn btn-danger">移除</button>
	</div>
	<div class="media-body">
		<div class="media-heading"><h4><%= model.username %></h4></div>
			<p>
				<a href="#profile/<%= model.fid %>">个人资料</a> &nbsp;
				<a href="#space/<%= model.fid %>">看一看</a>
			</p>
	</div>
</div>




