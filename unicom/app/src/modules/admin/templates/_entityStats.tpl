<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">统计管理</h4>
			</div>
			<div class="panel-body">
				<div>
					<div class="item">
				 		<div class="pull-right">
							<button class="btn btn-success viewAccount">详情</button>
						</div>
						<h4>注册用户分布</h4>
						<p>各城市、区县、网格的注册用户分布情况。</p>
					</div>
				</div>
				<hr/>
				<div>
					<div class="item">
				 		<div class="pull-right">
							<button class="btn btn-success viewOrder">详情</button>
						</div>
						<h4>订单汇总统计</h4>
						<p>各城市、区县、网格的订单统计报表。</p>
					</div>
				</div>
				<hr/>
			</div>
		</div>
	</div>
	<div id="accountStatsTemplate">
		<div class="panel panel-default">
	 		<div class="pull-left">
				<button class="btn btn-primary back">返回</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">用户统计</h4>
			</div>
			<div class="panel-body">
				<table class="table table-striped">
					<thead>
						<tr>
							<th>区域</th>
							<th>注册用户数</th>
							<th></th>
						</tr>
					</thead>
					<tbody id="list">
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div id="orderStatsTemplate">
		<div class="panel panel-default">
	 		<div class="pull-left">
				<button class="btn btn-primary back">返回</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">订单统计</h4>
			</div>
			<div class="panel-body">
				<div id="search">
					<form id="searchForm" class="form">
						<input type="hidden" name="action" value="order">
						<div class="row">
							<div class="col-xs-4">
								<label>从：</label>
							</div>
							<div class="col-xs-4">
								<label>到：</label>
							</div>
							<div class="col-xs-4">
							</div>				
						</div>
						<div class="row">
							<div class="col-xs-4">
								<input type="date" name="from" class="form-control" placeholder="yyyy/mm/dd">
							</div>
							<div class="col-xs-4">
								<input type="date" name="to" class="form-control" placeholder="yyyy/mm/dd">
							</div>
							<div class="col-xs-4">
								<input type="submit" value="筛选" class="btn btn-info">
							</div>				
						</div>
					</form>
				</div>
			</div>
		</div>
		<table class="table table-striped">
			<thead>
				<tr>
					<th>区域</th>
					<th>订单数量</th>
					<th>订单金额</th>
					<th></th>
				</tr>
			</thead>
			<tbody id="list">
			</tbody>
		</table>
	</div>
</div>