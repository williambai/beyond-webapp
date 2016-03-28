<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">SMS管理</h4>
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
				<label>搜索：</label>
				<input type="text" name="searchStr" class="form-control" placeholder="11位手机号码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
	 		<div class="pull-right">
				<button class="btn btn-success edit">编辑</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4>发送者：<%= model.sender %>&nbsp;&nbsp;<%= model.status %></h4>
			<p>接收者：<%= model.receiver && model.receiver.slice(0,40) %></p>
			<p>SMS内容：<%= model.content && model.content.slice(0,40) %></p>
			<p><i class="fa fa-clock-o"></i>&nbsp;<%= model.deltatime %>&nbsp;&nbsp;<i class="fa fa-calendar"></i>&nbsp;<%= new Date(model.lastupdatetime).toLocaleString() %></p>
		</div>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改SMS</h4>
			</div>
			<div class="panel-body">
				<form id="accountForm">
					<div class="form-group">
						<label>发送方：</label>
						<input type="text" name="sender" value="<%= model.sender %>" class="form-control" placeholder="10655836+业务代码" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="receiver">接收方：</label>
						<textarea name="receiver" class="form-control" placeholder="11位的手机号码。如果是多个，请用;分隔" readonly><%= model.receiver %></textarea> 
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="content">SMS内容：</label>
						<textarea name="content" class="form-control" readonly><%= model.content %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="新建" checked>&nbsp;&nbsp;新建&nbsp;&nbsp;
							<input type="radio" name="status" value="已发送">&nbsp;&nbsp;已发送&nbsp;&nbsp;
							<input type="radio" name="status" value="已确认">&nbsp;&nbsp;已确认&nbsp;&nbsp;
							<input type="radio" name="status" value="已处理">&nbsp;&nbsp;已处理&nbsp;&nbsp;
							<input type="radio" name="status" value="失败">&nbsp;&nbsp;失败&nbsp;&nbsp;
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