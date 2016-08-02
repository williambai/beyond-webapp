<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">网页管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="网页名称或文件名">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;&nbsp;网页类型&nbsp;&nbsp;</label>
				<select class="form-control" name="mimetype">
					<option value="">图片</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div class="item"  id="<%= model.name %>">
			<div class="media">
				<div class="media-left">
					<img class="media-object" src="images/html.jpg" width="50px" height="50px" style="max-width:50px;">
				</div>
				<div class="media-body">
					<div class="pull-right">
						<button class="btn btn-success edit">编辑</button>
						<button class="btn btn-danger delete">删除</button>
					</div>
					<a href="statics/<%= model.name %>" target="_blank"><h4><%= model.name %></h4></a>
				</div>
			</div>
			<hr/>
		</div>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改网页文件</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>文件名：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>网页源码内容：</label>
						<textarea name="content" class="form-control" rows="20" placeholder="请贴入网页内容"><%= model.content %></textarea>
						<span class="help-block"></span>
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