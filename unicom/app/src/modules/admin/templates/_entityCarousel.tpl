<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">轮播管理</h4>
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
		<div>
			<div class="item" id="<%= model._id %>"> 
				<div class="media">
					<div class="media-left">
						<a href="<%= model.img_url %>" target="_blank">
							<img class="media-object" src="images/html.jpg" width="50px" height="50px" style="max-width:50px;">
						</a>
					</div>
					<div class="media-body">
						<div class="pull-right">
							<button class="btn btn-success edit">编辑</button>
							<button class="btn btn-danger delete">删除</button>
						</div>
						<a href="<%= model.target_url %>" target="_blank"><h4><%= model.name %></h4></a>
						<p><%= model.description %></p>
						<p>出现顺序：<%= model.display_sort %></p>
					</div>
				</div>
				<hr/>
			</div>
		</div>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改轮播文件</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>标题：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>轮播图片地址：</label>
						<input type="text" name="img_url" value="<%= model.img_url %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>跳转链接地址：</label>
						<input type="text" name="target_url" value="<%= model.target_url %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>轮播出现顺序：</label>
						<input type="text" name="display_sort" value="<%= model.display_sort %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效&nbsp;&nbsp;
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效
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