<template>
	<view style="padding: 0 10rpx;">
	        <custom-waterfalls-flow ref="waterfallsFlowRef" v-model="data.list" 
			:column="column" :columnSpace="1.5" :seat="2" 
			@wapperClick="wapperClick" @imageClick="imageClick">
	            <!-- #ifdef MP-WEIXIN -->
	            <view class="item" v-for="(item,index) in data.list" :key="index" slot="slot{{index}}">
	                <view class="title" style="color: red;font-weight: bold;">¥{{item.title}}</view>
	                <view class="desc">{{item.desc}}</view>
	            </view>
	            <!-- #endif -->
<!-- 	            #ifndef MP-WEIXIN -->
	            <!-- <template v-slot:default="item">
	                <view class="item">
	                    <view class="title" style="color: red;font-weight: bold;">¥{{item.title}}</view>
	                    <view class="desc">{{item.desc}}</view>
	                </view>
	            </template> -->
<!-- 	            #endif -->
	        </custom-waterfalls-flow>
	    </view>
</template>

<script>
	import { reactive, ref, onMounted } from 'vue';
	export default {
		data() {
			return {
				data:{
					// list:this.spsj,====
					list: [
						{ 
							id:'1',
							image: 'https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg', 
							title: '299', 
							desc: 'PILIPILIGOODS 小电视 壬虎虎年系列 毛绒抱枕 超大号' ,
							chicun: "越长65cm*宽52cm*高50cm",
							caizhi: "涤纶",
							yuanxing: "脑虎",
							ip: "pilipili",
							pinpai: "pilipili",
						},
						{
							id:'2',
							image: 'https://scpic.chinaz.net/files/pic/pic9/201311/apic2098.jpg', 
							title: '169', 
							desc: '敦煌研究院x噼哩噼哩 2233 敦煌伎乐天系列 无线充电宝1000mAh' ,
							chicun: "14.3cm*7cm*1.75cm",
							caizhi: "ABS",
							yuanxing: "22 33",
							ip: "敦煌研究院",
							pinpai: "pilipili",
						},
						{
							id:'3',
							image: 'https://img.zcool.cn/community/01a9635b52ec8da80121ade04a5c54.JPG@1280w_1l_2o_100sh.jpg', 
							title: '499', 
							desc: '噼哩噼哩 2233幻星集塔罗 Q版手办一对' ,
							chicun: "高约12cm",
							caizhi: "PVC,PE",
							yuanxing: "22 33",
							ip: "pilipili",
							pinpai: "pilipili",
						},
						{
							id:'4',
							image: 'https://scpic.chinaz.net/files/pic/pic9/201909/zzpic20106.jpg', 
							title: '1299', 
							desc: 'BeBox pilipilix故宫宫苑联名限定2233 国风华彩 手办 附特典' ,
							chicun: "整体高：约25cm",
							caizhi: "PVC",
							yuanxing: "22 33",
							ip: "故宫宫苑",
							pinpai: "pilipili",
						},
					],
					column: 1,
					// spxq:{},

				}
			}
		},
		
		methods: {
			imageClick(item) {
				uni.navigateTo({
					url: '../../pages/shop/gooddetail?item='+JSON.stringify(item)
					// url: '../../pages/shop/gooddetail'
				})
			},
			wapperClick(item) {
				let good = JSON.stringify(item)
				uni.navigateTo({
					url: '../../pages/shop/gooddetail?item='+good
				})				
			},
			
			            
		},
		mounted() {
			
		}
	}
</script>
<style>
    page {
        background-color: #f2f5f9;
    }
</style>
<style lang="scss" scoped>
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
</style>

