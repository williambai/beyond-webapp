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
				  <li role="presentation" class="rankPlace active" data="department"><a href="#">营业厅</a></li>
				  <li role="presentation" class="rankPlace" data="grid"><a href="#">本网格</a></li>
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
				<div class="col-xs-2">
					<h4><span class="badge"><%= model.series %></span></h4>
				</div>
				<div class="col-xs-6">
					<h4><%= model.username %></h4>
					<h5><%= model.department && model.department.name %></h5>
				</div>
				<div class="col-xs-4">
					<h5>
						<span class="badge" style="background-color:#EA5119"><%= model.quantity %></span>&nbsp;笔&nbsp;<span style="text-align:right;"><%= model.total %>&nbsp;元</span>
					</h5>
				</div>
			</div>
			<hr/>
		</div>
	</div>
</div>