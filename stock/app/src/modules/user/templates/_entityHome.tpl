<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">资产管理</h4>
			</div>
			<div class="panel-body">
				<div id="list" class="row">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="col-md-6 col-xs-6">
			<div class="item" id="<%= model._id %>">
				<div class="panel panel-default">
					<div class="pull-right">
					</div>
					<div class="panel-heading">
						<h3 class="panel-title text-center"><%= model.company.name %></h3>
					</div>
					<div class="panel-body">
						<div class="row" style="bold-bottom: 1px;">
							<div class="col-md-12 col-xs-12">
								<h4 class="pull-right">￥20000.00</h4>
							</div>
						</div>
						<hr/>
						<div class="row">
							<div class="col-md-4 col-xs-4">
								<h5 class="text-center">资产余额</h5>
							</div>
							<div class="col-md-4 col-xs-4">
								<h5 class="text-center">股票市值</h5>
							</div>
							<div class="col-md-4 col-xs-4">
								<h5 class="text-center">资金可用</h5>
							</div>
						</div>
						<hr/>
						<div class="row">
							<div class="col-md-4 col-xs-4">
								<h5 class="text-center">10000</h5>
							</div>
							<div class="col-md-4 col-xs-4">
								<h5 class="text-center">12345</h5>
							</div>
							<div class="col-md-4 col-xs-4">
								<h5 class="text-center">12345</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>