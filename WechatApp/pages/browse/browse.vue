<template>

	<view class="body">
<!-- 
		<view style="display: flex;align-items: center;">
			<h2>浏览</h2>
		</view> -->
		<uni-segmented-control current="0" :values="tags" @clickItem="onClickItem" styleType="button" activeColor="#FFCD1E"></uni-segmented-control>
		<div class="cardBox">
			<div class="card" v-for="(item, index) in cards">
				<div class="acc">
					<img class="cardHead" v-bind:src="item.user.headImg">
					<div class="id">
						<div class="cardName"><span>{{item.user.username}}</span></div>
						<div class="cardTime" style="color:gray;">{{item.post_date.slice(0,10) +' '+item.post_date.slice(11,16)}}</div>
					</div>
				</div>
				<view @click="navigateContent(item)">
					<view style="overflow: hidden; max-height: 20rem;" v-if="item.sid" v-html="item.content"></view>
					<view style="height: 3rem; line-height: 3rem; font-size: 1.5rem;" v-else>
						{{item.title}}
					</view>
				</view>
				<div class="option">
					<view class="optiona" @click="actionsClick('点赞')">
						<uni-icons type="heart" size="18" color="#999"></uni-icons>
						<text class="card-actions-item-text">点赞</text>
					</view>
					<view class="optiona" @click="actionsClick('转发')">
						<uni-icons type="redo" size="18" color="#999"></uni-icons>
						<text class="card-actions-item-text">转发</text>
					</view>
				</div>
				<!-- {{JSON.stringify(item)}} -->
				<!-- <div>
					<div class="acc">
						<img class="cardHead" v-bind:src="item.headimg">
						<div class="id">
							<div class="cardName"><span>{{item.name}}</span></div>
							<div class="cardTime" style="color:gray;">{{item.time}}</div>
						</div>
					</div>
					<div class="content">
						<rich-text :nodes="item.content"></rich-text>
					</div>
					<div class="img">
						<div class="cardImg-big">
							<img :src="item.img">
						</div>
					</div>
					<div class="option">
						<view class="optiona" @click="actionsClick('点赞')">
							<uni-icons type="heart" size="18" color="#999"></uni-icons>
							<text class="card-actions-item-text">点赞</text>
						</view>
						<view class="optiona" @click="actionsClick('转发')">
							<uni-icons type="redo" size="18" color="#999"></uni-icons>
							<text class="card-actions-item-text">转发</text>
						</view>
					</div>
				</div> -->
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cards: [],
				list: [{
					name: '十年'
				}, {
					name: '青春'
				}, {
					name: '之约'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				tags: ["帖子", "主题"],
				type: "share"
			}
		},
		methods: {
			actionsClick(text) {
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				
			},
			onClickItem(e){
				console.log(e.currentIndex);
				switch(e.currentIndex){
					case 0:this.type="share";break;
					case 1:this.type="topic";break;
				}
				this.request();
			},
			navigateContent(i){
				const item = {id: (i.sid ? i.sid : i.tid)};
				uni.navigateTo({
					url: '../../pages/tiezi/tiezi?item=' + JSON.stringify(item)
				});
			},
			request(){
				const self = this;
				const url = "http://localhost:3000/api/content/list";
				uni.request({
					url: url,
					method: 'POST',
					data: {
						type: this.type
					},
					success(res) {
						if(res.data.errCode === "OK-100"){
							self.cards = res.data.data;
						}
					}
				})
			}
		},
		onLoad() {
			this.request();
		},
		onPullDownRefresh() {
			this.request();
		},
	}
</script>

<style>
	.cardBox {
		background-color: rgb(248, 243, 243);
		min-height: 60%;
	}

	.card {
		width: 100%;
		margin-bottom: 2rem;
		background-color: white;
	}

	.acc {
		width: 100%;
		height: 80px;
	}

	.cardHead {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		margin-top: 10px;
		margin-left: 20px;
		float: left;
	}

	.cardName {
		width: 60%;
		height: 20px;
		float: left;
		margin-top: 10px;
		margin-left: 20px;
	}

	.cardTime {
		width: 60%;
		height: 20px;
		float: left;
		margin-top: 20px;
		margin-left: 20px;
		font-size: 13px;
	}

	.content {
		width: 97%;
		margin-left: 3%;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.img {
		width: 100%;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.cardImg-big,
	.cardImg-small {
		padding: 0.5rem;
	}

	.cardImg-big img {
		max-width: 100%;
	}

	.cardImg-small img {
		width: 100%;
	}

	.cardImg-Small {
		height: 31vw;
		width: 31vw;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.option {
		text-align: center;
		height: 2rem;
		line-height: 2rem;
	}

	.optiona {
		float: left;
		width: 50%;

	}
</style>
