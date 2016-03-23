<div>
	<div id="searchTemplate">
		<div>
<!-- 			<form id="searchForm">
				<input type="date">
			</form>
 -->
 			<div class="row">
				<div class="col-xs-8"></div>
				<div class="col-xs-1"><h4 class="rankDay active" id="today"><a href="#">今天</a></h4></div>
				<div class="col-xs-1"><h4 class="rankDay" id="yesterday">昨天</h4></div>
				<div class="col-xs-1"><h4 class="rankDay" id="thisweek">本周</h4></div>
				<div class="col-xs-1"><h4 class="rankDay" id="thismonth">本月</h4></div>
			</div>
			<hr/>
			<div class="tabs">
				<ul class="nav nav-tabs nav-justified">
				  <li role="presentation" class="rankPlace active" id="department"><a href="#">营业厅</a></li>
				  <li role="presentation" class="rankPlace"><a href="#">本网格</a></li>
				  <li role="presentation" class="rankPlace"><a href="#">本地区</a></li>
				  <li role="presentation" class="rankPlace"><a href="#">所在市</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div id="personIndexTemplate">
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
				<div class="col-xs-1">序号</div>
				<div class="col-xs-7">
					<h4>姓名</h4>
					<h5>营业厅名称</h5>
				</div>
				<div class="col-xs-2">5笔</div>
				<div class="col-xs-2">￥120元</div>
			</div>
			<hr/>
		</div>
	</div>
</div>