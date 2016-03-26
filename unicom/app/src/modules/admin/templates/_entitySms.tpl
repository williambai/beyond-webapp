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
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
	 		<div class="pull-right">
				<button class="btn btn-success edit">编辑</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4><%= model.receiver %></h4>
			<p>发送者：<%= model.sender %>&nbsp;&nbsp;状态：<%= model.status %></p>
			<p>SMS内容：<%= model.content.slice(0,40) %></p>
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
						<input type="text" name="sender" value="<%= model.sender %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="receiver">接收方：</label>
						<input type="text" name="receiver" value="<%= model.receiver %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="content">SMS内容：</label>
						<textarea name="content" class="form-control"><%= model.content %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="新建" checked>&nbsp;&nbsp;新建&nbsp;&nbsp;
							<input type="radio" name="status" value="已发送">&nbsp;&nbsp;已发送&nbsp;&nbsp;
							<input type="radio" name="status" value="已确认">&nbsp;&nbsp;已确认&nbsp;&nbsp;
							<input type="radio" name="status" value="已订购">&nbsp;&nbsp;已订购&nbsp;&nbsp;
							<input type="radio" name="status" value="已取消">&nbsp;&nbsp;已取消&nbsp;&nbsp;
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