<div class="navbar navbar-app navbar-absolute-bottom">
	<form>
		<div class="nav4">
			<div class="nav4-left">
				<a href="#" class="chat-toggle">
					<i class="fa fa-list-ul fa-2x" style="vertical-align:middle;"></i>
				</a>
			</div>
			<div class="nav4-right btn-group">		
				<button class="btn btn-primary">发送</button>
				<button class="btn btn-promary send-file"><i class="fa fa-lg fa-plus-circle"></i></button>
			</div>
	<% if(project.closed){ %>
			<div class="nav4-input-both">
				<div class="form-group">
					<input type="text" name="chat" class="form-control" placeholder="项目已关闭，停止发言" disabled>
				</div>
			</div>
	<% }else{ %>
			<div class="nav4-input-both">
				<div class="form-group">
					<input type="text" name="chat" class="form-control">
				</div>
			</div>
	<% } %>	
		</div>
	</form>
	<input class="hidden" type="file" name="file">
</div>