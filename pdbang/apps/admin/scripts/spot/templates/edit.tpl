<div class="panel panel-default">
	<div class="panel-body">
		<form class="form-horizontal" role="form">
			<div class="form-group">
				<label class="col-sm-2 control-label">景点名称</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="name" value="<%= model.name %>">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">景点首字母(小写)</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="first" value="<%= model.first %>">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">景点描述</label>
				<div class="col-sm-10">
					<textarea class="form-control" type="text" name=""></textarea>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">景点地址</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">所在城市</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">所在省份</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">所在国家</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">邮政编码</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">经度</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">纬度</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">星级</label>
				<div class="col-sm-10">
					<input class="form-control" type="text" name="" value="0">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label"></label>
				<div class="col-sm-10">
					<button class="col-sm-6 btn btn-danger" name="">提交</button>
					<button class="col-sm-6 btn btn-success" name="">取消</button>
				</div>
			</div>
		</form>
	</div>
</div>