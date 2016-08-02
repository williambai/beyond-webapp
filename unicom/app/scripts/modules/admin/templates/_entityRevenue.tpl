<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">金币管理</h4>
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
		<form id="searchForm">
			<div  class="form-inline">
				<div class="form-group">
					<label>&nbsp;开始时间：&nbsp;</label>
					<input type="date" name="starttime" class="form-control">&nbsp;&nbsp;
				</div>
				<div class="form-group">
					<label>&nbsp;结束时间：&nbsp;</label>
					<input type="date" name="endtime" class="form-control">&nbsp;&nbsp;
				</div>
			</div>
			<div class="form-inline">
				<div class="form-group">
					<label>&nbsp;搜索：&nbsp;</label>
					<input type="text" name="searchStr" class="form-control" placeholder="客户号码">&nbsp;&nbsp;
				</div>
				<div class="form-group">
					<label>业务类型：</label>
					<select class="form-control" name="category">
						<option>全部</option>
					</select>&nbsp;&nbsp;
				</div>
				<div class="form-group">
					<select class="form-control" name="status">
						<option>全部</option>
						<option>冻结</option>
						<option>一次解冻</option>
						<option>二次解冻</option>
						<option>三次解冻</option>
						<option>全部解冻</option>
					</select>&nbsp;&nbsp;
				</div>
				<div class="form-group">
					<input type="submit" value="查询" class="btn btn-info btn-block">
				</div>
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">编辑</button>
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4><%= model.mobile %>&nbsp;&nbsp;<%= model.username %></h4>
		<p>业务类型：<%= model.category %>&nbsp;&nbsp;收益：<%= model.income %>&nbsp;&nbsp;已兑现：<%= model.cash %></p>
		<p><%= model.cashStatus %></p>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center" id="panel-title">编辑金币</h5>
			</div>
			<div class="panel-body">
				<form id="revenueForm">
					<div class="form-group">
						<label>手机号码：</label>
						<input class="form-control" type="text" name="mobile" value="<%= model.mobile %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>姓名：</label>
						<input class="form-control" type="text" name="username" value="<%= model.username %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>收益类型：</label>
						<input class="form-control" type="text" name="category" value="<%= model.category %>" placeholder="流量业务、增值业务、号卡业务、终端业务或金币调整等" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>收益：</label>
						<input class="form-control" type="text" name="income" value="<%= model.income %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>兑现：
							<input type="radio" name="cashStatus" value="冻结" checked>&nbsp;&nbsp;冻结&nbsp;&nbsp;
							<input type="radio" name="cashStatus" value="一次解冻">&nbsp;&nbsp;一次解冻&nbsp;&nbsp;
							<input type="radio" name="cashStatus" value="二次解冻">&nbsp;&nbsp;二次解冻&nbsp;&nbsp;
							<input type="radio" name="cashStatus" value="三次解冻">&nbsp;&nbsp;三次解冻&nbsp;&nbsp;
							<input type="radio" name="cashStatus" value="全部解冻">&nbsp;&nbsp;全部解冻&nbsp;&nbsp;
						</label>
						<div style="padding-left:30px;">
							
						</div>
						<input class="form-control" type="text" name="cash" value="<%= model.cash %>">
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
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效&nbsp;&nbsp;
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效&nbsp;&nbsp;
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
				<hr>
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5 class="panel-title text-center">变更历史</h5>
					</div>
					<div class="panel-body">
						<div id="history"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>