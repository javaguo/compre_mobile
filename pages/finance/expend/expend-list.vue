<template>
    <view class="com_page com_layout_column">
        <page-head :title="title"></page-head>
		<view class="com_form com_form_bottom" >
			<form>
			<view class="com_form_row">
				<picker mode="date" name="expDate" :value="expDate"  @change="bindDateChange($event,'expDate')" @cancel="cancelDate($event,'expDate')">
					<view class="com_form_input com_form_date" >{{expDate}}</view>
				</picker>
				
				<view class="com_form_input com_form_type" :class="typeAddTipClass ? 'com_placeholder' : ''"
					  @click="selectType($event,'typeAdd')">{{typeAddText}}</view>
				<mpvue-picker :themeColor="themeColor" ref="typeAddPicker" :mode="typeMode" :deepLength="typeDeepLength" 
						:pickerValueDefault="typeAddSelectedIndex"  :pickerValueArray="typeValueArray"
						@onConfirm="typeOnConfirm($event,'typeAdd')" @onCancel="typeOnCancel($event,'typeAdd')" >
				</mpvue-picker>
				
				<input class="com_form_input com_form_sum" placeholder-class="com_placeholder" type="digit" 
					:maxlength="sumMaxLength" placeholder="金额"  v-model.trim="sumAdd"/>
			 </view>
			 <view class="com_form_row">
			 	<input class="com_form_input com_form_remark" placeholder-class="com_placeholder" placeholder="备注" :maxlength="remarkMaxLength"
					v-model.trim="remark"/>
				<button class="com_form_save" @click="save">保存</button>
			  </view>
			  </form>
		</view>
		
		<view class="com_form" >
			<view class="com_form_row">
				<picker mode="date" name="expDateStart" :value="expDateStart"  @change="bindDateChange($event,'expDateStart')" >
					<view class="com_form_input com_form_date" >{{expDateStart}}</view>
				</picker>
				<view class="com_form_text">-</view>
				<picker mode="date" name="expDateEnd" :value="expDateEnd"  @change="bindDateChange($event,'expDateEnd')" >
					<view class="com_form_input com_form_date" >{{expDateEnd}}</view>
				</picker>
				
				<view class="com_form_input com_form_type" :class="typeQueryTipClass ? 'com_placeholder' : ''"
					@click="selectType($event,'typeQuery')">{{typeQueryText}}</view>
				<mpvue-picker :themeColor="themeColor" ref="typeQueryPicker" :mode="typeMode" :deepLength="typeDeepLength" 
						:pickerValueDefault="typeQuerySelectedIndex"  :pickerValueArray="typeValueArray"
						@onConfirm="typeOnConfirm($event,'typeQuery')" @onCancel="typeOnCancel($event,'typeQuery')" >
				</mpvue-picker>
				
			 </view>
			 <view class="com_form_row">
			 	<input class="com_form_input com_form_sum_q" placeholder-class="com_placeholder" type="digit" :maxlength="sumMaxLength" placeholder="最小金额"
					v-model.trim="sumStart" @blur="sumBlur($event,'sumMin')"/>
				<view class="com_form_text">-</view>
			 	<input class="com_form_input com_form_sum_q" placeholder-class="com_placeholder" type="digit" :maxlength="sumMaxLength" placeholder="最大金额" 
					v-model.trim="sumEnd" @blur="sumBlur($event,'sumMax')"/>
			 	<input class="com_form_input com_form_remark" placeholder-class="com_placeholder" placeholder="备注" :maxlength="remarkMaxLength" 
					v-model.trim="remarkQuery"/>
				<button class="com_form_save" @click="loadList($event,'query')">查询</button>
			  </view>
		</view>
		
        <view class="">
			<scroll-view class="com_list_scroll" scroll-y="true" @scrolltolower="loadMoreData">
            <block v-for="(item,index) in lists" :key="index">
                    <view class="com_list" >
						<view class="com_list_row com_list_row_top" >
							<view class="list_text list_date">{{item.expDate}}</view>
							<view class="list_text list_type1 uni-ellipsis">{{item.expendParentTypeName}}</view>
							<view class="list_text list_type2 uni-ellipsis">{{item.fkExpendTypeId}}</view>
							<view class="list_text list_sum uni-ellipsis">{{item.expSum}}</view>
						</view>
						<view class="com_list_row">
							<view class="list_text list_row2_column1">备注：</view>
							<view class="list_text list_row2_column2 uni-ellipsis" >{{item.remark}}</view>
							<view class="list_icon">
								<image class="list-icon_img" src="../../../static/img/common/editor32.png"></image>
							</view>
							<view class="list_icon">
								<image class="list-icon_img" src="../../../static/img/common/delete32.png" @click="deleteData($event,item)"></image>
							</view>
							<view class="list_icon">
								<image class="list-icon_img" src="../../../static/img/common/view32.png"></image>
							</view>
						</view>	
                    </view>
            </block>
			</scroll-view>
		</view>
    </view>
</template>

<script>
	import config from '../../../resource/js/app/config.js';
	import service from '../../../service.js';
	import mpvuePicker from '../../../components/mpvue-picker/mpvuePicker.vue';
	import cityData from '../../../common/city.data.js';
	import expendType from '../../../common/account_expend_type.js';
	import {vSum} from '../../../resource/js/utils/regex.js';
	import {
	    mapState,
	    mapMutations
	} from 'vuex';
	
    export default {
		components: {
			mpvuePicker
		},
        data() {
			const currentDate = this.getDate({
				format: true
			});
			const constTypeTip = "支出类型";// 只在下面的return块里使用
			const constSumMinVal = 0;
			const constSumMaxVal = 100000000;
            return {
				/* pageConst:{
					typeTip:'支出类型'
				}, */
				themeColor: '#007AFF',
                title: '收入列表',
				layout:{
					form:{show: true},
					list:{show: false}
				},
				lists: [],
				expDate: currentDate,
				expDateStart: currentDate,
				expDateEnd: currentDate,
				// mulLinkageTwoPicker: cityData,
				// pickerValueDefault: [0],
				// pickerValueArray: [],
				typeValueArray: expendType,
				typeMode: 'multiLinkageSelector',
				typeDeepLength: 2,
				typeTip:constTypeTip,
				typeAddSelectedIndex: [0, 0],
				typeQuerySelectedIndex: [0, 0],
				typeAddText: constTypeTip,
				typeQueryText: constTypeTip,
				typeAddValue: '',
				typeQueryValue: '',
				typeAddTipClass:true,
				typeQueryTipClass:true,
				sumMaxLength:11,
				sumMinVal:constSumMinVal,
				sumMaxVal:constSumMaxVal,
				sumMaxValStr:'1亿',
				sumAdd:'',
				sumStart:'',
				sumEnd:'',
				remark: '',
				remarkQuery: '',
				remarkMaxLength:100,
				
				page:1,
				duration:3000
            }
        },
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		computed: mapState(['loginName','hasLogin','token']),
		methods: {
			// 控制面板收缩
			trigerCollapse(layout) {
			    if (layout=="form"){
					this.layout.form.show = !this.layout.form.show;
				}
			},
			// 日期相关方法开始
			bindDateChange: function(e,elementId) {
				if ("expDate"==elementId){
					this.expDate = e.target.value;
				}else if ("expDateStart"==elementId){
					this.expDateStart = e.target.value;
				}else if ("expDateEnd"==elementId){
					this.expDateEnd = e.target.value;
				}
			},
			cancelDate:function (e,id){// 设计为时间不能取消
				/* if ("expDate"==id){
					this.expDateTip = true;
					this.expDate = this.datePlaceholder;
				}else{
					
				} */
			},
			getDate(type) {
				const date = new Date();
		
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
		
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
		
				return `${year}-${month}-${day}`;
			},
			// 日期相关方法结束
			// 二级联动选择支出类型
			selectType(e,ref) {
				uni.hideKeyboard();
				// this.pickerValueArray = this.mulLinkageTwoPicker
				// this.mode = 'multiLinkageSelector'
				// this.deepLength = 2
				// this.pickerValueDefault = [0, 0]
				if ("typeAdd"==ref){
					this.$refs.typeAddPicker.show();
					
				}else if ("typeQuery"==ref){
					this.$refs.typeQueryPicker.show();
				}
			},
			typeOnConfirm(e,elementId) {
				console.log("JSON.stringify(e)："+JSON.stringify(e));
				let selectedObj = expendType[e.index[0]].children[e.index[1]];
				let selectedVal = selectedObj.value;
				let selectedLabel = selectedObj.label;
				
				//console.log("JSON.stringify(e)："+JSON.stringify(e));
				if ("typeAdd"==elementId){
					console.log("typeAdd："+JSON.stringify(e));
					// this.typeAddText = JSON.stringify(e);
					this.typeAddValue = selectedVal;
					this.typeAddText = selectedLabel;
					this.typeAddTipClass = false;
				}else if ("typeQuery"==elementId){
					console.log("typeQuery："+JSON.stringify(e));
					// this.typeQueryText = JSON.stringify(e);
					
					console.log("typeQueryaaa："+selectedObj.label);
					// cityData[e.index[0]][e.index[1]];
					this.typeQueryValue = selectedVal;
					this.typeQueryText = selectedLabel;
					this.typeQueryTipClass = false;
				}
			},
			typeOnCancel(e,elementId) {
				this.clearType(elementId);
			},
			sumBlur(e,eleId){
				// console.log("sumBlur："+eleId);
			},
			loadList(e,opeType){
				if ("query"==opeType){
					this.lists = [];
				}
				
				// 加载列表
				uni.showLoading({title: '加载中...',mask:true});
				let reqURL = config.SERVER_URL+"m/expend/searchData.do";
				uni.request({url:reqURL,
							data:{loginName : this.loginName,token : this.token,page:this.page,limit:config.PAGE_SIZE},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								let tempItem = res.data.items;
								if (tempItem && tempItem.length>0){
									for (let i = 0; i < tempItem.length; i++) {
										this.lists.push(tempItem[i]);
									}
								}else{
									uni.showToast({title:'暂无数据！',icon:'none',duration:this.duration});
								}
							},fail: (res) => {
								uni.showToast({title:'加载列表失败！',icon:'none',duration:this.duration+2000});
							},complete: (res) => {
								uni.hideLoading();
							}
						});
			},
			loadMoreData(){
				this.page++;
				this.loadList(null,"more");
			},
			save(){
				/* console.log("this.expDate："+this.expDate); */
				/* console.log("this.typeAddValue："+this.typeAddValue); */
				/* console.log("this.sumAdd："+this.sumAdd);
				console.log("this.remark："+this.remark); */
				if ( this.expDate==null || this.expDate=='' || this.expDate.length==0){
					uni.showToast({title:'请选择支出日期！',icon:'none',duration:this.duration});
					return;
				}
				
				if ( this.typeAddValue.length==0){
					uni.showToast({title:'请选择支出类型！',icon:'none',duration:this.duration});
					return;
				}
				
				
				if (this.sumAdd==null || this.sumAdd==''){
					uni.showToast({title:'请填写支出金额！',icon:'none',duration:this.duration});
					return;
				}
				/* if (!vSum(this.sumAdd) || this.sumAdd<=this.sumMinVal || this.sumAdd>=this.sumMaxVal ){
					uni.showToast({title:'请填写正确的金额！支出金额应大于'+
										this.sumMinVal+'且小于'+this.sumMaxValStr,
									icon:'none',duration:this.duration+2000});
					return;
				} */
				if (this.sumAdd<=this.sumMinVal || this.sumAdd>=this.sumMaxVal ){
					uni.showToast({title:'请填写正确的金额！支出金额应大于'+
										this.sumMinVal+'且小于'+this.sumMaxValStr,
									icon:'none',duration:this.duration+2000});
					return;
				}
				
				uni.showLoading({title: '正在保存...',mask:true});
				let tempURL = config.SERVER_URL+"m/expend/save.do";
				uni.request({url:tempURL,
							data:{loginName : this.loginName,token : this.token,
									expDate:this.expDate,fkExpendTypeId:this.typeAddValue,
									expSum:this.sumAdd,remark:this.remark},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								if (res.data.success){
									this.clearAddForm();
									uni.showToast({title:'保存成功！',icon:'none',duration:this.duration});
								}else{
									uni.showToast({title:'保存失败！'+JSON.stringify(res.data.msg),icon:'none',duration:this.duration+500});
								}
							},fail: (res) => {
								uni.showToast({title:'保存支出请求失败！',icon:'none',duration:this.duration+500});
							},complete: (res) => {
								uni.hideLoading();
							}
						});
				
			},
			deleteData(e,item){
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({title: '正在删除...',mask:true});
							
							let reqURL = config.SERVER_URL+"m/expend/delete.do";
							uni.request({url:reqURL,
										data:{loginName : this.loginName,token : this.token,ids:item.id},
										dataType:'json',
										method:'POST',
										header: {'content-type': 'application/x-www-form-urlencoded'},
										success: (res) => {
											if (res.data.success){
												uni.showToast({title:'删除成功！',icon:'none',duration:this.duration});
												this.loadList(null,'query');
											}else{
												uni.showToast({title:'删除失败！'+res.data.msg,icon:'none',duration:this.duration+5000});
											}
										},fail: (res) => {
											uni.showToast({title:'删除失败！',icon:'none',duration:this.duration+2000});
										},complete: (res) => {
											uni.hideLoading();
										}
									});
						} else if (res.cancel) {
							
						}
					}
				});
			},
			clearAddForm(){
				this.clearType("typeAdd");
				this.sumAdd='';
				this.remark='';
			},
			clearType(type){
				if ("typeAdd"==type){
					this.typeAddValue = '';
					this.typeAddText = this.typeTip;
					this.typeAddTipClass = true;
				}else if ("typeQuery"==type){
					this.typeQueryValue = '';
					this.typeQueryText = this.typeTip;
					this.typeQueryTipClass = true;
				}
			},toLoginPage(){
				uni.navigateTo({
				    url: '../../login/login'
				});
			}
		},
		onBackPress() {
			if (this.$refs.typeAddPicker.showPicker) {
				this.$refs.typeAddPicker.pickerCancel();
				return true;
			}
			if (this.$refs.typeQueryPicker.showPicker) {
				this.$refs.typeQueryPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.typeAddPicker.showPicker) {
				this.$refs.typeAddPicker.pickerCancel();
			}
			if (this.$refs.typeQueryPicker.showPicker) {
				this.$refs.typeQueryPicker.pickerCancel();
			}
		},
        onLoad() {
			if (!this.hasLogin) {
			    this.toLoginPage();
			}
			this.loadList(null,"query");
        }
    }
</script>

