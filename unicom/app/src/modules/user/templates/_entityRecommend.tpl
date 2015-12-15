<div>
	<div id="addTemplate">
		<div class="panel panel-primary">
			<div class="panel-heading">
				<button class="btn btn-success pull-right addItem">添加</button>
				<h5 class="panel-title text-center">推荐给客户</h5>
			</div>
			<div class="panel-body">
				<form>
					<div class="form-group">
						<label></label>
						<input name="mobile[]" class="form-control" placeholder="手机号码">
					</div>
					<div class="form-group">
						<label></label>
						<input name="mobile[]" class="form-control" placeholder="手机号码">
					</div>
					<div class="form-group">
						<label></label>
						<input name="mobile[]" class="form-control" placeholder="手机号码">
					</div>
					<div id="insertItemBefore"></div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定订购" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary cancel">取消</button>
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="successTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐成功</h5>
			</div>
			<div class="panel-body">
				<p>恭喜你，推荐成功！</p>
				<button class="btn btn-primary btn-block back">返回</button>
			</div>
		</div>
	</div>
	<div id="failTemplate">
		<p>推荐失败页面，查看</p>
		<div>
		</div>
	</div>
</div>