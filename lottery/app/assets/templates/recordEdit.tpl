<h4 class="text-center">出票信息</h4>
<hr/>
<form class="form-horizontal lottery">
	<label>客户信息</label>
	<input name="username" type="text" value="<%= record.customer.username %>" placeholder="姓名" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="userid" type="text" value="<%= record.customer.cardid %>" placeholder="身份证号码" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="email" type="text" value="<%= record.customer.email %>" placeholder="手机号码" class="form-control" disabled>
	<span class="help-block"></span>
	<br>
	<label>彩票信息</label>
	<input name="lname" type="text" value="<%= record.game.name %>" placeholder="彩票名称" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="ltype" type="text" value="<%= record.game.ltype %>" placeholder="彩票代码" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="periodnum" type="text" value="<%= record.game.periodnum %>" placeholder="彩票期号" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="content" type="text" value="<%= record.game.content %>" placeholder="彩票号码" class="form-control">
	<span class="help-block"></span>
	<br>
	<label>费用</label>
	<input name="lottery_cost" type="text" value="<%= record.game.cost %>" placeholder="费用" class="form-control" disabled>
	<span class="help-block"></span>
	<br>
	<input type="checkbox" name="sms" value="every" disabled <% if(record.game.sms){ %>checked <% } %>>&nbsp;短信提醒
	<span class="help-block"></span>
	<br>
	<input type="submit" class="btn btn-primary btn-block" value="确认" />
</form>
<br>
<br>