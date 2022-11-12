<template>
	<view>
		<!-- 
		  更多api，请前往：https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.html 
		  字体图标，微信小程序官方的确没有给出名称
		-->
		<view class="container">
			<editor id="editor" show-img-size :read-only="isEdit" show-img-resize show-img-toolbar class="ql-container"
			 :placeholder="placeholder" @statuschange="onStatusChange" @ready="onEditorReady">
			</editor>
		</view>

		<view class="toolbar" @touchend.stop="format" :style="'bottom: ' + (isIOS ? keyboardHeight : 0) + 'px'">
			<input style="width: 90%;text-align: start;margin-bottom: 1rem;margin-left: 1rem;" v-model="title" placeholder="标题"/>
			<i class="iconfont icon-charutupian" @touchend.stop="insertImage"></i>
			<i :class="'iconfont icon-format-header-1 ' + (formats.header === 1 ? 'ql-active' : '')" data-name="header"
			 :data-value="1"></i>
			<i :class="'iconfont icon-format-header-2 ' + (formats.header === 2 ? 'ql-active' : '')" data-name="header"
			 :data-value="2"></i>
			<i :class="'iconfont icon-format-header-3 ' + (formats.header === 3 ? 'ql-active' : '')" data-name="header"
			 :data-value="3"></i>
			<i :class="'iconfont icon-format-header-4 ' + (formats.header === 4 ? 'ql-active' : '')" data-name="header"
			 :data-value="4"></i>
			<i :class="'iconfont icon-format-header-5 ' + (formats.header === 5 ? 'ql-active' : '')" data-name="header"
			 :data-value="5"></i>
			<i :class="'iconfont icon-format-header-6 ' + (formats.header === 6 ? 'ql-active' : '')" data-name="header"
			 :data-value="6"></i>
			<i :class="'iconfont icon-zitijiacu ' + (formats.bold ? 'ql-active' : '')" data-name="bold"></i>
			<i :class="'iconfont icon-zitishanchuxian ' + (formats.strike ? 'ql-active' : '')" data-name="strike"></i>
			<i :class="'iconfont icon-zitixieti ' + (formats.italic ? 'ql-active' : '')" data-name="italic"></i>
			<i :class="'iconfont icon-zuoduiqi ' + (formats.align === 'left' ? 'ql-active' : '')" data-name="align" data-value="left"></i>
			<i :class="'iconfont icon-juzhongduiqi ' + (formats.align === 'center' ? 'ql-active' : '')" data-name="align"
			 data-value="center"></i>
			<i :class="'iconfont icon-youduiqi ' + (formats.align === 'right' ? 'ql-active' : '')" data-name="align" data-value="right"></i>
			<i :class="'iconfont icon-zuoyouduiqi ' + (formats.align === 'justify' ? 'ql-active' : '')" data-name="align"
			 data-value="justify"></i>
			<i :class="'iconfont icon-line-height ' + (formats.lineHeight ? 'ql-active' : '')" data-name="lineHeight" data-value="2"></i>
			<i :class="'iconfont icon-Character-Spacing ' + (formats.letterSpacing ? 'ql-active' : '')" data-name="letterSpacing"
			 data-value="2em"></i>
			<i :class="'iconfont icon-722bianjiqi_duanqianju ' + (formats.marginTop ? 'ql-active' : '')" data-name="marginTop"
			 data-value="20px"></i>
			<i :class="'iconfont icon-723bianjiqi_duanhouju ' + (formats.micon-previewarginBottom ? 'ql-active' : '')" data-name="marginBottom"
			 data-value="20px"></i>
			<i class="iconfont icon-clearedformat" @tap="removeFormat"></i>
			<i :class="'iconfont icon-font ' + (formats.fontFamily ? 'ql-active' : '')" data-name="fontFamily" data-value="Pacifico"></i>
			<i :class="'iconfont icon-fontsize ' + (formats.fontSize === '24px' ? 'ql-active' : '')" data-name="fontSize"
			 data-value="24px"></i>
			<i :class="'iconfont icon-text_color ' + (formats.color === fontColor ? 'ql-active' : '')" data-name="color"
			 :data-value="fontColor" @tap="open"></i>
			<i :class="'iconfont icon-fontbgcolor ' + (formats.backgroundColor === '#00ff00' ? 'ql-active' : '')" data-name="backgroundColor"
			 data-value="#00ff00"></i>
			<!-- 引用黄河浪的color取色器 -->
			<i class="iconfont icon-date" @tap="insertDate"></i>
			<i class="iconfont icon-undo" @tap="undo"></i>
			<i class="iconfont icon-redo" @tap="redo"></i>
			<i :class="'iconfont icon-zitixiahuaxian ' + (formats.underline ? 'ql-active' : '')" data-name="underline"></i>
			<i class="iconfont icon--checklist" data-name="list" data-value="check"></i>
			<i :class="'iconfont icon-youxupailie ' + (formats.list === 'ordered' ? 'ql-active' : '')" data-name="list"
			 data-value="ordered"></i>
			<i :class="'iconfont icon-wuxupailie ' + (formats.list === 'bullet' ? 'ql-active' : '')" data-name="list" data-value="bullet"></i>
			<!-- <i class="iconfont icon-outdent" data-name="indent" data-value="-1"></i> -->
			<!-- <i class="iconfont icon-indent" data-name="indent" data-value="+1"></i> -->
			<i class="iconfont icon-fengexian" @tap="insertDivider"></i>
			<!-- <i class="iconfont icon-preview" @tap="store" id="2"></i> -->
			<!-- <i :class="'iconfont icon-zitixiabiao ' + (formats.script === 'sub' ? 'ql-active' : '')" data-name="script"
			 data-value="sub"></i>
			<i :class="'iconfont icon-zitishangbiao ' + (formats.script === 'super' ? 'ql-active' : '')" data-name="script"
			 data-value="super"></i> -->
			<!-- <i class="iconfont icon-quanping"></i> -->
			<i class="iconfont icon-shanchu" @tap="clear"></i>
			<i :class="'iconfont icon-direction-rtl ' + (formats.direction === 'rtl' ? 'ql-active' : '')" data-name="direction"
			 data-value="rtl"></i>
			<i class="iconfont icon-baocun" @tap="store" id="1"></i>
		</view>
		<t-color-picker ref="colorPicker" :color="color" @confirm="confirm" @cancel="cancel"></t-color-picker>
	</view>
</template>

<script>
	import tColorPicke from '@/components/t-color-picker.vue';
	var _self;
	
	function guid() {
	    function S4() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    }
	    return (S4()+S4()+S4());
	}
	
	export default {
		components: {
			't-color-picker': tColorPicke
		},
		data() {
			return {
				color: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				isEdit: false,
				fontColor: '#000',
				formats: {},
				readOnly: false,
				placeholder: '在此输入内容',
				editorHeight: 300,
				keyboardHeight: 0,
				isIOS: false,
				title: ""
			};
		},
		onLoad() {
			_self = this;
			uni.getStorage({
				key: 'user',
				success: function (res) {
					_self.user = res.data
				}
			});
		},

		methods: {
			cancel() {
				this.isEdit = false;
			},
			open() {
				this.$refs.colorPicker.open();
				this.isEdit = true;
				// uni.hideKeyboard();
			},
			hideKey() {
				uni.hideKeyboard();
			},
			async confirm(e) {
				this.isEdit = false;
				this.fontColor = await e.hex;
				this.onStatusChange({
					detail: {
						color: e.hex
					}
				});
				this.$forceUpdate();
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context(function(res) {
					_self.editorCtx = res.context;
				}).exec();
			},
			undo() {
				this.editorCtx.undo();
			},
			redo() {
				this.editorCtx.redo();
			},
			blur() {
				this.editorCtx.blur();
			},
			format(e) {
				// this.hideKey();
				let {
					name,
					value
				} = e.target.dataset;
				if (!name) return; // console.log('format', name, value)
				this.editorCtx.format(name, value);
			},
			onStatusChange(e) {
				this.formats = e.detail;
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success');
					}
				});
			},
			//保存
			store(e) {
				let _self = this
				uni.getStorage({
					key: 'user',
					success() {
						let content;
						_self.editorCtx.getContents({
							success: function(res) {
								e.currentTarget.id == 1 ? console.log('保存内容:', res.html) : uni.navigateTo({
									url: `../preview/preview?rich=${encodeURIComponent(res.html)}`
								});
								content = res.html.toString();
							}
						});
						uni.showActionSheet({
							title: "以什么类型发表？",
							itemList: ["以帖子发表","以讨论发表"],
							success(res) {
								switch(res.tapIndex) {
									case 0:
										const sid = "s"+guid();
										console.log("share");
										uni.request({
											method: 'POST',
											url:"http://localhost:3000/api/content/post_content",
											data: {
												type: "share",
												data: {
													sid: sid,
													userid: _self.user.userid,
													title: _self.title,
													content: content,
													isDel: false
												}
											},
											success(res) {
												console.log(res);
											}
										});
										break;
									case 1:
										const tid = "t"+guid();
										const did = "d"+guid();
										uni.request({
											url: "http://localhost:3000/api/content/create_theme",
											method: "POST",
											data: {
												t_data: {
													tid: tid,
													title: _self.title,
													userid: _self.user.userid,
													isDel: false
												},
												d_data: {
													did: did,
													tid: tid,
													userid: _self.user.userid,
													content: content,
													attach_did: "",
													isDel: false
												}
											},
											async success(res){
												if(res.data.errCode === "OK-200"){
													console.log(res.data);
												}
											}
										})
										console.log("topic");
										break;
								}
								
								_self.title = "";
								_self.editorCtx.clear({
									success: function(res) {
										console.log("clear success");
									}
								});
								uni.switchTab({
									url: '../../pages/index/index'
								})	
								uni.showToast({
									title: '发送成功！',
									duration: 1500
								});
							},
							fail(res) {
								console.log(res);
							}
						});
					},
					fail: function (res) {
						uni.showToast({
							title: '未登录账号！',
							icon: 'none'
						})
					}
				});
			},

			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success");
					}
				});
			},

			removeFormat() {
				this.editorCtx.removeFormat();
			},

			insertDate() {
				const date = new Date();
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
				this.editorCtx.insertText({
					text: formatDate
				});
			},

			insertImage() {
				// const that = this;
				uni.chooseImage({
					count: 1,
					success: async function(res) {
						console.log("Chosen Image: ",res)
						await uni.uploadFile({
							url: 'http://localhost:3000/api/file/upload_file',
							filePath: res.tempFilePaths[0],
							name: 'file',
							success(res2) {
								console.log((JSON.parse(res2.data))[0]);
								const file_res = (JSON.parse(res2.data))[0];
								_self.editorCtx.insertImage({
									src: "http://localhost:3000/"+file_res.path,
									width: '80%',
									success: function(res) {
										console.log(res);
										console.log('insert image success');
									}
								});
							}
						});
					}
				});
			}
		}
	};
</script>
<style>
	@import "./editor.css";
</style>
