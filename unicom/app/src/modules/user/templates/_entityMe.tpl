<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">个人中心</h5>
			</div>
			<div class="panel-body">
				<div class="row">
					<div class="col-xs-6" id="bonus">
						<div class="text-center">
							<img src="/images/bonus.png" width="80px" height="80px">
							<h4>我的佣金</h4>
							<p>&nbsp;</p>
						</div>
					</div>
					<div class="col-xs-6" id="bank">
						<div class="text-center">
							<img src="/images/bank.png" width="80px" height="80px">
							<h4>我的银行卡</h4>
							<p>&nbsp;</p>
						</div>
					</div>
					<div class="col-xs-6" id="changepass">
						<div class="text-center">
							<img src="/images/changepass.png" width="80px" height="80px">
							<h4>修改密码</h4>
							<p>&nbsp;</p>
						</div>
					</div>
					<div class="col-xs-6" id="sale">
						<div class="text-center">
							<img src="/images/faq.png" width="80px" height="80px">
							<h4>销售记录</h4>
							<p>&nbsp;</p>
						</div>
					</div>
					<div class="col-xs-6" id="person_rank">
						<div class="text-center">
							<img src="/images/person_rank.png" width="80px" height="80px">
							<h4>个人排行</h4>
							<p>&nbsp;</p>
						</div>
					</div>
					<div class="col-xs-6" id="group_rank">
						<div class="text-center">
							<img src="/images/group_rank.png" width="80px" height="80px">
							<h4>团队排行</h4>
							<p>&nbsp;</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="accountTemplate">
		<div>
			<div>
				<div class="nav-back">
					<button class="btn btn-primary pull-left back"><i class="fa fa-reply">&nbsp;</i>返回</button>
					<h4 class="text-center">修改密码</h4>
				</div>
				<p>&nbsp;</p>
				<form id="accountForm">
					<div class="form-group">
						<label for="email">原密码：</label>
						<input type="text" name="old_password" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="password">新密码：</label>
						<input type="password" name="password" class="form-control"/>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="password">新密码(再次)：</label>
						<input type="password" name="cpassword" class="form-control"/>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-success back">取消</button>
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="bankTemplate">
		<div>
			<div>
				<div class="nav-back">
					<button class="btn btn-primary pull-left back"><i class="fa fa-reply">&nbsp;</i>返回</button>
					<h4 class="text-center">修改银行卡</h4>
				</div>
				<p>&nbsp;</p>
				<form id="accountForm">
					<div class="form-group">
						<label for="bank_name">发卡银行</label>
						<input type="text" name="bank_name" value="<%= model.bank_name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="account_name">户名：</label>
						<input type="text" name="account_name" value="<%= model.account_name %>" class="form-control"/>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="account_no">卡号：</label>
						<input type="text" name="account_no" value="<%= model.account_no %>" class="form-control"/>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="account_name">身份证号码：</label>
						<input type="text" name="account_card_id" value="<%= model.account_card_id %>" class="form-control"/>
						<span class="help-block"></span>
					</div>
					<p></p>
					<p>请确保您绑定的银行卡信息准确无误，以便能够正常收到wo助手发放的佣金。</p>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-success back">取消</button>
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="bonusListTemplate">
		<div>
			<div class="nav-back">
				<button class="btn btn-primary pull-left back"><i class="fa fa-reply">&nbsp;</i>返回</button>
				<h4 class="text-center">每月佣金收入</h4>
			</div>
			<p>&nbsp;</p>
			<div id="list">
			</div>
		</div>
	</div>
	<div id="bonusItemTemplate">
		<div>
			<div class="item" id="<%= model._id %>">
				按笔显示
			</div>
		</div>
	</div>
	<div id="bonusOrderListTemplate">
		<div>
			<div class="nav-back">
				<button class="btn btn-primary pull-left back"><i class="fa fa-reply">&nbsp;</i>返回</button>
				<h4 class="text-center">佣金收入明细</h4>
			</div>
			<p>&nbsp;</p>
			<p><%= model.name %></p>
			<div id="list">
			</div>
		</div>
	</div>
	<div id="bonusOrderItemTemplate">
		<div>
			<div class="item" id="<%= model._id %>">
				订单项
			</div>
		</div>
	</div>
</div>