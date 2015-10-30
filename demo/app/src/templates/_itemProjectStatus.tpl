<div class="media">
	<div class="pull-left">
		<a href="#profile/<%= model.createby.uid %>">
			<img class="media-object" src="<%= model.createby.avatar %>" width="64px;" height="64px;">
		</a>
	</div>
	<div class="media-body">
		<a href="#space/<%= model.createby.uid %>">
			<h4 class="media-heading"><%= model.createby.username %></h4>
		</a>
		<%= model.content %>
		<p>
			<%= model.deltatime %>
			<span class="pull-right">
					评分：<%= model.score %>&nbsp;&nbsp;<a class="level"><span class="levelControl">重要度：<%= model.level %>&nbsp;&nbsp;</span></a>
					&nbsp;
					<a class="good"> <i class="fa fa-thumbs-o-up"></i>
						顶
					</a>
					&nbsp;
					<a class="bad"> <i class="fa fa-thumbs-o-down"></i>
						砸
					</a>
					&nbsp;
					<a class="comment-toggle"> <i class="fa fa-pencil-square-o"></i>
						评论
					</a>
					&nbsp;
			</span>
		</p>
		<div class="comment-editor"></div>
		<div class="comments">
		</div>
	</div>
	<div class="media-right">
	</div>
</div>
<hr>