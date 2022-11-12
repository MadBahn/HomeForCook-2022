<template>
	
	<view >
		<view class="all">
			<!-- <u-field
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
			</u-field>
			<u-field
				v-model="psd2"
				label="密码"
				password=true
				clearable=true
				placeholder="请再次确认密码"
				border-bottom=true
				@blur="psd2 = $event.target.value"
			>
			</u-field> -->
			<img class="logo" src="../../static/logo.png" alt="">
			<input v-model="acc" class="ipt" type="text" name="acc" placeholder="请输入账号">
			<input v-model="psd" class="ipt" type="password" name="psd" placeholder="请输入密码" show-password>
			<input v-model="psd2" class="ipt" type="password" name="psd2" placeholder="请再次输入密码" show-password>
			<button class="zhuce" @click="zhuce">注册</button>
		</view>
	</view>
	
</template>


<script>
function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+S4());
}
	export default {
		data() {
			return {
				acc: '',
				psd: '',
				psd2: ''
			}
		},
		methods: {
			zhuce() {
				let _self = this
				if (_self.acc && _self.psd) {
					if (_self.psd2 == _self.psd) {
						let userid = "u"+guid()
						let aid = "a"+guid()
						uni.request({
							url: 'http://localhost:3000/api/user/register',
							method: 'POST',
							data: {
								"info":{
									"userid":userid,
									"username":"Sea",
									"gender":"M",
									"birthday":"2/2/1990",
									"isDel":false
								},
								"auth":{
									"aid": aid,
									"userid":userid,
									"auth_name":_self.acc,
									"password":_self.psd,
									"isDel":false
								}
							},
							success(res) {
								console.log(res);
								if (res.data.desc == "registered successfully") {
									uni.navigateTo({
										url: '/pages/login/login?acc='+_self.acc
									});
									uni.showToast({
									  title: '注册成功！',
									  icon: 'success'
									})
									
									
								} else {
									uni.showToast({
									  title: '账号已存在！',
									  icon: 'none'
									})
								}
							}
						});
					} else {
						uni.showToast({
						  title: '两次输入密码不一致！',
						  icon: 'none'
						})
					}
				} else {
					uni.showToast({
					  title: '请输入账号或密码！',
					  icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.all{
		width: 100vw;
		/* height: 100vw;
		background-color: white; */
		/* height: 520px; */
		padding-top: 40px;
	}
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
	.zhuce{
		margin-top: 20px;
		width: 50%;
		height: 40px;
		line-height: 40px;
		background-color: #FFCD1E;
		color: white;
	}
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
	.input{
		border: 1px red solid;
	}
</style>
