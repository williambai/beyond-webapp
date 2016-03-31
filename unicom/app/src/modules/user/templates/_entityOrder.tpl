<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">我的工作成绩</h5>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="item" id="<%= model._id %>">
				<div class="media">
					<div class="media-left">
						<img src="" width="50px" height="50px">
					</div>
					<div class="media-body">
						<h4><%= model.goods && model.goods.name %></h4>
				 		<p><i class="fa fa-user"></i>&nbsp;<%= model.customer && model.customer.mobile %></p>
						<p><i class="fa fa-clock-o"></i>&nbsp;<%= model.deltatime %>&nbsp;<i class="fa fa-flag"></i>&nbsp;<%= model.status %></p>
					</div>
					<div class="media-right">
				 		<div class="pull-right">
				 			<h4><!-- <i class="fa fa-cart-arrow-down"></i> -->&nbsp;￥<%= model.total && model.total.toFixed(2) %></h4>
<!-- 				 			<h4><i class="fa fa-gift"></i>&nbsp;+&nbsp;<%= model.bonus.income %></h4>
				 			<h4><i class="fa fa-thumbs-o-up"></i>&nbsp;+&nbsp;<%= model.bonus.points %></h4>
 -->				 		</div>
					</div>
				</div>

			</div>
			<hr/>
		</div>
	</div>
</div>

	<!-- <div id="_indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">我的工作成绩</h5>
			</div>
			<div class="panel-body">
				<div class="">
					<div class="row">
						<div class="col-sm-4 col-xs-4">
							<div class="text-center">
								<h4>
									分销订单
								</h4>
								<h3 style="color:red;">25</h3>
							</div>
						</div>
						<div class="col-sm-4 col-xs-4">
							<div class="text-center">
								<h4>
									分销总额
								</h4>
								<h3 style="color:red;">10025.24</h3>
							</div>
						</div>
						<div class="col-sm-4 col-xs-4">
							<div class="text-center">
								<h4>
									我的佣金
								</h4>
								<h3 style="color:red;">25.00</h3>
							</div>
						</div>
					</div>
				</div>
				<hr/>
				<div id="list">
					<!--订单模板-->
					<h5 style="color:red;text-align:center;">说明：下表中的金额为订单实际收款金额。</h5>
					<hr/>
					<div class="row">
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>手机号码</h5>
							</div>
						</div>
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>订单完成时间</h5>
							</div>
						</div>
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>金额(元)</h5>
							</div>
						</div>
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>佣金(元)</h5>
							</div>
						</div>
					</div>
					<hr/>
					<div class="row">
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>18631233333</h5>
							</div>
						</div>
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>2015-12-02</h5>
							</div>
						</div>
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>￥13.60</h5>
							</div>
						</div>
						<div class="col-sm-3 col-xs-3">
							<div class="text-center">
								<h5>￥1.36</h5>
							</div>
						</div>
					</div>
					<hr/>
				</div>

				<!--佣金模板-->
				<div id="bonus">
					<div class="row">
						<div class="col-sm-4 col-xs-4">
							<div class="text-center">
								<h5>佣金余额：￥32.4</h5>
								<h5>冻结金额：￥12.09</h5>
							</div>
						</div>
						<div class="col-sm-4 col-xs-4">
							<div class="text-center">
								<button class="btn btn-danger">我要提现</button>
								<p class="small">超过100元才可以提现</p>
							</div>
						</div>
					</div>
					<hr/>
					<div id="list">
						<div class="row">
							<div class="col-sm-4 col-xs-4">
								<div class="text-center">
									<h5>交易时间</h5>
								</div>
							</div>
							<div class="col-sm-4 col-xs-4">
								<div class="text-center">
									<h5>交易金额(元)</h5>
								</div>
							</div>
							<div class="col-sm-4 col-xs-4">
								<div class="text-center">
									<h5>备注</h5>
								</div>
							</div>
						</div>
						<hr/>
						<div class="row">
							<div class="col-sm-4 col-xs-4">
								<div class="text-center">
									<h5>2015-12-02</h5>
								</div>
							</div>
							<div class="col-sm-4 col-xs-4">
								<div class="text-center">
									<h5>+14.50</h5>
								</div>
							</div>
							<div class="col-sm-4 col-xs-4">
								<div class="text-center">
									<h5>佣金收入</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div> -->