<div>
	<div id="indexTemplate">
		<div class="pull-left">
			<button class="btn btn-info back">返回</button>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">我的金币</h5>
			</div>
			<div class="panel-body">
		 		<div class="pull-right">
		 			<h5>已兑现</h5>
		 		</div>
		 		<h5>&nbsp;</h5>
				<hr/>				
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
<!-- 		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-info view"></button>
		</div>
 -->
 		<div class="pull-right">
 			<h4>￥<%= model.cash.toFixed(2) %></h4>
 		</div>
 		<h4>业务类型：<%= model.category %>&nbsp;&nbsp;</h4>
 		<p>收益：<%= model.income.toFixed(2) %>&nbsp;元&nbsp;&nbsp;当前状态：<%= model.cashStatus %></p>
		<p>更新于：<%= model.deltatime %></p>
		<hr/>
	</div>
	<div id="statTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-info index">明细</button>
			</div>
			<div class="panel-heading">
				<h5 class="panel-title text-center">我的金币</h5>
			</div>
			<div class="panel-body">
				<h4>当前收益</h4>
				<h4>已兑换收益</h4>
				<h4>近一周收益</h4>
				<h4>近一月收益</h4>
			</div>
		</div>
	</div>
</div>
