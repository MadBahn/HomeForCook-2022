<template>
	
	<view >
		<view class="all">
			<!-- <u-field
				class="ipt"
				v-model="acc"
				label="账号"
				placeholder="请填写账号"
				@blur="acc = $event.target.value"
			>
			</u-field>
			<u-field
			
				v-model="psd"
				label="密码"
				password=true
				clearable=true
				placeholder="请填写密码"
				border-bottom=true
				@blur="psd = $event.target.value"
			>
			</u-field> -->
			<img class="logo" src="../../static/logo.png" alt="">
			<input v-model="acc" class="ipt" type="text" name="acc" placeholder="请输入账号">

			<input v-model="psd" class="ipt" type="password" name="psd" placeholder="请输入密码" show-password>

			
			
			
			<button class="login" @click="login">登陆</button>
			<button class="zhuce" @click="zhuce">还没有账号！点击注册</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				acc: '',
				psd: ''
			}
		},
		onLoad(option){
			let self = this
			if(option.acc){
				self.acc = option.acc
			}
		},
		methods: {
			zhuce() {
				uni.navigateTo({
					url: '../../pages/login/zhuce'
				})	
			},
			login() {
				let _self = this
				if (_self.acc && _self.psd) {
					uni.request({
						url: 'http://localhost:3000/api/user/login',
						method: 'POST',
						data: {
							"auth_name":_self.acc.toString(),
							"password":_self.psd.toString(),
						},
						async success(res) {
							console.log(res.data);
							if(res.data.errCode === "LOGIN-100"){
								uni.showToast({
									title: "用户名或密码错误",
									icon: 'error'
								});
							}
							else{
								await uni.setStorage({
									key: 'user',
									data: res.data.data,
									success: function () {
										console.log(res.data.data)
										console.log('登陆成功');
									}
								});
								uni.switchTab({
									url: '/pages/my/my'
								});
								uni.showToast({
								  title: '登陆成功！',
								  icon: 'success'
								});
							}
						}
					});				
				} else {
					uni.showToast({
					  title: '请输入账号！',
					  icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.logo{
		width: 100vw;
		height: 50vw;	
		/* background-color: red; */
	}
	.ipt{
		margin-left: 10%;
		margin-bottom: 10px;
		padding-left: 15px;
		width: 80%;
		height: 30px;
		background-color: #FFCD1E;
		border-radius: 15px;
	}
	.all{
		width: 100vw;
		/* height: 100vw;
		background-color: white; */
		/* height: 520px; */
		padding-top: 40px;
	}
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
	
	.login{
		margin-top: 20px;
		width: 50%;
		height: 40px;
		line-height: 40px;
		background-color: #FFCD1E;
		color: white;
	}
	.zhuce{
		width: 50%;
		height: 40px;
		line-height: 40px;
		margin-top: 10px;
		background-color: white;
		color: #FFCD1E;
		font-size: 12px;
		border: 1px solid #FFCD1E;
	}
</style>
