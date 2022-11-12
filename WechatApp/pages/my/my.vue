<template>
	<view class="">
		<view class="headBox">
			<view class="" v-if="user !== ''">
				<uni-file-picker
					style="float: left;"
					disable-preview
					:del-icon="false"
					return-type="object"
					@success="success" 
					@select="select">
				<u-avatar class="head" :src="src" mode="circle" size="200"></u-avatar>
				</uni-file-picker>			
				<view class="boxright" >
					<view class="name" @click="openname">{{user.username}}</view>
					<view class="info" @click="opensex">性别：{{user.gender}}</view>
					<view class="info" @click="openbir">生日：{{user.birthday}}</view>
				</view>
			</view>
			
			<view @click="login" class="box" v-else>
				<u-avatar class="head" :src="src2" mode="circle" size="200"></u-avatar>
				点击登陆
			</view>
			
		</view>
		<view class="numberBox" v-if="user != ''">
		  <view class="number">
		    <br><view style="margin-bottom:7px; font-size:19px; font-weight: 600;" >12</view>
		    <br><view style="color:gray;">帖子</view>
		  </view>
		  <view class="number">
		    <br><view style="margin-bottom:7px; font-size:19px; font-weight: 600;">34</view>
		    <br><view style="color:gray;">关注</view>
		  </view>
		  <view class="number">
		    <br><view style="margin-bottom:7px; font-size:19px; font-weight: 600;">56</view>
		    <br><view style="color:gray;">粉丝</view>
		  </view>
		</view>
		<view class="numberBox" v-else>
		  <view class="number">
		    <br><view style="margin-bottom:7px; font-size:19px; font-weight: 600;" >xx</view>
		    <br><view style="color:gray;">帖子</view>
		  </view>
		  <view class="number">
		    <br><view style="margin-bottom:7px; font-size:19px; font-weight: 600;">xx</view>
		    <br><view style="color:gray;">关注</view>
		  </view>
		  <view class="number">
		    <br><view style="margin-bottom:7px; font-size:19px; font-weight: 600;">xx</view>
		    <br><view style="color:gray;">粉丝</view>
		  </view>
		</view>
		<u-grid :col="3" border="true">
			<u-grid-item @click="myorder">
				<uni-icons type="person" size="30"/>
				<view class="grid-text">我的订单</view>
			</u-grid-item>
			<u-grid-item @click="shoppingcar">
				<uni-icons type="cart" size="30"/>
				<view class="grid-text">购物车</view>
			</u-grid-item>
			<u-grid-item @click="none">
				<uni-icons type="heart" size="30"/>
				<view class="grid-text">收藏</view>
			</u-grid-item>
			
			<u-grid-item @click="none">
				<uni-icons type="help" size="30"/>
				<view class="grid-text">帮助</view>
			</u-grid-item>
			<u-grid-item @click="none">
				<uni-icons type="location" size="30"/>
				<view class="grid-text">位置</view>
			</u-grid-item>
			<u-grid-item @click="none">
				<uni-icons type="download" size="30"/>
				<view class="grid-text">下载</view>
			</u-grid-item>
			<u-grid-item @click="shop">
				<uni-icons type="shop" size="30"/>
				<view class="grid-text">商店</view>
			</u-grid-item>
			<u-grid-item @click="none">
				<uni-icons type="search" size="30"/>
				<view class="grid-text">搜索</view>
			</u-grid-item>
			<u-grid-item @click="none">
				<uni-icons type="gear" size="30"/>
				<view class="grid-text">设置</view>
			</u-grid-item>
		</u-grid>
		
		<button class="out" @click="out" v-if="user != ''">退出账号</button>
		<view style="height: 20px;"></view>

		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" placeholder="请输入新昵称" title="修改新昵称"
			:before-close="true" @close="closename" @confirm="confirmname"></uni-popup-dialog>
		</uni-popup>
		
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" placeholder="请修改性别" title="修改性别"
			:before-close="true" @close="closesex" @confirm="confirmsex"></uni-popup-dialog>
		</uni-popup>
		
		<uni-popup ref="popup3" type="dialog">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" placeholder="请输入2000-01-01的样式" title="修改生日"
			:before-close="true" @close="closebir" @confirm="confirmbir"></uni-popup-dialog>
		</uni-popup>

		
	</view>
	
	
</template>

<script>
	export default {
		data() {
			return {
				src: '../../static/none.jpg',
				src2: '../../static/none.jpg',
				user:'',
				show: false,
				newname:'',
				newbir: '',
				newsex:'',
			}
		},
		onShow(){
			let _self = this
			uni.getStorage({
				key: 'user',
				success: function (res) {
					
					_self.user = (res.data);
					console.log(_self.user);
					
					_self.user.birthday = _self.user.birthday.slice(0,10);
					_self.src = _self.user.headImg
					_self.isLogin = true
				},
				fail(res) {
					console.log(res);
					_self.user = '';
				}
			});
			console.log("user:",_self.user);
			// uni.getStorage({
			// 	key: 'shopping',
			// 	success: function (res) {
			// 		console.log(res.data)

			// 	}
			// });
		},
		methods: {
			//修改头像
			select(e){
				console.log(e.tempFilePaths[0])
				let _self = this
				if(!_self.user) return
				let newhead = e.tempFilePaths[0]
				uni.request({
					url: 'http://localhost:3000/api/user/mod_info',
					method: 'POST',
					data: {
						"userid":_self.user.userid,
						"newInfo":{
							"headImg":newhead
						}
					},
					success(res) {
						console.log('修改成功');
						_self.user.headImg = newhead
						
						try {
							uni.setStorageSync('user', _self.user);
						} catch (e) {
							// error
						}
					}
				});	
			},
			success(e){
				console.log('上传成功')
			},
			openname() {
				this.$refs.popup1.open()
			},
			closename() {
				this.$refs.popup1.close()
			},
			opensex() {
				this.$refs.popup2.open()
			},
			closesex() {
				this.$refs.popup2.close()
			},
			openbir() {
				this.$refs.popup3.open()
			},
			closebir() {
				this.$refs.popup3.close()
			},
			confirmbir(value) {
				let _self = this
				if(!_self.user) return
				let newbir = value
				uni.request({
					url: 'http://localhost:3000/api/user/mod_info',
					method: 'POST',
					data: {
						"userid":_self.user.userid,
						"newInfo":{
							"birthday":newbir
						}
					},
					success(res) {
						console.log('修改成功');
						_self.user.birthday = newbir
						try {
							uni.setStorageSync('user', _self.user);
						} catch (e) {
							// error
						}
					}
				});	
			
				this.$refs.popup3.close()
			},
			confirmsex(value) {
				let _self = this
				if(!_self.user) return
				let newsex = value
				uni.request({
					url: 'http://localhost:3000/api/user/mod_info',
					method: 'POST',
					data: {
						"userid":_self.user.userid,
						"newInfo":{
							"gender":newsex
						}
					},
					success(res) {
						console.log('修改成功');
						_self.user.gender = newsex
						try {
							uni.setStorageSync('user', _self.user);
						} catch (e) {
							// error
						}
					}
				});	
			
				this.$refs.popup2.close()
			},
			confirmname(value) {
				let _self = this
				if(!_self.user) return
				let newname = value
				uni.request({
					url: 'http://localhost:3000/api/user/mod_info',
					method: 'POST',
					data: {
						"userid":_self.user.userid,
						"newInfo":{
							"username":newname
						}
					},
					success(res) {
						console.log('修改成功');
						_self.user.username = newname
						try {
							uni.setStorageSync('user', _self.user);
						} catch (e) {
							// error
						}
					}
				});	

				this.$refs.popup1.close()
			},
			none() {
				uni.showToast({
				  title: '暂未开发',
				  icon: 'none'
				})
			},
			shoppingcar(){
				uni.getStorage({
					key: 'user',
					success() {
						uni.navigateTo({
							url: '../../pages/shop/goodcar'
						})	
					},
					fail: function (res) {
						uni.showToast({
							title: '未登录账号！',
							icon: 'none'
						})
					}
				});
				
			},
			myorder(){
				uni.getStorage({
					key: 'user',
					success() {
						uni.navigateTo({
							url: '../../pages/shop/MyOrder'
						})	
					},
					fail: function (res) {
						uni.showToast({
							title: '未登录账号！',
							icon: 'none'
						})
						return
					}
				});
				
			},
			shop() {
				uni.getStorage({
					key: 'user',
					success() {
						uni.switchTab({
							url:'../../pages/shop/shop'
						})
					},
					fail: function (res) {
						uni.showToast({
							title: '未登录账号！',
							icon: 'none'
						})
						return
					}
				});
				
			},
			login() {
				uni.navigateTo({
					url: '../../pages/login/login'
				})	
			},
			//退出
			out() {
				let _self = this
				try {
					if (_self.user.isDel != false){
						uni.showToast({
						  title: '未登录账号！',
						  icon: 'none'
						})
					}else{
						uni.showToast({
						  title: '已退出！',
						  icon: 'none'
						})
						uni.removeStorageSync('user');
						_self.user=''
						_self.src='../../static/none.jpg'
					}
				} catch (e) {
					// error
				}
			},
		}
	}
</script>

<style>
	.out{
		margin-top: 20px;
		width: 50%;
		height: 40px;
		line-height: 40px;
		background-color: #FFCD1E;
		color: white;
	}
	.headBox{
		width: 100%;
		height: 100px;

		padding-left: 8px;
	}
	.boxright{
		width: 70%;
		height: 100%;
		float: right;
		position: relative;
		bottom: 100px;
	}
	.box{
		font-size: 30px;
		line-height: 100px;
		position: relative;
		text-align: center;
	}
	.head{
		float: left;
		margin-top: 7.5px;
	}
	.name{
		width: 60%;
		height: 50%;
		font-size: 25px;
		float: left;
		line-height: 50px;
		padding-left: 15px;
	}
	.info{
		width: 60%;
		height: 25%;
		color: gray;
		float: left;
		font-size: 15px;
		line-height: 25px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-left: 15px;
	}
	.numberBox{
	  width: 100%;
	  height: 60px;
	  margin-top: 20px;
	  display: flex;
	  justify-content: space-around;
	  flex-wrap: wrap;
	}
	.number{
	  width: 33.3%;
	  height: 100%;
	  line-height: 10px;
	  text-align: center;
	}
	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

</style>
