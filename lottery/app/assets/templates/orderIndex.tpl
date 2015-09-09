<% if(account.roles.agent){ %>
<div class="pull-right">
	<a href="#order/detail/empty" class="btn btn-primary">空白合同</a>&nbsp;
	<a href="#order/import" class="btn btn-primary">批量导入</a>&nbsp;
	<a href="#order/add" class="btn btn-primary">新增订单</a>
</div>
<p>&nbsp;</p>
<hr>
<% } %>
<p>注意：订单在首次出票前（一般在当日17:00前）可以修改或删除，一旦首次出票成功，则不能再修改或删除。</p>
<div>
<form class="form-inline">
	<div class="form-group">
		<label>从：</label>
		<div class="input-group">
			<input type="date" name="from" class="form-control" placeholder="" />
		</div>
	</div>
	<div class="form-group">
		<label>到：</label>
		<div class="input-group">
			<input type="date" name="to" class="form-control" placeholder="" />
		</div>
	</div>
	<div class="form-group">
		<label></label>
		<div class="input-group">
			<input type="text" name="searchStr" class="form-control" placeholder="手机号或用户名" />
		</div>
	</div>
	<input type="submit" value="过滤" class="btn btn-primary"/>
</form>
</div>
<hr>
<div id="list"></div>