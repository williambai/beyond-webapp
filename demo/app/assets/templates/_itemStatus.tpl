<div class="media">
	<div class="pull-left">
		<a href="#profile/<%= model.fromId %>
			">
			<img class="media-object" src="<%= model.avatar %>" width="64px;" height="64px;"></a>
	</div>
	<div class="media-body">
		<h4 class="media-heading">
			<a href="#status/<%= model.fromId %>
				">
				<%= model.username %></a>
		</h4>
		<%= model.content %>
		<p>
			<%= model.deltatime %>
			<span class="pull-right">
					<a class="good"> <i class="fa fa-heart-o"></i>
						&nbsp;点赞
					</a>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<a class="comment-toggle"> <i class="fa fa-pencil-square-o"></i>
						&nbsp;评论
					</a>
			</span>
		</p>
		<div class="comment-editor"></div>
		<div class="comments"></div>
	</div>
	<div class="media-right"></div>
</div>
<hr>