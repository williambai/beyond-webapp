<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">银行卡信息审核</h4>
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
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="手机号码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="item"  id="<%= model._id %>">
				<div class="pull-right">
				<% if(model.status == '新建'){ %>
					<button class="btn btn-danger pass">通过</button>
					<button class="btn btn-primary fail">放弃</button>
				<% } %>
					<button class="btn btn-success edit">详情</button>
				</div>
				<h4><%= model.accountName %></h4>
				<p><%= model.bankName %></p>
				<p><i class="fa fa-user"></i>&nbsp;<%= model.mobile %>&nbsp;<span style="color:red;"><%= model.status %></span></p>
			</div>
			<hr/>
		</div>
	</div>
	<div id="editTemplate">
		<form>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">银行卡</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>邮箱/手机号码：</label>
						<input type="text" class="form-control" value="<%= model.mobile %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>开户银行：</label>
						<input type="text" class="form-control" value="<%= model.bankName %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>账户姓名：</label>
						<input type="text" class="form-control" value="<%= model.accountName %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>账号：</label>
							<input type="text" value="<%= model.accountNo %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>账户有效期：</label>
						<input type="text" class="form-control" value="<%= model.expired %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>开户行地址：</label>
						<input type="text" class="form-control" value="<%= model.bankAddr %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>身份证号码：</label>
						<input type="text" class="form-control" value="<%= model.cardId %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
 							<div class="btn-group">
								<button class="btn btn-primary back">返回</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>