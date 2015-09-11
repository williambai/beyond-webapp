<h4 class="text-center">彩票订单</h4>
<hr/>
<form class="lottery">
	<div class="form-group" id="username">
		<label>客户信息</label>
		<input name="username" type="text" placeholder="姓名" value="<%= order.customer.username %>" class="form-control">
		<span class="help-block"></span>
	</div>
	<div class="form-group" id="email">
		<input name="email" type="text" placeholder="手机号码" value="<%= order.customer.email %>" class="form-control">
		<span class="help-block"></span>
	</div>
	<div class="form-group">
		<label>彩票类型（每注2.00元）</label>
		<br/>
		<div class="btn-group">
			<% if(order.game.ltype == 'QGSLTO'){ %>
			<button class="btn btn-primary ltype" id="QGSLTO">双色球</button>
			<% }else{ %>
			<button class="btn btn-default ltype" id="QGSLTO">双色球</button>
			<% } %>
			<% if(order.game.ltype == 'GXPCK3'){ %>
			<button class="btn btn-primary ltype" id="GXPCK3">福彩3D</button>
			<% }else{ %>
			<button class="btn btn-default ltype" id="GXPCK3">福彩3D</button>
			<% } %>
			<% if(order.game.ltype == 'QGLOTO'){ %>
			<button class="btn btn-primary ltype" id="QGLOTO">七乐彩</button>
			<% }else{ %>
			<button class="btn btn-default ltype" id="QGLOTO">七乐彩</button>
			<% } %></div>
			<br/>
			<br/>
		<input name="content" type="text" placeholder="自选号码" value="<%= order.game.content %>" class="form-control">
		<span class="help-block"></span>
	</div>

	<div class="form-group">
		<label>连续投注期数</label>
		<input name="periods" type="text" placeholder="连续几期(数字)" value="<%= order.game.periods %>" class="form-control">
		<span class="help-block"></span>
	</div>
	<div class="form-group">
		<% if(order.game.sms == 'first'){ %>
		<input type="checkbox" name="sms" value="first" checked>
		&nbsp;首次短信提醒
		<% }else{ %>
		<input type="checkbox" name="sms" value="first">
		&nbsp;首次短信提醒
		<% } %>
		<% if(order.game.sms == 'every'){ %>
		<input type="checkbox" name="sms" value="every" checked>
		&nbsp;每期短信提醒
		<% }else{ %>
		<input type="checkbox" name="sms" value="every">
		&nbsp;每期短信提醒
		<% } %>
		<span class="help-block">提示：短信提醒 0.1 元/条</span>
		<br/>
	</div>

	<div class="pull-right">
		<p class="">
			彩票费用：
			<span id="lottery_cost">
				<%= order.lottery_cost %></span>
			元
		</p>
		<p class="">
			短信提醒：
			<span id="sms_cost">
				<%= order.sms_cost %></span>
			元
		</p>
	</div>
	<div>
		<p>&nbsp;</p>
	</div>
	<p>&nbsp;</p>
	<hr>
	<h3 class="pull-right">
		合计：
		<span id="total_cost">
			<%= order.total_cost %></span>
		元
	</h3>
	<br/>
	<input type="submit" class="btn btn-primary btn-block" value="确认" />
</form>
<p>&nbsp;</p>
<p>&nbsp;</p>