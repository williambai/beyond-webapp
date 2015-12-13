<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">媒体管理</h4>
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
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="媒体编码或媒体名称">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control">
					<option>全部</option>
					<option value="image">图片</option>
					<option value="video">视频</option>
					<option value="other">其他</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="media">
				<div class="media-left">
					<img class="media-object" src="" width="50px" height="50px" style="max-width:50px;">
				</div>
				<div class="media-body">
					<div class="pull-right" id="<%= model._id %>">
						<button class="btn btn-success edit">编辑</button>
						<button class="btn btn-danger delete">删除</button>
					</div>
					<h4><%= model.nickname %>(<%= model.name %>)</h4>
					<p><%= model.originalname %></p>
				</div>
			</div>
			<hr/>
		</div>
	</div>
	<div id="addTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">新增媒体</h4>
			</div>
			<div class="panel-body">
				<div class="form-group">
					<input class="hidden" type="file" name="file">
					<div class="attachments">
						<button class="btn btn-promary send-file"> <i class="fa fa-5x fa-plus-circle"></i>
						</button>
					</div>
				</div>		
				<form id="customerForm">
					<div class="form-group">
						<label>媒体源名称：</label>
						<input type="text" name="originalname" value="<%= model.originalname %>" class="form-control" readonly>
						<div id="goods"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体新名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体编码：</label>
						<input type="text" name="nickname" value="<%= model.name %>" class="form-control" placeholder="仅接受数字、_或字母组合">
						<span class="help-block">帮助快速检索</span>
					</div>
					<div class="form-group">
						<label>媒体描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体MIME：</label>
						<input type="text" name="mimetype" value="<%= model.mimetype %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体大小：</label>
						<input type="text" name="size" value="<%= model.size %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体扩展名：</label>
						<input type="text" name="extension" value="<%= model.extension %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体url：</label>
						<input type="text" name="url" value="<%= model.url %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>目标url：</label>
						<input type="text" name="target_url" value="<%= model.target_url %>" class="form-control">
						<span class="help-block">点击媒体跳转，为空不跳转。</span>
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
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改媒体</h4>
			</div>
			<div class="panel-body">
				<div class="form-group">
					<img src="" width="200px" height="200px">
				</div>
				<form id="customerForm">
					<div class="form-group">
						<label>媒体源名称：</label>
						<input type="text" name="originalname" value="<%= model.originalname %>" class="form-control" readonly>
						<div id="goods"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体新名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体编码：</label>
						<input type="text" name="nickname" value="<%= model.nickname %>" class="form-control" placeholder="仅接受数字、_或字母组合">
						<span class="help-block">帮助快速检索</span>
					</div>
					<div class="form-group">
						<label>媒体描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体MIME：</label>
						<input type="text" name="mimetype" value="<%= model.mimetype %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体大小：</label>
						<input type="text" name="size" value="<%= model.size %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体扩展名：</label>
						<input type="text" name="extension" value="<%= model.extension %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>媒体url：</label>
						<input type="text" name="url" value="<%= model.url %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>目标url：</label>
						<input type="text" name="target_url" value="<%= model.target_url %>" class="form-control">
						<span class="help-block">点击媒体跳转，为空不跳转。</span>
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