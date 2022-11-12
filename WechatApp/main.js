
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 购物车
Vue.prototype.gwc = []
// 获取购物车数据
Vue.prototype.hqgwcsj = function(){
	return this.gwc
}
// // 购物车中被选中的商品
// Vue.prototype.gwcxz = []
// // 点击结算
// Vue.prototype.djjs = function(){
// 	for(let i=0;i<this.gwc.length;i++){
// 		if(this.gwc[i].flag){
// 			this.gwcxz.push(this.gwc[i])
// 		}else{
// 			console.log('没有被选中')
// 		}
// 	}
// 	console.log(this.gwcxz)
// 	return this.gwcxz
// }
//订单【】
// Vue.prototype.cshdd = function(){
// 	this.gwcxz=[]
// 	return this.gwcxz
// }
// 加入购物车数据
Vue.prototype.jrgwcsj = function(item){
	// item['num']=1
	// item['flag']=true
	let flag = this.gwc.some(i => i.id===item.id )
	if(flag){
		for(let i =0;i<this.gwc.length;i++){
			if(this.gwc[i].id===item.id){
				this.gwc[i].num+=1
			}
		}
	}else{
		this.gwc.push(item)
		this.$set(this.gwc[this.gwc.length-1],'num',1)
		this.$set(this.gwc[this.gwc.length-1],'flag',1)
		console.log(this.gwc)
	}
	return this.gwc
}
const app = new Vue({
    ...App,
	beforeCreate() {
		Vue.prototype.$bus = this
	},
	
	
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif