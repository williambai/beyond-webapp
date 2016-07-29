<div>
	<div id="searchTemplate">
		<div>
			<div class="pull-right">
				<ul class="nav nav-tabs">
				  <li role="presentation" class="rankDay active" data="1"><a href="#">今天</a></li>
				  <li role="presentation" class="rankDay" data="2"><a href="#">最近两天</a></li>
				  <li role="presentation" class="rankDay" data="7"><a href="#">最近一周</a></li>
				  <li role="presentation" class="rankDay" data="30"><a href="#">最近一月</a></li>
				</ul>
			</div>
			<div class="clearfix"></div>
			<hr/>
			<div class="tabs">
				<ul class="nav nav-tabs">
				  <li role="presentation" class="rankPlace active" data="grid"><a href="#">本网格</a></li>
				  <li role="presentation" class="rankPlace" data="district"><a href="#">本地区</a></li>
				  <li role="presentation" class="rankPlace" data="city"><a href="#">所在市</a></li>
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
					<h5 class="panel-title text-center">团队排行榜</h5>
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
				<div class="col-xs-2">
					<h5>第&nbsp;<span class="badge" style="background-color:#EA5119;"><%= model.series %></span>&nbsp;名</h5>
				</div>
				<div class="col-xs-6">
					<h5><%= model._id || '' %></h5>
				</div>
				<div class="col-xs-4">
					<h5>
						<span style="text-align:right;"><%= model.total %>&nbsp;元</span>[共&nbsp;<span><%= model.quantity %></span>&nbsp;笔]
					</h5>
				</div>
			</div>
			<hr/>
		</div>
	</div>
</div>