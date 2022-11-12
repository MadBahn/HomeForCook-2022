<template>
	<view>
		<u-swiper :list="list" mode="number" indicator-pos="bottomCenter" height="600"></u-swiper>
		<view class="goods-carts">
			<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
				@buttonClick="buttonClick"/>
		</view>
		<view class="content">
			<view class="price">
				¥{{item.title}}
			</view>
			<view class="info">
				{{item.desc}}
			</view>

		</view>
		<view class="kong">
			<view class="detailH">商品详细</view>
			<view class="detailN">
				<view class="detailNa"></view>
				<view class="detailNa">材质</view>
				<view class="detailNa">品牌</view>
		 	<view class="detailNa">IP</view>
			</view>
			<view class="detailN">
				<view class="detailNa">类型</view>
				<view class="detailNa" id="caizhi" style="color: gray;">{{item.caizhi}}</view>
				<view class="detailNa" id="pinpai" style="color: gray;">{{item.pinpai}}</view>
				<view class="detailNa" id="ip" style="color: gray;">{{item.ip}}</view>
			</view>
			<view class="detailN">
				<view class="detailNa">原型</view>
				<view class="detailName" id="yuanxing" style="color: gray;">{{item.yuanxing}}</view>
			</view>
			<view class="detailN">
				<view class="detailNa">尺寸</view>
				<view class="detailName" id="chicun" style="color: gray;">{{item.chicun}}</view>
			</view>
			<view class="detailN">
				<view class="detailNa"></view>
				<view class="detailNa"></view>
				<view class="detailNa"></view>
				<view class="detailNa"></view>
			</view>
		</view>

		<view class="img_box">
			<img class="bimg" :src="list[1]">
			<img class="bimg" :src="list[2]">
			<img class="bimg" :src="list[3]">
		</view>
		
	</view>

</template>

<script>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue';
	export default {
		data() {
			return {
				item: [],
				list: [],
				shoppingList: [],
				price:12,
				options: [{
						icon: 'chat',
						text: '客服'
					},
					{
						icon: 'shop',
						text: '店铺',
						infoBackgroundColor: '#007aff',
						infoColor: "#f5f5f5"
					},
					{
						icon: 'cart',
						text: '购物车',
					},
				],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#FFCD1E',
						color: '#fff'
					},
					{
						text: '购买',
						backgroundColor: '#FF8A18',
						color: '#fff'
					}
				],
			}
		},

		methods: {
			onClick(e) {
				uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				})
				if(e.index === 2){
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
							return
						}
					});
					
				}
			},
			buttonClick(e) {
				let _self = this
				if (e.index === 0) {
					uni.getStorage({
						key: 'user',
						success() {
							// console.log(this.gwc)
							let a =	_self.jrgwcsj(_self.item)
							// console.log(a)
						},
						fail: function (res) {
							uni.showToast({
								title: '未登录账号！',
								icon: 'none'
							})
							return
						}
					});
					// let a =	this.jrgwcsj(this.item)
				}
				if (e.index === 1) {
					let _self = this
					uni.getStorage({
						key: 'user',
						success() {
							
							let good = JSON.stringify(_self.item)
							// console.log(good)
							uni.navigateTo({
								url: '../../pages/shop/order?item='+good
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
					
				}
			}

		},
		onLoad(option) {
			let _self = this
			// uni.setStorageSync('shopping',[])
			// uni.getStorageSync('shopping') ? this.shoppingList=uni.getStorageSync('shopping') : this.shoppingList=[]
			// console.log(this.shoppingList)
			if(option.item){
				_self.item = JSON.parse(option.item)
			}
			for (let i = 0; i < 3; i++) {
				_self.list.push(_self.item.image)
			}

		},
		onShow(){
			let _self = this
			// uni.getStorageSync('gwc') ? this.shoppingList=uni.getStorageSync('gwc') : this.shoppingList=[]
			
		},
	}
</script>
<style>
	page {
		background-color: #f2f5f9;
	}
</style>
<style lang="scss" scoped>
	.img_box {
		width: 100%;

	}
	.bimg{
		width: 100%;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.handle {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
		padding: 10rpx;

		.btn {
			margin: 20rpx 10rpx;
			padding: 0 20rpx;
			background: #2878FF;
			font-size: 28rpx;
			color: #fff;

			&::after {
				border: 0;
			}
		}
	}

	.item {
		padding: 10rpx 10rpx 20rpx;

		.title {
			line-height: 48rpx;
			font-size: 28rpx;
			color: #222;
		}

		.desc {
			font-size: 24rpx;
			color: #666;
		}
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}

	.content {
		width: 100%;
		height: 60px;
		// background-color: antiquewhite;
	}

	.price {
		width: 100%;
		height: 25px;
		line-height: 25px;
		font-weight: bold;
		color: red;
		// background-color: red;
		margin-left: 10px;
	}

	.info {
		width: 94%;
		height: 35px;
		line-height: 17.5px;
		font-weight: bold;
		// background-color: rebeccapurple;
		margin-left: 10px;
		// margin-right: 10px;
	}

	.kong {
		width: 100%;
		height: 300px;
		margin-top: 10px;
		background-color: white;
	}

	.detailH {
		width: 100%;
		height: 60px;
		font-size: 20px;
		text-align: center;
		line-height: 60px;
		background-color: #707070;
		color: white;
	}

	.detailN {
		width: 100%;
		height: 60px;
		font-size: 20px;
		text-align: center;
		line-height: 60px;
		float: left;
	}

	.detailNa {
		width: 25%;
		height: 60px;
		font-size: 20px;
		text-align: center;
		line-height: 60px;
		float: left;
		overflow: hidden;
	}

	.detailName {
		width: 75%;
		height: 60px;
		font-size: 20px;
		text-align: center;
		line-height: 60px;
		float: left;
		overflow: hidden;
	}
</style>
