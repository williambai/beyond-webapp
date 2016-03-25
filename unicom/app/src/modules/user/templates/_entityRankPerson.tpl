<div>
	<div id="searchTemplate">
		<div>
			<div class="pull-right">
				<ul class="nav nav-tabs">
				  <li role="presentation" class="rankDay active" id="today"><a href="#">今天</a></li>
				  <li role="presentation" class="rankDay" id="yesterday"><a href="#">昨天</a></li>
				  <li role="presentation" class="rankDay" id="thisweek"><a href="#">本周</a></li>
				  <li role="presentation" class="rankDay" id="thismonth"><a href="#">本月</a></li>
				</ul>
			</div>
			<div class="clearfix"></div>
			<hr/>
			<div class="tabs">
				<ul class="nav nav-tabs nav-justified">
				  <li role="presentation" class="rankPlace active" id="department"><a href="#">营业厅</a></li>
				  <li role="presentation" class="rankPlace" id="grid"><a href="#">本网格</a></li>
				  <li role="presentation" class="rankPlace" id="district"><a href="#">本地区</a></li>
				  <li role="presentation" class="rankPlace" id="city"><a href="#">所在市</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div id="indexTemplate">
		<div>
			<div id="search">
			</div>
			<div class="panel panel-danger">
				<div class="panel-heading">
					<h5 class="panel-title text-center">个人排行榜</h5>
				</div>
				<div class="panel-body">
					<div id="list">
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="row item" id="<%= model._id %>">
				<div class="col-xs-1">
					<h4><span class="badge"><%= model.series %></span></h4>
				</div>
				<div class="col-xs-7">
					<h4><%= model.username %></h4>
					<h5><%= model.department %></h5>
				</div>
				<div class="col-xs-2">
					<h4>
						<span class="badge" style="background-color:#EA5119"><%= model.quantity %></span>&nbsp;笔
					</h4>
				</div>
				<div class="col-xs-2">
					<h4>
						￥<%= model.total %>&nbsp;元
					</h4>
				</div>
			</div>
			<hr/>
		</div>
	</div>
</div>