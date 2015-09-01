<h4 class="text-center">彩票订单</h4>
<hr/>
<form class="form-horizontal lottery">
	<label>客户信息</label>
	<input name="username" type="text" placeholder="姓名" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="userid" type="text" placeholder="身份证号码" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="phoneid" type="text" placeholder="手机号码" class="form-control" disabled>
	<span class="help-block"></span>
	<br>
	<label>选号</label>
	<input name="lottery_name" type="text" placeholder="3d" class="form-control" disabled>
	<span class="help-block"></span>
	<input name="lottery_code" type="text" placeholder="号码" class="form-control">
	<span class="help-block"></span>
	<br>

	<label>周期</label>
	<input name="lottery_period" type="text" placeholder="连续几期" class="form-control">
	<span class="help-block"></span>
	<br>
	<label>费用</label>
	<input name="lottery_cost" type="text" placeholder="费用" class="form-control" disabled>
	<span class="help-block"></span>
	<br>
	<input type="checkbox">&nbsp;短信提醒
	<input name="phoneid" type="text" placeholder="手机号码" class="form-control">
	<span class="help-block"></span>
	<br>
	<input type="checkbox">&nbsp;中奖自动转账
	<span class="help-block">*兑奖自动转账</span>
	<input name="phoneid" type="text" placeholder="银行名称" class="form-control">
	<span class="help-block"></span>
	<input name="phoneid" type="text" placeholder="银行卡号码" class="form-control">
	<span class="help-block"></span>
	<input name="phoneid" type="text" placeholder="银行开户所在地" class="form-control">
	<span class="help-block"></span>
	<br>
	<input type="submit" class="btn btn-primary btn-block" value="确认" />
</form>
<br>
<div id="result"></div>