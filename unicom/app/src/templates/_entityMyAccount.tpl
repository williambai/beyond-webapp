<div>
	<div id="registerTemplate">
		<!-- <h1>注册</h1> -->
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default" id="registerForm">
						<div class="panel-heading">
							<h3 class="panel-title text-center">注册</h3>
						</div>
						<div class="panel-body">
							<div id="error"></div>
							<form>
							    <div class="form-group">
							    	<p style="color:red;">如果无法注册，请联系QQ群完成注册和认证！</p>
								</div>
								<div class="form-group">
									<label for="username">姓名：</label>
									<input type="text" name="username" value="<%= model.username %>" class="form-control input-sm" placeholder="英文字母或汉字"/>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>手机号码：</label>
									<div class="input-group">
										<div class="input-group-addon">+&nbsp;86</div>
										<input type="text" name="email" value="<%= model.email %>" class="form-control input-sm" placeholder="手机号码"/>
										<div class="input-group-addon">
											<span id="captcha">
												<a href="#" id="refreshCaptcha">获取验证码</a>
											</span>
										</div>
									</div>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>验证码：</label>
									<input type="text" name="captcha" class="form-control input-sm" placeholder="请输入手机验证码"/>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>密码：</label>
									<input type="password" name="password" value="<%= model.password %>" class="form-control input-sm" placeholder="数字、_或英文字母"/>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>密码（再来一次）：</label>
									<input type="password" name="cpassword" value="<%= model.cpassword %>" class="form-control input-sm" placeholder="请再次输入密码"/>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>渠道名称：</label>
									<input type="hidden" name="department[id]">
									<input type="hidden" name="department[city]">
									<input type="hidden" name="department[grid]">
									<input type="hidden" name="department[district]">
									<input type="text" name="department[name]" class="form-control input-sm" placeholder="请输入渠道名称，并在列表中选择。如果没有，则填入”其他“">
									<div id="departments"></div>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>渠道编码：</label>
									<input type="text" name="department[nickname]" class="form-control input-sm" disabled>
									<span class="help-block"></span>
								</div>
		                        <div class="form-group">
		                        	<a href="#" class="pull-right" id="login">已经有账号了，去登录！</a>
		                    	</div>
		                    	<br/>
		                    	<br/>
								<div class="form-group">
									<input type="submit" value="现在注册" class="btn btn-primary btn-block"/>
								</div>
							</form>					
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="text-center">
		    <hr>
		    <p>版权所有@2014~2016&nbsp;&nbsp;苏州普德邦网络技术有限公司&nbsp;&nbsp;技术支持QQ群：</p>
		    <p>支持IPhone、IPad、Android等移动终端。Windows、Mac等桌面系统，请使用&nbsp;Chrome&nbsp;谷歌最新浏览器访问<a href="https://www.baidu.com/s?wd=chrome浏览器官方下载" target="_blank">下载</a>
		</div>
	</div>
	<div id="registerSuccessTemplate">
		<p></p>
		<p></p>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title text-center">注册成功</h3>
						</div>
						<div class="panel-body">
							<p>恭喜您，注册成功!</p>
							<p>您还不能登录，请等待审核通过。</p>
							<p>或联系QQ群：</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<hr>
		<div class="text-center">
		    <p>版权所有@2014~2016&nbsp;&nbsp;苏州普德邦网络技术有限公司&nbsp;&nbsp;技术支持QQ群：</p>
		    <p>支持IPhone、IPad、Android等移动终端。Windows、Mac等桌面系统，请使用&nbsp;Chrome&nbsp;谷歌最新浏览器访问<a href="https://www.baidu.com/s?wd=chrome浏览器官方下载" target="_blank">下载</a>
		</div>		
	</div>
	<div id="channelSearchTemplate">
		<button class="btn btn-primary back">返回</button>
		<hr>
        <form role="form">
	        <div class="form-group">
	            <input type="text" name="search" class="form-control input-sm" placeholder="渠道名称">
	            <span class="help-block"></span>
	        </div>
        </form>
        <div id="list">渠道列表，请选择一个</div>
	</div>
	<div id="loginTemplate">
		<p></p>
		<p></p>
		<div class="">
		    <div class="">
		        <div class="">
		            <div class="panel panel-default" id="loginForm">
		                <div class="panel-heading">
		                    <h3 class="panel-title text-center">登&nbsp;&nbsp;录</h3>
		                </div>
		                <div class="panel-body">
		                    <div id="error"></div>
		                    <form role="form">
		                        <div class="form-group">
		                            <input type="text" name="email" class="form-control input-sm" placeholder="手机号码/邮件地址">
		                            <span class="help-block"></span>
		                        </div>

		                        <div class="form-group">
		                            <input type="password" name="password" class="form-control input-sm" placeholder="密码">
		                            <span class="help-block"></span>
		                        </div>

		                        <div class="form-group">
		                        	<div class="pull-right">
			                        	<p><a href="#"  id="register">还没有账号，去注册吧！</a></p>
			                        	<p><a href="#" id="forgot">忘记密码？</a></p>
			                        </div>
			                        <div>
									<% if(!/MicroMessenger/.test(navigator.userAgent)){ %>
										<p>
											<a href="#" id="wechatLogin" style="color:red;">微信登录</a>
										</p>		
									<% } %>
			                        </div>
		                    	</div>
								<br/>
		                        <br/>
		                        <input type="submit" value="登&nbsp;&nbsp;录" class="btn btn-primary btn-block">
		                    </form>
		                </div>
		            </div>
		        </div>
		    </div>
		</div>

		<div class="text-center">
		    <hr>
		    <p>版权所有@2014~2016&nbsp;&nbsp;苏州普德邦网络技术有限公司&nbsp;&nbsp;技术支持QQ群：</p>
		    <p>支持IPhone、IPad、Android等移动终端。Windows、Mac等桌面系统，请使用&nbsp;Chrome&nbsp;谷歌最新浏览器访问<a href="https://www.baidu.com/s?wd=chrome浏览器官方下载" target="_blank">下载</a>
		</div>
	</div>
	<div id="forgotPasswordTemplate">
		<div class="">
			<div class="">
				<div class="">
				<div class="panel panel-default" id="forgotPasswordForm">
					<div class="panel-heading">
		                    <h3 class="panel-title text-center">找回密码</h3>
					</div>
					<div class="panel-body">
						<div id="error"></div>
						<form role="form">
							<div class="form-group" id="email">
								<label for="email">您的手机号码/邮件地址：</label>
								<input type="text" name="email" class="form-control" placeholder="手机号码/邮件地址">
								<span class="help-block"></span>
							</div>
		                        <div class="form-group">
		                        	<a href="#" class="pull-right" id="login">换个账号，去登录！</a>
		                    	</div>
		                    	<br>
							<div class="form-group">
								<input type="submit" value="重置密码" class="btn btn-primary btn-block">
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		</div>
		<div class="text-center">
		    <hr>
		    <p>版权所有@2014~2016&nbsp;&nbsp;苏州普德邦网络技术有限公司&nbsp;&nbsp;技术支持QQ群：</p>
		    <p>支持IPhone、IPad、Android等移动终端。Windows、Mac等桌面系统，请使用&nbsp;Chrome&nbsp;谷歌最新浏览器访问<a href="https://www.baidu.com/s?wd=chrome浏览器官方下载" target="_blank">下载</a>
		</div>
	</div>
	<div id="forgotPasswordSuccessTemplate">
		<p></p>
		<p></p>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title text-center">短信/邮件发送成功</h3>
						</div>
						<div class="panel-body">
							<p>请检查短信/邮箱，按提示重置密码。</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>

		<div class="text-center">
		    <hr>
		    <p>版权所有@2014~2016&nbsp;&nbsp;苏州普德邦网络技术有限公司&nbsp;&nbsp;技术支持QQ群：</p>
		    <p>支持IPhone、IPad、Android等移动终端。Windows、Mac等桌面系统，请使用&nbsp;Chrome&nbsp;谷歌最新浏览器访问<a href="https://www.baidu.com/s?wd=chrome浏览器官方下载" target="_blank">下载</a>
		</div>
	</div>
	<div id="editTemplate">
		<input type="file" class="hidden">
		<a id="send-file">
			<div class="form-group">
				<img id="avatar" src="/images/avatar.jpg" width="120px" height="160px">
				<br/>更换头像
			</div>
		</a>

		<div id="accountForm">
			<form>
				<div class="form-group">
					<label for="username">姓名：</label>
					<input type="text" name="username" value="<%= model.username %>" class="form-control">
					<span class="help-block"></span>
				</div>
				<div class="form-group">
					<label for="email">电子邮件：</label>
					<input type="text" name="email" value="<%= model.email %>" class="form-control" readonly>
					<span class="help-block"></span>
				</div>
				<div class="form-group">
					<label for="password">密码：</label>
					<input type="password" name="password" class="form-control"/>
					<span class="help-block"></span>
				</div>
				<div class="form-group">
					<label for="password">密码(再次)：</label>
					<input type="password" name="cpassword" class="form-control"/>
					<span class="help-block"></span>
				</div>
				<div class="form-group">
					<label for="biography">自传：</label>
					<textarea name="biography" rows="3" class="form-control"><%= model.biography %></textarea>
					<span class="help-block"></span>
				</div>
				<div class="form-group">
					<input type="submit" class="btn btn-block btn-primary"/>
				</div>
			</form>
		</div>
	</div>
	<div id="viewTemplate">
		<% if(model.me){ %>
		<div class="editor-layer">
			<a class="btn btn-primary pull-right editor-control" href="#profile/edit/me">编辑</a>
			<p>&nbsp;</p>
		</div>
		<% } %>
		<hr>

		<div class="media">
			<div class="pull-left">
				<img id="avatar" class="media-object" src="/images/avatar.jpg" width="120px" height="160px">
			</div>
			<div class="media-body">
				<h2 class="media-heading"><%= model.username %></h2>
				<h4><%= model.email %></h4>
			</div>
		</div>
		<p class="clearfix"></p>
		<hr>
		<h2>我的自传</h2>
		<%if(model.biography && model.biography.length > 0){ %>
			<p><%= model.biography %></p>
		<%}else{ %>
			<p class="small">比较懒，没写自我介绍</p>
		<% } %>

		<% if(model.me){ %>
		<hr/>
		<h4>微信绑定</h4>
		<div id="wechat"></div>
		<hr>
		<div class="button-layer">
			<a href="#" class="btn btn-block btn-danger logout">退出</a>
		</div>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<% } %>
	</div>

	<div id="login2Template">
		<p></p>
		<p></p>
		<div class="">
		    <div class="">
		        <div class="">
		            <div class="panel panel-default" id="loginForm">
		                <div class="panel-heading">
		                    <h3 class="panel-title text-center">登&nbsp;&nbsp;录</h3>
		                </div>
		                <div class="panel-body">
		                    <div id="error"></div>
		                    <form role="form">
		                        <div class="form-group" id="email">
		                            <input type="text" name="email" class="form-control input-sm" placeholder="手机号码/邮件地址">
		                            <span class="help-block"></span>
		                        </div>

		                        <div class="form-group" id="password">
		                            <input type="password" name="password" class="form-control input-sm" placeholder="密码">
		                            <span class="help-block"></span>
		                        </div>

	                            <div class="form-group">
	                            	<a href="#" id="wechatLogin" style="color:red;">已经绑定微信，使用微信快捷登录</a>
	                        	</div>

		                        <br>
		                        <input type="submit" value="登&nbsp;&nbsp;录" class="btn btn-primary btn-block">
		                    </form>
		                </div>
		            </div>
		        </div>
		    </div>
		</div>
		<p>&nbsp;</p>

		<div class="text-center">
		    <hr>
		    <p>版权所有@2014~2016&nbsp;&nbsp;苏州普德邦网络技术有限公司&nbsp;&nbsp;技术支持QQ群：</p>
		    <p>支持IPhone、IPad、Android等移动终端。Windows、Mac等桌面系统，请使用&nbsp;Chrome&nbsp;谷歌最新浏览器访问<a href="https://www.baidu.com/s?wd=chrome浏览器官方下载" target="_blank">下载</a>
		</div>
	</div>	
	<div id="wechatLoginTemplate">
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title text-center">微信登录</h3>
		</div>
		<div class="panel-body">
			<p class="text-center">如果您还没有绑定微信账号，请登录后，在“个人资料”中绑定。</p>
			<div id="wechat"></div>
		</div>
		<button class="btn btn-primary btn-block back">返回</button>
	</div>
	</div>
	<div id="wechatSuccessTemplate">
	</div>
</div>