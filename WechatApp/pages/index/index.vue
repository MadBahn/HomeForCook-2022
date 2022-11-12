<template>
	<view class="body">
		<u-swiper :list="swiperlist" mode="round"  title="true" height="400" ></u-swiper>
		<!-- <uni-section title="热门分享" type="line"> -->

		<!-- <uni-list v-for="(item, index) in newslist" :key="index">
			<uni-list :border="true">
				<uni-list-chat :avatar-circle="true" 
					:title="item.title"  :note="item.user.username" :time="item.post_date">	
				</uni-list-chat>
			</uni-list>
		</uni-list>
		</uni-section>
		<uni-section title="推荐讨论" type="line" >
			<uni-list v-for="(item, index) in themelist" :key="index">
				<uni-list :border="true">
					<uni-list-chat clickable="true"  :avatar-circle="true" 
						:title="item.user.username"  :note="item.title" :time="item.post_date.slice(0,10)" :avatar="item.user.headImg" @click="tiezi(item)">	
					</uni-list-chat>
					
				</uni-list>
			</uni-list>
		</uni-section> -->
		
		<uni-section title="热门帖子" type="line">
			<uni-list v-for="(item, index) in newslist" :key="index">
				<uni-list :border="true">
					<uni-list-item
						clickable="true" 
						:title="item.title"  
						:note="item.user.username" 
						:time="item.post_date"
						@click="tiezi({id: item.sid})"
						 >
					</uni-list-item>
				</uni-list>
			</uni-list>
		</uni-section>
		<uni-section title="推荐主题" type="line">
			<uni-list v-for="(item, index) in themelist" :key="index">
				<uni-list :border="true">
					<uni-list-item 
						clickable="true" 
						:title="item.title"  
						:note="item.user.username" 
						:time="item.post_date"
						@click="tiezi({id: item.tid})"
						 >
					</uni-list-item>
				</uni-list>
			</uni-list>
		</uni-section>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				swiperlist:[
					{
						image: 'https://scpic.chinaz.net/files/pic/pic9/201711/zzpic8511.jpg',
						title: '这是图一'
					},
					{
						image: 'https://scpic.chinaz.net/files/pic/pic9/201709/bpic3235.jpg',
						title: '这是图二'
					},
					{
						image: 'https://img.zcool.cn/community/010cf459b3b204a801211d257fcb96.JPG@1280w_1l_2o_100sh.jpg',
						title: '这是图三'
					},
				],
				newslist:[],
				themelist:[],
			}
		},
		methods: {
			tiezi(item){
				let _self = this
				console.log(item)
				let detail = JSON.stringify(item)
				uni.navigateTo({
					url: '../../pages/tiezi/tiezi?item=' + detail
				})
			},
			request:async function(){
				let self = this
				await uni.request({
					url: 'http://localhost:3000/api/content/list',
					method: 'POST',
					data: {
						type:"share",
						amount:5
					},
					success(res) {
						console.log(res.data);
						self.newslist = res.data.data;
					}
				});
				
				// request the topic data
				await uni.request({
					url: 'http://localhost:3000/api/content/list',
					method: 'POST',
					data: {
						type:"topic",
						amount:5
					},
					success(res) {
						self.themelist = res.data.data;
						console.log(self.themelist[0])
					}
				});
			}
		},
		onPullDownRefresh() {
			this.request();
		},
		mounted() {
			this.request();
		}
	}
</script>

<style lang="scss" scoped>
	.u-card-wrap { 
		background-color: $u-bg-color;
		padding: 1px;
	}
	
	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 20rpx 20rpx 20rpx;
	}
		
	.u-body-item image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
		float: right;
	}
	.chat-custom-right {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}
	
	.chat-custom-text {
		font-size: 12px;
		color: #999;
	}
	.card{
		width: 100%;
		height: 70px;
		margin-top: 20px;
	}
	.head{
		width: 50px;
		height: 50px;
		border-radius: 50%;
		float: left;
		position: relative;
		left: 5px;
		top: 10px;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.content{
		width: 200px;
		height: 70px;
		float: left;
		margin-left: 15px;
		padding-left: 10px;
	}
	.name{
		width: 200px;
		height: 20px;
		line-height: 20px;
		font-weight: bold;
	}
	.message{
		width: 200px;
		height: 40px;
		line-height: 20px;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 12px;
	}
	.time{
		width: 200px;
		height: 10px;
		line-height: 10px;
		font-size: 10px;
		color: gray;
	}
</style>