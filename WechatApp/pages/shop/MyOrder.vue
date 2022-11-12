<template>
	<!-- 顶部 -->
	<view>
		<!-- 搜索条 -->
		<uni-search-bar placeholder="搜索你的订单" bgColor="#EEEEEE" v-model="keywords" @confirm="search" />
		<!-- 内容 -->
		<view>
			<!-- 分类行 -->
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="button" activeColor="#FFCD1E"></uni-segmented-control>
			<view class="content">
				<view v-show="current === 0">
					<!-- <uni-card
					 v-for="(item,index) in Orders" :key="index" 
					 :title="item.GoodsName" 
					 :sub-title="item.OrderID" 
					 :extra="item.OrderExpress" 
					 :thumbnail="item.img" 
					 @click="onClick"
					>
						<view class="uni-body">
							<view>
								{{item.GoodsMsg}}
							</view>
						</view>
					</uni-card> -->
					<view class="orderbox" v-for="(item,index) in search(keywords)" :key="index" @click="ClickOrder()">
						<view class="order-left">
							<text style="font-GoodsName: 25rpx;">{{item.desc}}</text>
							<view class="goods-price">￥{{item.title}}&nbsp;&nbsp;x{{item.num}}</view>
							<view class="orderID">地址: {{item.loc}}</view>
							<view class="orderState">交易状态：已完成</view>	
						</view>
						<view class="order-right">
							<img :src="item.image" style="width: 160rpx;height: 160rpx;margin-left: 20rpx;" alt="显示失败">
						</view>
						<view class="order-bottom">
							<button @click="splice()" style="width: 50%;
		height: 40px;
		line-height: 40px;
		background-color: #FFCD1E;
		color: white;">删除</button>
							<button @click="goGoodsdetail()">详细</button>
						</view>
					</view>
					<view style="text-align: center;margin-top: 20px;color: gray;">
						------暂无更多------
					</view>
					<view style="height: 20px;"></view>
				</view>
				<view v-show="current === 1">
					<view style="text-align: center;margin-top: 20px;color: gray;">
						------暂无订单------
					</view>
				</view>
				<view v-show="current === 2">
					<view style="text-align: center;margin-top: 20px;color: gray;">
						------暂无收获订单------
					</view>
				</view>
				<view v-show="current === 3">
					<view style="text-align: center;margin-top: 20px;color: gray;">
						------暂无订单评价------
					</view>
				</view>
				<view v-show="current === 4">
					<view style="text-align: center;margin-top: 20px;color: gray;">
						------暂无退款订单------
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				keywords:'',
				items: ['全部', '代付款', '待收货', '待评价', '退款'],
				current: 0,
				
				Orders:[]
			}
		},
		methods:{
			// 查询
			search(keywords){
				let list=[];
				list = this.Orders.filter(item => {
					//用includes()方法判断是否包含字符串，然后包含返回true
					if (item.desc.includes(keywords)){
						return item;
					}
				})
				//在对列表进行判断，如果列表为零表示未搜索到，flag显示为true
				if (list.length === 0){
					this.flag = true;
				}
				//否则搜到后将返回list结果
				else{
					this.flag = false;
					return list;
				}
			},
			// 跳转分类条
			onClickItem(e) {
			  if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			// 订单点击
			ClickOrder(e){
				console.log(e)
			},
			splice(item){
				this.Orders.splice(item, 1);
				console.log('删除')
			},
			goGoodsdetail(){
				console.log('进入商品详情页')
			},
			onPullDownRefresh() {
				console.log('下拉刷新成功')
				setTimeout(function() {
					uni.stopPullDownRefresh()
					console.log('停止刷新')
				}, 1000)
			},
		},
		computed:{
			
		},
		onShow(){
			let _self = this
			uni.getStorage({
				key: 'order',
				success: function (res) {
					_self.Orders = res.data
					if(_self.goods.length > 0){
						_self.show = true
					}else{
						_self.show = false
					}
					console.log(_self.Orders )
				}
			});
			
			
		},
	}
	
</script>

<style lang="scss">
	// 分类条
	.uni-common-mt {
		margin-top: 30px;
		display: flex;
	}
	.uni-padding-wrap {
		// width: 750rpx;
		padding: 0px 30px;
	}
	.content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 100%;
		// flex布局容器居中
		justify-content: center;
		align-items: center;
	}
	
	.orderbox{
		width: 100%;
		display: flex;
		// 默认换行
		flex-wrap: wrap;
		// 等分每个内部盒子的间距
		justify-content: space-around;
		margin-top: 20rpx;
		padding: 60rpx 10rpx 30rpx 30rpx;
		background-color: #fafafa;
		border-bottom: 5rpx solid #ffaa7f;
		align-items: center;
		// background-color: #aaffff;
		box-shadow:
		  -1.6px -1.6px 2.2px rgba(0, 0, 0, 0.02),
		  -2.5px -2.5px 5.3px rgba(0, 0, 0, 0.028),
		  -1.8px -1.8px 10px rgba(0, 0, 0, 0.035),
		  2.8px 2.8px 17.9px rgba(0, 0, 0, 0.042),
		  17.8px 17.8px 33.4px rgba(0, 0, 0, 0.05),
		  100px 100px 80px rgba(0, 0, 0, 0.07)
		;
	
		.order-left{
			display: flex;
			// 等分每个内部盒子的间距
			justify-content: space-around;
			// 垂直显示,列
			flex-direction: column;
			margin-left: 30rpx;
			text{
				font-size: 20px;
				width: 340rpx;
				// 溢出隐藏
				overflow: hidden;
				text-overflow: ellipsis;
				// 弹性盒子伸缩
				display: -webkit-box;
				// 显示文本行数
				-webkit-line-clamp: 2;
				// 排列方式
				-webkit-box-orient: vertical;
			}
			.goods-price{
			    font-GoodsName: 20rpx;
			    color: #F44545;
			}
			.orderID{
				border-top: 1px solid #c1c1c1;
			}
			.orderState{
				
			}
		}
		.order-right{
			margin-right: 50rpx;
		}
		.order-bottom{
			width: 100%;
			display: flex;
			// 换行
			flex-wrap: wrap;
			padding: 20rpx 10rpx 0rpx 10rpx;
			button{
				line-height: 40px;
				width: 200rpx;
				height: 80rpx;
				margin-left: 50rpx;
			}
		}
	}
</style>

