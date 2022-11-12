<template>
	<view >
		<view class="" style="background-color: white;">
			<view class="title">
				{{content.main.title}}
			</view>
			<view class="userbox" >
				<img :src="content.main.user.headImg" class="headimg">
				<view class="name">{{content.main.user.username}}</view>
				<view class="time">{{content.main.post_date}}</view>
			</view>
			<!-- share -->
			<view style="width: 100%;" v-html="content.main.content" ></view>
			<!-- topic - main discuss -->
			<!-- <rich-text class="htmlbox" :nodes="html"></rich-text> -->
			<view class="share">浏览量：200000&nbsp;&nbsp;&nbsp;&nbsp;!允许规范转载</view>
			<button @click="showNotify(detail.id.slice(0,1) === 's' ? content.main.sid : content.main.tid)">举报</button>
		</view>
		
		<view class="plq">{{detail.id.slice(0,1) === "s" ? "评论区" : "讨论"}}</view>
		<view class="pinglun">
			<view class="card" v-for="(item, index) in pl" :key="index">
				<view class="pbox">
					<img class="phead" :src="item.user.headImg">
					<view class="pname">{{item.user.username}}</view>
					<view class="ptime">
						{{index+1+'F'}}
						&nbsp;
						{{item.post_date.slice(0,10) +' '+item.post_date.slice(11,16)}}
					</view>				
				</view>
				<!-- comment -->
				<view class="pcontent">
					<!-- <img :src="item." alt=""> -->
					<p v-if="detail.id.slice(0,1) === 's'">{{item.content}}</p>
					<view v-else v-html="item.content"></view>
					<button @click="showNotify(detail.id.slice(0,1) === 's' ? item.cid : item.did)">举报</button>
				</view>
				<!-- discuss -->
				<div class="clear" style="clear: both;"></div>
			</view>
		</view>
		<view style="width: 100%;height: 50px;color: gray;text-align: center;line-height: 20px;
		font-size: 12px;">---暂无更多---</view>
		<view class="bottombar">
			<input  class="bottom-input" type="text" placeholder="发一条友善的评论吧" @click="inputOpen" adjust-position="true" v-model="text"/>
			<!-- <button class="bottom-bt">发送</button> -->
			<view class="bottom-add">
				<uni-icons type="hand-up" size="30" style="margin:7rpx" @click="actionsClick('点踩')"></uni-icons>
				<span></span>
				<uni-icons type="hand-down" size="30" style="margin:7rpx" @click="actionsClick('点赞')"></uni-icons>
				<span></span>
				<uni-icons type="redo" size="30" style="margin:7rpx" @click="actionsClick('分享')"></uni-icons>
			</view>
			<uni-popup ref="popup" type="bottom" background-color="#fff">
				<view class="comment-text" v-if="detail.id.slice(0,1) === 's'">
					<textarea class="text-area" placeholder="请发一条友善的评论" v-model="text"></textarea>
					<button @click="send(`comment`)">发送</button>
				</view>
				<view v-else>
					<textarea class="text-area" placeholder="讨论" v-model="text"></textarea>
					<button @click="send(`discuss`)">发送</button>
				</view>
			</uni-popup>
			<uni-popup ref="notify" type="bottom" backgroundColor="#fff">
				<h2>举报理由</h2>
				<radio-group @change="showReason">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in reasons" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === curSelect" />{{item.name}}
						</view>
					</label>
				</radio-group>
				<textarea v-model="other_reason"></textarea>
				<button @click="sendNotify()">发送</button>
			</uni-popup>
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
				plcnt:'',
				notify_refer: "",
				detail: {},
				content: {},
				newpl:{},
				// comment or discuss
				pl:[],
				text: "",
				user:[],
				reasons: [
					{
						value: '与话题无关',
						name: '与话题无关',
						checked: 'true'
					},
					{
						value: '违反法律',
						name: '违反法律'
					},
					{
						value: '内容不适',
						name: '内容不适'
					},
					{
						value: '引战',
						name: '引战'
					},
					{
						value: '其他',
						name: '其他'
					},
				],
				curSelect: 0,
				other_reason: "",
			}
		},
		methods: {
			send(type){
				let self = this
				uni.getStorage({
					key: 'user',
					success() {
						const tmp_id = type === "comment" ? "c" + guid() : "d" + guid();
						const d =  type === "comment" ? {
							cid: tmp_id,
							sid: self.content.main.sid
						} : {
							did: tmp_id,
							tid: self.content.main.tid
						}
						
						uni.request({
							url: "http://localhost:3000/api/content/post_content",
							method: "POST",
							data: {
								type: type,
								data: {
									...d,
									userid: self.user.userid,
									content: self.text,
									isDel: false,
								}
							},
							success(res) {
								if(res.data.errCode === "OK-200"){
									uni.showToast({
										title: "发表成功",
										icon: 'success'
									});
									self.request();
								}
							},
							complete() {
								self.$refs.popup.close();
								self.text = '';
							}
						})
					},
					fail: function (res) {
						uni.showToast({
							title: '未登录账号！',
							icon: 'none'
						})
					}
				});
				
				// self.newpl = {}
			},
			inputOpen() {
				this.$refs.popup.open('bottom');
			},
			showNotify(id){
				this.notify_refer = id;
				console.log(this.notify_refer);
				this.$refs.notify.open('bottom');
			},
			onPullDownRefresh() {
				console.log('下拉刷新成功')
				setTimeout(function() {
					uni.stopPullDownRefresh()
					console.log('停止刷新')
				}, 1000)
			},
			actionsClick(){
				uni.showToast({
				  title: '点赞成功！',
				})
			},
			showReason(evt){
				console.log(evt.detail.value);
				for (let i = 0; i < this.reasons.length; i++) {
					if (this.reasons[i].value === evt.detail.value) {
						this.curSelect = i;
						break;
					}
				}
			},
			sendNotify(){
				let rtmp = ""; 
				const self = this;
				if(this.curSelect === this.reasons.length -1 && this.other_reason !== ""){
					console.log("其他原因:", this.other_reason);
					rtmp = this.other_reason;
				}
				else{
					console.log("固定原因:", this.reasons[this.curSelect].value);
					rtmp = this.reasons[this.curSelect].value;
				}
				
				uni.request({
					url:"http://localhost:3000/api/manage/post_notify",
					method: 'POST',
					data: {
						notify_id: "n" + guid(),
						userid: self.user.userid,
						refer_to: self.notify_refer,
						content: rtmp
					},
					success(res) {
						console.log(res);
						if(res.data.errCode === "OK-100"){
							uni.showToast({
								title: "举报成功。",
								icon: 'success'
							});
						}
						else {
							uni.showToast({
								title: "出了一点问题。",
								icon: 'error'
							});
						}
					},
					fail() {
						uni.showToast({
							title: "出了一点问题。",
							icon: 'error'
						});
					},
					complete() {
						self.$refs.notify.close();
					}
				})
			},
			request(){
				let _self = this;
				const url = "http://localhost:3000/api/content/get_content/"+_self.detail.id;
				console.log(url);
				uni.request({
					url: url,
					method: "GET",
					success(res) {
						console.log(res.data.data);
						// _self.html = res.data.data.main.content;
						_self.content = res.data.data;
						_self.content.main.post_date = _self.content.main.post_date.slice(0,10) +' '+_self.content.main.post_date.slice(11,16);
						_self.pl = (_self.detail.id).slice(0,1) === 's' ? 
							_self.content.comments :
							_self.content.discusses;
						console.log(_self.content);
					}
				});
			}
		},
		async onLoad(option) {
			// 问题：当content包含图片时，无法完整传入
			let _self = this 
			if(option.item){
				_self.detail = JSON.parse(option.item)
				console.log("12312312")
				console.log(_self.detail)
			}
			// console.log(_self.content)
			
			await uni.getStorage({
				key: 'user',
				success: function (res) {
					_self.user = res.data
				}
			});
			this.request();
			// uni.request({
			// 	url: url,
			// 	method: "GET",
			// 	success(res) {
			// 		console.log(res.data.data);
			// 		// _self.html = res.data.data.main.content;
			// 		_self.content = res.data.data;
			// 		_self.content.main.post_date = _self.content.main.post_date.slice(0,10) +' '+_self.content.main.post_date.slice(11,16);
			// 		_self.pl = (_self.detail.id).slice(0,1) === 's' ? 
			// 			_self.content.comments :
			// 			_self.content.discusses;
			// 		console.log(_self.content);
			// 	}
			// });
		},
	}
</script>

<style>
	@import "../message/editor.css";
	// 底部输入框弹窗box
	.bottombar{
		width: 100%;
		background-color: white;
		z-index: 1000;
		border-top: 1px solid #bebebe;
		box-sizing: border-box;
		bottom: 0;
		position: fixed;
	}
	.bottom-input{
		width: 60%;
		height: 26px;
		background-color: #dcdcdc;
		margin-left: 2%;
		float: left;	
	}
	.bottom-bt{
		font-size: 12px;
		width: 20%;
		height: 26px;
		float: left;
	}
	.bottom-add{
		width: 35%;
		height: 26px;
		float: left;
		padding-left: 3%;
	}
	// 弹窗
	.comment-text{
		width: 100%;
		
	}
	.text-area{
		margin: 2%;
		width: 96%;
		background-color: #e8e8e8;
	}

	.share{
		width: 96%;
		height: 18px;
		line-height: 18px;
		margin-top: 5px;
		margin-left: 2%;
		color: gray;
		font-size: 12px;
	}
	.pcontent{
		width: 80%;
		padding-left: 60px;
		float: left;
		/* line-height: 22px; */
		padding-bottom: 5px;
		word-break:break-all;
		/* background-color: yellow; */
	}
	.pname{
		width: 80%;
		height: 25px;
		line-height: 25px;
		margin-left: 10px;
		margin-top: 10px;
		float: left;
	}
	.ptime{
		width: 80%;
		height: 25px;
		line-height: 25px;
		margin-left: 10px;
		float: left;
		color: gray;
		font-size: 12px;
	}
	.pbox{
		width: 100%;
		height: 60px;
		float: left;
		/* background-color: aqua; */
	}
	.phead{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-left: 10px;
		margin-top: 10px;
		float: left;
		
	}
	.card{
		width: 96%;
		margin-bottom: 10px;
		/* border-bottom: 1px gray solid; */
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
		border-radius: 5px;
	}
	.pinglun{
		width: 100%;
		/* height: 400px; */
		padding-left: 2%;
	}
	.plq{
		width: 96%;
		height: 30px;
		line-height: 30px;
		margin-left: 2%;
		/* border-top: 1px gray solid; */
		/* border-bottom: 1px gray solid; */
	}
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
	.title{
		width: 100%;
		height: 40px;
		padding-left: 10px;
		padding-right: 10px;
		line-height: 30px;
		font-weight: bold;
		font-size: 20px;
	}
	.userbox{
		width: 100%;
		height: 50px;
		/* background-color: aqua; */
	}
	.headimg{
		border-radius: 50%;
		width: 40px;
		height: 40px;
		margin-top: 5px;
		margin-left: 10px;
		float: left;
	}
	.name{
		width: 70%;
		height: 25px;
		line-height: 25px;
		margin-left: 10px;
		float: left;
		
	}
	.time{
		width: 70%;
		height: 25px;
		line-height: 25px;
		margin-left: 10px;
		float: left;
		color: gray;
		font-size: 12px;
	}
	.htmlbox{
		width: 100%;
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
