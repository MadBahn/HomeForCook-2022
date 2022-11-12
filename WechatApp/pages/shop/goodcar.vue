<template>
	<view>
		<!-- 如果为空显示 -->
		<view class="empty" v-if="goods.length===0">
			<image src="https://bpic.588ku.com/element_origin_min_pic/19/04/10/761ee07a08419d9db3c24bd05d88e360.jpg" mode="widthFix" style="width: 400rpx;"></image>
		<view class="empty-text">空空如也的购物</view>
		<view class="empty-button" @click="goshopping">去选购</view>
		</view>
		<!-- 有商品时显示 -->
		<view v-else class="goods-box">
			<view class="goods-detail" v-for="(item,index) in goods" :key="item.id">
				<view class="detail-left">
					<view class="goods-left">
						<!-- 勾选 -->
						<checkbox-group>
							<label>
								<checkbox  class="selected" color="#ff5500" :checked="item.flag" @click="djxz(item)"/>
								<text></text>
							</label>
						</checkbox-group>
						<!-- 商品图 -->
						<!-- <image :src="item.goodsImage" style="width: 150rpx;height: 140rpx;" alt="显示失败"></image> -->
						<img :src="item.image" style="width: 150rpx;height: 140rpx;margin-left: 20rpx;" alt="显示失败">
					</view>
					<!-- 商品名 -->
					<view class="GoodsName">
					    <text style="font-GoodsName: 25rpx;">{{item.desc}}</text>
					    <text class="goods-price">￥{{item.title}}/件</text>
					</view>
				</view>
				<!-- 数量加减 -->
				<view class="detail-right">
					<text class="subtract" @click="reduce(item)">-</text>
					<text class="num">{{item.num}}</text>
					<text @click="add(item)" class="add">+</text>
					<view class="goods-del" @click="goodsDel(item)">
						<uni-icons type="trash-filled" size="20"></uni-icons>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="end">
				<view class="end-left">
					<checkbox-group @change="selectgoods()">
						<label>
							<checkbox  :checked="allchecked" />全选
						</label>
					</checkbox-group>
					<view>
						总计：<text style="color: #f00;font-weight: bold;">￥ {{totalPrice}}</text>
					</view>
					</view>
					<view class="end-right" @click="buy">
					    结算
					</view>	
			</view>
		</view>	
	</view>
</template>

<script>
	export default{
		data(){
			return{
				// 商品bu显示
				// show:false,
				// 全选中
				allchecked:true,
				// 购物车
				goods:this.gwc,
			}
		},
		onShow(){
			// console.log(this.gwc)
			// console.log(this.goods)
			let _self = this
			this.$set(this.goods,this.gwc)
			console.log(_self.goods.length)
			// uni.getStorage({
			// 	key: 'shopping',
			// 	success: function (res) {
			// 		_self.goods = res.data
			// 		if(_self.goods.length > 0){
			// 			_self.show = true
			// 		}else{
			// 			_self.show = false
			// 		}
			// 	}
			// });
			
			
		},
		methods:{
			// 每次单机选择进行判断
			djxz(item){
				console.log(item.flag)
				item.flag = !item.flag
				console.log(item.flag)
			    let a =this.goods.some(item=>item.flag==false)
				console.log(a)
				if(a){
					this.allchecked=false
				}else{
					this.allchecked=true
				}
			},
			buy(){
				let _self = this
				let good = []
				console.log(_self.goods)
				for(let i=0;i<_self.goods.length;i++){
					if(_self.goods[i].flag == true){
						// console.log('第'+i+'个')
						// good.push(JSON.stringify(_self.goods[i]))
						good.push(_self.goods[i])
					}
					// console.log(_self.goods[i].flag)
				}
				let newgood = JSON.stringify(good)
				console.log(newgood)
				// console.log(newgood)
			 //    let a =	this.djjs()
				// console.log(a)
				uni.navigateTo({
					url: '../../pages/shop/order2?item='+newgood
				})
			},
			goshopping(){
				uni.switchTab({
					url:'../../pages/shop/shop'
				})
				console.log('已进入商城')
			},
			change(e){
				console.log(e)
			},

			// 全选
			selectgoods(){
				this.allchecked =! this.allchecked
				if(this.allchecked){
					this.goods.map(item=>{
						this.checked = true
						item.flag = true
					})
				}else{
					this.checked = false
					this.goods.map(item=>{
						item.flag = false
					})
				}
			},
			// 数量减少
			reduce(item){
				console.log(item)
				// 减少数量
				for(let i=0;i<this.goods.length;i++){
					if(this.goods[i].id===item.id){
						if(this.goods[i].num>1){
							this.goods[i].num--
						}
						else{
							console.log('不可以在减少了')
						}
					}
				}
				// 强制刷新
				// this.$forceUpdate()
			},
			// 数量增加
			add(item){
				console.log(item)
				for(let i=0;i<this.goods.length;i++){
					if(this.goods[i].id===item.id){
						this.goods[i].num++
					}
				}
				// 强制刷新
				// this.$forceUpdate()
			},
			// 删除数据
			goodsDel(item){
				console.log(item)
				for(let i=0;i<this.goods.length;i++){
					if(this.goods[i].id===item.id){
						this.goods.splice(i,1)
					}
				}
			},
		},
		computed:{
			totalNum(){
				let totalNum = 0;
				for(let i=0;i<this.goods.length;i++){
					this.goods[i].flag ? totalNum+=this.goods[i].num : totalNum
				}
				return totalNum
			},
			// 总价格
			totalPrice() {
			    let totalPrice = 0;
			    this.goods.map(item => {
			        item.flag ? totalPrice += item.num * parseInt(item.title) : totalPrice += 0
			    })
			    return totalPrice
			}
		}
	}
	
</script>

<style lang="scss">
	.goods-box{
		box-shadow:
		  6.4px 6.4px 1.7px rgba(0, 0, 0, 0.017),
		  12.5px 12.5px 4.3px rgba(0, 0, 0, 0.026),
		  18.8px 18.8px 8.5px rgba(0, 0, 0, 0.032),
		  26.9px 26.9px 15.8px rgba(0, 0, 0, 0.038),
		  42.2px 42.2px 31px rgba(0, 0, 0, 0.048),
		  100px 100px 80px rgba(0, 0, 0, 0.07);
	}
	.goods{
		line-height: 80rpx;
		background-color: #FFFFFF;
		&-detail{
			width: 100%;
		    display: flex;
		    padding: 60rpx 15rpx 30rpx 30rpx;
		    background-color: #fff;
		    justify-content: space-between;
		    border-bottom: 5rpx solid #e2e2e2;
		    align-items: center;
		    .detail-left{
		        display: flex;
		        .goods-left{
		            display: flex;
		            align-items: center;
		        }
		    }
		    .GoodsName{
		        display: flex;
		        justify-content: space-around;
		        flex-direction: column;
		        margin-left: 30rpx;
				text{
					width: 300rpx;
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
		    }
		    .detail-right{
				width: 30%;
				.subtract{
		            border-radius: 30rpx 10rpx 10rpx 30rpx;
		        }
		        text{
		            width: 50rpx;
		            line-height: 50rpx;
		            text-align: center;
		            display: inline-block;
		            background-color: #F7F7F7;
		            margin-right: 10rpx;
		        }
		        .add {
		            color: #FA4305;
		            border-radius: 10rpx 30rpx 30rpx 10rpx;
		            margin-right: 20rpx;
		        } 
				.goods-del{
					margin-top: 30rpx;
					text-align: center;
				}
		    }
		}
	}
	.empty{
		    position: relative;
		    top: 220rpx;
		    text-align: center;
		    display: flex;
		    align-items: center;
		    flex-direction: column;
		    &-text{
		        color: #808080;
		        margin-bottom: 50rpx;
		    }
		    &-button{
		        width: 300rpx;
		        height: 90rpx;
		        color:orange;
		        border: 1rpx solid orange;
		        text-align: center;
		        line-height: 90rpx;
		        border-radius: 48rpx;
		    }		
	}
	.end{
	    width: 100%;
	    height: 90rpx;
	    background-color:#fff;
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    display: flex;
	    align-items: center;
	    &-left{
	        width: 70%;
	        display: flex;
	        justify-content: space-between;
	        padding: 0 30rpx;
	        .end-flex{
	            display: flex;
	            align-items: center;
	        }
	    }
	    &-right{
	        width: 30%;
	        line-height: 90rpx;
	        background-color: #F44545;
	        text-align: center;
	        color: #fff;
	    }
	}
</style>

