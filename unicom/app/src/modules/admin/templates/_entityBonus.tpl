<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">佣金管理</h4>
			</div>
			<div class="panel-body">
				<div id="search">
				</div>
				<div id="list">
				</div>
			</div>
		</div>
	</div>	
	<div id="searchTemplate">
		<form id="searchForm" class="form-inline">
			<input type="hidden" name="action" value="search">
			<div class="form-group">
				<label>年份：</label>
				<input type="text" name="year" class="form-control" value="<%= (new Date()).getFullYear() %>">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<select class="form-control" name="month">
					<option value="1">1 月</option>
					<option value="2">2 月</option>
					<option value="3" selected>3 月</option>
					<option value="4">4 月</option>
					<option value="5">5 月</option>
					<option value="6">6 月</option>
					<option value="7">7 月</option>
					<option value="8">8 月</option>
					<option value="9">9 月</option>
					<option value="10">10 月</option>
					<option value="11">11 月</option>
					<option value="12">12 月</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control" name="status">
					<option value="">全部</option>
					<option value="未核算">未核算</option>
					<option value="已核算">已核算</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="用户名或手机号">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
			<div class="pull-right" >
				<button class="btn btn-success edit">发放</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4><%= model.name %>&nbsp;&nbsp;<%= model.mobile %></h4>
			<p><%= model.year %>&nbsp;年<%= model.month %>&nbsp;月&nbsp;&nbsp;<%= model.status %></p>
			<hr/>
		</div>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">发放佣金</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>用户名：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>手机号码：</label>
						<input type="text" name="mobile" value="<%= model.mobile %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>年份：</label>
						<input type="text" name="year" value="<%= model.year %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>月份：</label>
						<input type="text" name="month" value="<%= model.month %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>业务金额：</label>
						<input type="text" name="amount" value="<%= model.amount %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>扣除税收：</label>
						<input type="text" name="tax" value="<%= model.tax %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>实际发放：</label>
						<input type="text" name="cash" value="<%= model.cash %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>变更原因：</label>
						<textarea class="form-control" name="reason"><%= model.reason %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="未核算" checked>&nbsp;&nbsp;未核算&nbsp;&nbsp;
							<input type="radio" name="status" value="已核算">&nbsp;&nbsp;已核算&nbsp;&nbsp;
						</div>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="提交" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>	
</div>