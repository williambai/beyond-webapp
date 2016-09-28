<div class="pannel panel-default">
	<div class="pannel-body">
		<form role="form">
			<div class="form-group">
				<div class="input-group">
					<input class="form-control" type="text" name="spot_name" placeholder="城市中文名或拼音">
					<div class="input-group-addon">
						<a style="color:red;" href="#">取消</a>
					</div>
				</div>
			</div>
		</form>
		<ul class="list-group" id="list">
			<p style="color:blue;">当前城市</p>
			<li class="list-group-item" id="<%= currentCity %>">
				<h5 lass="media-heading"><%= currentCity %></h5>
			</li>
			<p style="color:blue;">城市列表</p>
			<!-- 城市列表 -->
 		</ul>
	</div>
</div>