<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">模板管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="模板名称或文件名">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;&nbsp;模板类型&nbsp;&nbsp;</label>
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
		<div class="item" id="<%= model.name %>">
			<% if(/jade$/.test(model.name)){ %>
			<div class="media">
				<div class="media-left">
					<img class="media-object" src="images/file.png" width="50px" height="50px" style="max-width:50px;">
				</div>
				<div class="media-body">
					<div class="pull-right" id="<%= model.name %>">
						<!-- <button class="btn btn-success view">模板</button> -->
						<button class="btn btn-success edit">编辑</button>
						<button class="btn btn-danger delete">删除</button>
					</div>
					<a href="page/dynamic/<%= model.name.slice(0,-5) %>/preview" target="_blank"><h4><%= model.name %></h4></a>
					<p><%= model.description %></p>
				</div>
			</div>
			<% }else{ %>
			<div class="media">
				<div class="media-left">
					<img class="media-object" src="images/folder.png" width="50px" height="50px" style="max-width:50px;">
				</div>
				<div class="media-body">
					<div class="pull-right" id="<%= model.name %>">
						<button class="btn btn-success edit">打开</button>
						<button class="btn btn-danger delete">删除</button>
					</div>
					<a href="page/dynamic/<%= model.name.slice(0,-5) %>/preview" target="_blank"><h4><%= model.name %></h4></a>
					<p><%= model.description %></p>
				</div>
			</div>
			<% } %>
			<hr/>
		</div>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改模板文件</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>文件名：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" placeholder="模板文件名，后缀为.jade">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>模板分类：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="category" value="page">&nbsp;&nbsp;页面
							<input type="radio" name="category" value="include">&nbsp;&nbsp;局部页面
							<input type="radio" name="category" value="layout">&nbsp;&nbsp;布局
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>模板内容：</label>
						<textarea name="content" class="form-control" rows="10"><%= model.content %></textarea>
						<span class="help-block"></span>
					</div>
<!-- 					<div class="form-group">
						<label>数据模型：</label>
						<div id="models"></div>
						<span class="help-block"></span>
					</div>
 -->
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
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">模板文件</h4>
			</div>
			<div class="panel-body">
				<div id="template"></div>
				<div class="form-group">
					<div class="btn-group btn-group-justified">
						<div class="btn-group">
							<button class="btn btn-success download">下载模板文件</button>
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">返回</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">更新模板文件</h4>
			</div>
			<div class="panel-body">
				<p>请点击<i class="fa fa-plus-circle"></i>选择要上传的文件，点击已上传的文件，可以取消上传。</p>
				<p>友情提示：为保证导入效率，每次最好仅选择导入一个文件。</p>
				<form>
					<input type="hidden" name="type" value="import">
					<div class="form-group">
						<span class="attachments"></span>
						<span>
							<button class="btn btn-promary send-file"> <i class="fa fa-5x fa-plus-circle"></i>
							</button>
						</span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="更新模板文件" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				<input class="hidden" type="file" name="file"/>
				</form>
			</div>
		</div>
	</div>	
</div>