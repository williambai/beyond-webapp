<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">用户反馈</h4>
			</div>
			<div class="panel-body">
				<div id="search"></div>
				<div id="list"></div>
			</div>
		</div>
	</div>
	<div id="searchTemplate"></div>
	<div id="itemTemplate">
		<div>
			<div class="media" id="<%= model._id %>">
				<div class="pull-left">
					<a href="#profile/<%= model.uid %>
						">
						<img class="media-object avatar" src="" width="64px;" height="64px;"></a>
				</div>
<!-- 				<div class="pull-right">
					<button class="btn btn-primary delete">删除</button>
				</div>
 -->				<div class="media-body">
					<h4 class="media-heading">
						<a href="#space/<%= model.uid %>
							">
							<%= model.username %></a>
					</h4>
					<%= model.content %>
					<div>
						<div class="pull-right">
							<!-- <a class="good"> <i class="fa fa-heart-o"></i>
								&nbsp;点赞
							</a>&nbsp;&nbsp;&nbsp;&nbsp; -->
							<a class="comment-toggle"> <i class="fa fa-pencil-square-o"></i>
								&nbsp;回复
							</a>
						</div>
						<p><%= model.deltatime %>更新</p>
					</div>
					<div class="comment-editor"></div>
					<div class="comments"></div>
				</div>
				<div class="media-right"></div>
			</div>
			<hr/>
		</div>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">新增反馈</h4>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="type" value="mixed">
					<div class="form-group">
						<textarea class="form-control" name="content[body]" rows="3" placeholder="反馈问题。。。"></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<span class="attachments"></span>
						<span>
							<button class="btn btn-promary send-file">
								<i class="fa fa-5x fa-plus-circle"></i>
							</button>
						</span>
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
					<hr/>
				</form>
				<input class="hidden" type="file" name="file"/>
			</div>
		</div>
	</div>
	<div id="commentTemplate">
		<form>
			<div class="row">
				<div class="col-lg-12">
					<textarea class="form-control" name="comment" rows="3"></textarea>
					<br>
					<input type="submit" value="回复" class="btn btn-block btn-primary" placeholder=""/>
				</div>

			</div>
		</form>
	</div>
</div>