<template>
	<view>
		<view class="head">
			
			<!-- <view class="city">四川省 成都市</view> -->
			<uni-data-picker placeholder="请选择城市" popup-title="请选择所在地区" :localdata="dataTree" v-model="classes"
				@change="onchange" @nodeclick="onnodeclick" @popupopened="onpopupopened" @popupclosed="onpopupclosed">
			</uni-data-picker>
			<view class="loc" @click="openname">{{city}}</view>
			
			<view class="name"><!-- {{user.user.username}} -->
				1
			</view>
		</view>
		<view class="good" v-for="(item,index) in items">
			<view class="gg">现货商品</view>
			<view class="gcard">
				<img class="gimg" :src="item.image"></img>
				<view class="gname">{{item.desc}}</view>
				<view class="gprice">¥{{item.title}}</view>
			</view>
			<view class="gnum">
				购买数量：<span style="color: red;">{{item.num}}</span>
				<!-- <uni-number-box :min="1" :max="5" :value="1" style="float: right;" @change="changeValue" /> -->
			</view>
		</view>
		<view class="box">
			<view class="hang">
				<view class="zuo">优惠券</view>
				<view class="you">暂无可用</view>
			</view>
			<view class="hang">
				<view class="zuo">配送</view>
				<view class="you">运费<span style="color: red;">¥0.00</span></view>
			</view>
		</view>
		<view class="paybox">
			<view class="gg">选择支付方式</view>
			<view class="uni-px-5">
				
				<uni-data-checkbox style="float: left;"  mode="button" v-model="radio2" :localdata="option"></uni-data-checkbox>
				<!-- <uni-data-checkbox mode="list" icon="left" v-model="value" :localdata="range"></uni-data-checkbox> -->
			</view>
		</view>
		<view class="footer">
			<view class="fprice">¥{{price}}</view>
			<view class="sumbit" @click="buy">提交订单</view>
		</view>
		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" placeholder="请输入具体位置" title="地址"
			:before-close="true" @close="closename" @confirm="confirmname"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	
	export default {
		computed:{
			// 总价格
			price() {
			    let totalPrice = 0;
			    this.items.map(item => {
			        item.flag ? totalPrice += item.num * parseInt(item.title) : totalPrice += 0
			    })
			    return totalPrice
			}
		},
		data() {
			return {
				items:[],
				user:[],
				radio2: 0,
				option: [{
					text: '支付宝',
					value: 0
				}, {
					text: '微信',
					value: 1
				}, {
					text: 'QQ支付',
					value: 2
				},{
					text: '花呗',
					value: 3
				}],
				classes: '1-1',
				dataTree: [{
					text: "四川省",
					value: "1-0",
					children: [{
						text: "成都市",
						value: "1-1"
					},
					{
						text: "绵阳市",
						value: "1-2"
					},
					{
						text: "德阳市",
						value: "1-3"
					},
					{
						text: "攀枝花市",
						value: "1-4"
					},
					{
						text: "遂宁市",
						value: "1-5"
					}]
				},
				{
					text: "贵州省",
					value: "2-0",
					children: [{
						text: "贵阳市",
						value: "2-1"
					},
					{
						text: "遵义市",
						value: "2-2"
					},
					{
						text: "六盘水市",
						value: "2-3"
					},
					{
						text: "安顺市",
						value: "2-4"
					},
					{
						text: "毕节市",
						value: "2-5"
					}]
				},
				{
					text: "湖南省",
					value: "3-0",
					children: [{
						text: "长沙市",
						value: "3-1"
					},
					{
						text: "株洲市",
						value: "3-2"
					},
					{
						text: "湘潭市",
						value: "3-3"
					},
					{
						text: "衡阳市",
						value: "3-4"
					},
					{
						text: "邵阳市",
						value: "3-5"
					}]
				}],
				city:'点击输入你的具体位置',
				loc:'四川省成都市',
			}
		},
		onLoad(option) {
			let _self = this
			// this.items=[]
			if(option.item){
				_self.items = JSON.parse(option.item)
			}
			if(option.price){
				_self.price = option.price
			}
			
			console.log(_self.items)
			uni.getStorage({
				key: 'user',
				success: function (res) {
					_self.user = res.data
				}
			});
		},
		methods: {
			openname() {
				this.$refs.popup1.open()
			},
			closename() {
				this.$refs.popup1.close()
			},
			confirmname(value) {
				let _self = this
				let newname = value
				_self.city = newname
			
				this.$refs.popup1.close()
			},
			onnodeclick(e) {
				// console.log(e);
			},
			onpopupopened(e) {
				// console.log('popupopened');
			},
			onpopupclosed(e) {
				// console.log('popupclosed');
			},
			onchange(e) {
				// console.log('onchange:', e);
				let _self = this
				_self.loc = e.detail.value[0].text + e.detail.value[1].text
				// console.log(_self.loc)
			},
			changeValue(value) {
				console.log('返回数值：', value);
				let _self = this
				_self.num = value
			},
			buy(){
				console.log(this.gwcxz)
				let _self = this
			    // this.cshdd()
				this.$forceUpdate()
				// console.log(_self.city)
				if(_self.city == '点击输入你的具体位置') {
					uni.showToast({
						title: '请填写你的地址',
						icon: 'none'
					})
					return
				}
				let dingdans = []
				dingdans = _self.items
				for(let i=0;i<dingdans.length;i++){
					dingdans[i]['loc'] =_self.loc + _self.city
				}
				console.log(dingdans)
				uni.setStorage({
					key: 'order',
					data: dingdans,
					success: function () {
						// console.log('已加入购物车');
					}
				});
				uni.reLaunch({
					url:'../../pages/shop/MyOrder'
				});
				// uni.navigateTo({
				// 	url:'../../pages/shop/MyOrder'
				// })
				uni.showToast({
					title: '购买成功',
					icon: 'success'
				})
			},
		}
	}
</script>
	
<style>
	.title {
			font-size: 14px;
			font-weight: bold;
			margin: 20px 0 5px 0;
		}
	
		.data-pickerview {
			height: 400px;
			border: 1px #e5e5e5 solid;
		}
	
		 .popper__arrow {
	    top: -6px;
	    left: 50%;
	    margin-right: 3px;
	    border-top-width: 0;
	    border-bottom-color: #EBEEF5;
	}
	 .popper__arrow {
	    top: -6px;
	    left: 50%;
	    margin-right: 3px;
	    border-top-width: 0;
	    border-bottom-color: #EBEEF5;
	}
	.head{
		width: 100%;
		height: 90px;
		background-color: white;
	}
	.city{
		width: 90%;
		height: 30px;
		line-height: 30px;
		margin-left: 5%;
		font-weight: bold;
	}
	.loc{
		width: 90%;
		height: 30px;
		line-height: 30px;
		margin-left: 5%;
		font-weight: bold;
	}
	.name{
		width: 90%;
		height: 27px;
		line-height: 27px;
		margin-left: 5%;
		font-weight: lighter;
	}
	.good{
		width: 100%;
		height: 170px;
		margin-top: 20px;
		background-color: white;
	}
	.gg{
		width: 95%;
		height: 30px;
		margin-left: 10px;
		line-height: 30px;
		float: left;
	}
	.gcard{
		width: 100%;
		height: 110px;
		float: left;
		
	}
	.gimg{
		width: 90px;
		height: 90px;
		margin-top: 10px;
		margin-left: 10px;
		float: left;
	}
	.gname{
		width: 65%;
		height: 40px;
		float: left;
		margin-top: 10px;
		margin-left: 5px;
		line-height: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		display:-webkit-box; //作为弹性伸缩盒子模型显示。
		-webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
		-webkit-line-clamp:2; //显示的行
		
	}
	.gprice{
		width: 65%;
		height: 30px;
		float: left;
		margin-top: 20px;
		line-height: 30px;
		margin-left: 5px;
	}
	.gnum{
		width: 95%;
		height: 30px;
		line-height: 30px;
		float: left;
		margin-left: 10px;
	}
	.box{
		width: 100%;
		height: 80px;
		margin-top: 20px;
		background-color: white;

	}
	.hang{
		width: 94%;
		height: 40px;
		line-height: 40px;
		margin-left: 3%;
	}
	.zuo{
		float: left;
	}
	.you{
		float: right;
	}
	.paybox{
		width: 100%;
		height: 200px;
		background-color: white;
		margin-top: 20px;
	}
	.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
	}
	.footer{
		width: 100%;
		height: 50px;
		background-color: white;
		position: fixed;
		bottom: 0;
	}
	.fprice{
		width: 47%;
		height: 50px;
		line-height: 50px;
		margin-left: 3%;
		font-weight: bold;
		font-size: 20px;
		color: red;
		float: left;
	}
	.sumbit{
		width: 40%;
		height: 50px;
		background-color: #FF8A18;
		float: right;
		line-height: 50px;
		text-align: center;
		border-radius: 15px;
	}
</style>
