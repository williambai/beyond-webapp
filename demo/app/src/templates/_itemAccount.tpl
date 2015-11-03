<hr>
<div class="media">
	<div class="pull-left">
		<a href="#profile/<%= model._id %>">
			<img class="media-object" src="<%= model.avatar %>" width="64px;" height="64px;">
		</a>
	</div>
	<div class="actionArea pull-right">
		<button class="btn btn-primary addbutton">邀请</button>
	</div>
	<div class="media-body">
		<div class="media-heading"><h4><%= model.username %><br/>&lt;<%= model.email %>&gt;</h4></div>
			<p>
				<a href="#profile/<%= model._id %>">个人资料</a> &nbsp;
				<a href="#space/<%= model._id %>">看一看</a>
			</p>
	</div>
</div>




