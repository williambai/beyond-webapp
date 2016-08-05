<!-- 同事圈 -->
<script type="text/template" id="tpl-activity-index">
	<div>
		<div id="carouselView"></div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">同事圈</h5>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
</script>
<!-- 同事圈头部轮播 -->
<script type="text/template" id="tpl-activity-carousel">
	<div id="app-carousel" class="carousel slide" data-ride="carousel">
	  <!-- Indicators -->
	  <ol class="carousel-indicators">
	    <li data-target="#app-carousel" data-slide-to="0" class="active"></li>
	    <li data-target="#app-carousel" data-slide-to="1"></li>
	    <li data-target="#app-carousel" data-slide-to="2"></li>
	  </ol>

	  <!-- Wrapper for slides -->
	  <div class="carousel-inner" role="listbox">
	    <div class="item active">
	      <img src="/_tmp/1.jpg" alt="...">
	      <div class="carousel-caption">
	      </div>
	    </div>
	    <div class="item">
	      <img src="/_tmp/2.jpg" alt="...">
	      <div class="carousel-caption">
	      </div>
	    </div>
	    <div class="item">
	      <img src="/_tmp/3.jpeg" alt="...">
	      <div class="carousel-caption">
	      </div>
	    </div>
	  </div>

	  <!-- Controls -->
	  <a class="left carousel-control" href="#app-carousel" role="button" data-slide="prev">
	    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
	    <span class="sr-only">Previous</span>
	  </a>
	  <a class="right carousel-control" href="#app-carousel" role="button" data-slide="next">
	    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
	    <span class="sr-only">Next</span>
	  </a>
	</div>
</script>
<!-- 同事圈动态条目 -->
<script type="text/template" id="tpl-activity-item">
	<div class="media">
		<div class="pull-left">
			<a href="#profile/<%= model.uid %>
				">
				<img class="media-object" src="" width="64px;" height="64px;"></a>
		</div>
		<div class="media-body">
			<h4 class="media-heading">
				<a href="#space/<%= model.uid %>
					">
					<%= model.username %></a>
			</h4>
			<%= model.content %>
				<p>
				<i class="fa fa-clock-o"></i>&nbsp;<%= model.deltatime %>
			</p>
<!--
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
			<div class="comments">
			</div> 
-->
		</div>
		<div class="media-right"></div>
	</div>
	<hr>
</script>
