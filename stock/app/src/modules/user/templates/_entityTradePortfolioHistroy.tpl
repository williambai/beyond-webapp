<div>
	<div id="indexTemplate">
		<div>
			<div id="panel">
				<div class="panel panel-default">
 					<div class="panel-heading">
						<h3 class="panel-title text-center">投资交易历史</h3>
					</div>
					<div class="panel-body">
						<div id="list"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
			<% var starttime = new Date(model.backup.lastupdatetime); %>
			<% var endtime = new Date(model.lastupdatetime); %>
			<div>
				<h4>
					<a href="#" class="view"><%= model.backup.name %></a>
					&nbsp;&nbsp;
					<%= model.backup.nickname %>
					&nbsp;&nbsp;
				</h4>
				<p>
					盈亏：<span style="color:red">￥<%= model.backup.times == 0 ? 0 : (model.backup.currentPrice * model.backup.quantity + model.backup.debt - model.backup.asset).toFixed(2) %></span>&nbsp;&nbsp;交易次数：<%= model.backup.times.buy + model.backup.times.sell %>
				</p>
				<p>
					交易区间：<%= starttime.getFullYear() +'-' + (1+starttime.getMonth()) + '-' + (starttime.getDate()) + ' '+ starttime.getHours() + ':'+ starttime.getMinutes() + ':'+ starttime.getSeconds() %>
					&nbsp;&nbsp;~&nbsp;&nbsp;<%= endtime.getFullYear() +'-' + (1+endtime.getMonth()) + '-' + (endtime.getDate()) + ' '+ endtime.getHours() + ':'+ endtime.getMinutes() + ':'+ endtime.getSeconds() %>
				</p>
			</div>
			<div class="graph"></div>
			<hr/>
		</div>
	</div>
	<div id="viewTemplate">
		<div>
			<a class="btn btn-primary" onclick="window.history.back();return false;">返回</a>
		</div>
		<hr/>
		<p><strong><%= model.symbol %></strong>&nbsp;自&nbsp;<strong><%= model.from %></strong>&nbsp;起的交易记录。</p>
		<div id="graphTransaction">
		</div>
		<h3 class="text-center">以下为交易明细</h3>
		<hr/>
		<div id="listTransaction">
		</div>
	</div>

	<div id="itemTransactionTemplate">
		<div>
			<% var date = new Date(model.lastupdatetime); %>
			<h4>
				<%= model.name %>&nbsp;&nbsp;<%= model.nickname %>&nbsp;&nbsp;
				
				<% if(model.direction == '买入'){ %>
				<span style="background-color: green;color:white;">
					<%= model.direction %></span>
				<% }else{ %>
				<span style="background-color: red;color:white;">
					<%= model.direction %></span>
				<% } %>
				￥<u><%= model.price %></u>
				&nbsp;&nbsp;
				<%= model.status %></h4>
			<p>
				交易日期：<%= model.date %>&nbsp;&nbsp;交易时间：<%= model.time %>
			</p>
		</div>
		<hr/>
	</div>
</div>
