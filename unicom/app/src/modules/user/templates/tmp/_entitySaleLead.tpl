<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">销售线索管理</h4>
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
				<button class="btn btn-success edit">详情</button>
				<!-- <button class="btn btn-danger delete">删除</button> -->
			</div>
			<div>
				<h4><%= model.customer && model.customer.phone %>&nbsp;&nbsp;<span class="bg-success"><%= model.customer && model.customer.name %></span></h4>
				<p><%= model.product && model.product.name %></p>
				<p><i class="fa fa-clock-o"></i>&nbsp;<%= model.deltatime %>&nbsp;<i class="fa fa-flag"></i>&nbsp;<%= model.status %></p>
			</div>
		</div>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改销售线索</h4>
			</div>
			<div class="panel-body">
				<form id="accountForm">
					<div class="form-group">
						<label for="name">产品名称：</label>
						<input type="text" name="product[name]" value="<%= model.product && model.product.name %>" class="form-control" disabled>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="description">产品描述：</label>
						<textarea name="product[description]" class="form-control" disabled><%= model.product && model.product.description %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="quantity">订购数量：</label>
						<input type="text" name="product[quantity]" value="<%= model.product && model.product.quantity %>" class="form-control" disabled>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="name">客户姓名：</label>
						<input type="text" name="customer[name]" value="<%= model.customer && model.customer.name %>" class="form-control" disabled>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="phone">电话号码：<a href="tel:<%= model.customer && model.customer.phone %>" class="btn btn-danger">拨打电话</a></label>
						<input type="text" name="customer[phone]" value="<%= model.customer && model.customer.phone %>" class="form-control" disabled>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="attach">客户留言：</label>
						<textarea name="customer[attach]" class="form-control" disabled><%= model.customer && model.customer.attach %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="未处理" checked>&nbsp;&nbsp;未处理&nbsp;&nbsp;
							<input type="radio" name="status" value="废弃">&nbsp;&nbsp;废弃&nbsp;&nbsp;
							<input type="radio" name="status" value="成功">&nbsp;&nbsp;成功&nbsp;&nbsp;
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