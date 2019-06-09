<template>
    <view class="com_page com_layout_column">
        <page-head :title="title"></page-head>
		
	<!-- 固定高度区域开始 -->
	<view id="fix_height_view">	
		<!-- 表单添加区域开始 -->
		<view class="com_form" >
			<form>
			<view class="com_form_row">
				<picker mode="date" name="recDate" :value="recDate"  @change="bindDateChange($event,'recDate')" @cancel="cancelDate($event,'recDate')">
					<view class="com_form_input com_form_date" >{{recDate}}</view>
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
				<button class="com_form_save" @click="clearAddForm">清空</button>
				<button class="com_form_save" @click="save">保存</button>
			  </view>
			  </form>
		</view>
		<!-- 表单添加区域结束 -->
		
		<view class="com_line com_line_color2"></view>
		
		<!-- 列表查询区域开始 -->
		<view class="com_form" >
			<view class="com_form_row">
				<picker mode="date" name="recDateStart" :value="recDateStart"  @change="bindDateChange($event,'recDateStart')" >
					<view class="com_form_input com_form_date" >{{recDateStart}}</view>
				</picker>
				<view class="com_form_text">-</view>
				<picker mode="date" name="recDateEnd" :value="recDateEnd"  @change="bindDateChange($event,'recDateEnd')" >
					<view class="com_form_input com_form_date" >{{recDateEnd}}</view>
				</picker>
				
				<view class="com_form_input com_form_full" :class="typeQueryTipClass ? 'com_placeholder' : ''"
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
				<button class="com_form_save" @click="clearQueryForm">清空</button>	
				<button class="com_form_save" @click="loadList($event,'query')">查询</button>
			  </view>
		</view>
		<!-- 列表查询区域结束 -->
	
		<view class="uni-flex uni-row list_top" style="justify-content: space-between;">
			<view class = "list_top_title">列表：</view>
			<view class = "list_top_statistic_sum">总计：{{listSum}}</view>
		</view>
	</view>
	<!-- 固定高度区域结束 -->	
		
	<!-- 列表区域开始 -->
	<scroll-view :style="{height:list_scroll_height+'px'}" scroll-y="true" @scrolltolower="loadMoreData">
		<view v-show="listShowNoDataTip" class="com_list com_list_tip">暂无数据！</view>
		
        <block v-for="(item,index) in list.data" :key="index">
                <view class="com_list" >
					<view class="com_list_row com_list_row_top" >
						<view class="list_text list_date">{{item.recDate}}</view>
						<view class="list_text list_type1 uni-ellipsis">{{item.receiptsParentTypeName}}</view>
						<view class="list_text list_type2 uni-ellipsis">{{item.fkReceiptsTypeId}}</view>
						<view class="list_text list_sum uni-ellipsis">{{item.recSum}}</view>
					</view>
					<view class="com_list_row">
						<view class="list_text list_row2_column1">备注：</view>
						<view class="list_text list_row2_column2 uni-ellipsis com_form_full" >{{item.remark}}</view>
						<view class="list_icon">
							<image class="list-icon_img" src="../../../static/img/common/editor32.png" @click="editData($event,item)"></image>
						</view>
						<view class="list_icon">
							<image class="list-icon_img" src="../../../static/img/common/delete32.png" @click="deleteData($event,item)"></image>
						</view>
						<view class="list_icon">
							<image class="list-icon_img" src="../../../static/img/common/view32.png" @click="viewData($event,item)"></image>
						</view>
					</view>	
                </view>
        </block>
	</scroll-view>
	<!-- 列表区域结束 -->
</view>
</template>

<script>
	import config from '../../../resource/js/app/config.js';
	import appCommon from '../../../resource/js/app/common.js';
	import {vSum} from '../../../resource/js/utils/regex.js';
	
	import mpvuePicker from '../../../components/mpvue-picker/mpvuePicker.vue';
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
			const startDate = this.getDate('start');
			const endDate = this.getDate('end');
			const constTypeTip = "收入类型";// 只在下面的return块里使用
			const constSumMinVal = 0;
			const constSumMaxVal = 100000000;
            return {
				beanId:'',
				// 日期相关
				recDate: currentDate,
				recDateStart: startDate,
				recDateEnd: endDate,
				// 类型级联公共属性
				typeValueArray: [],
				typeMode: 'multiLinkageSelector',
				typeDeepLength: 2,
				typeTip:constTypeTip,
				typeAddSelectedIndex: [0, 0],// 类型级联添加区域使用
				typeAddText: constTypeTip,
				typeAddValue: '',
				typeAddTipClass:true,
				typeQuerySelectedIndex: [0, 0],// 类型级联查询区域使用
				typeQueryText: constTypeTip,
				typeQueryValue: '',
				typeQueryTipClass:true,
				// 金额相关
				sumMaxLength:11,
				sumMinVal:constSumMinVal,
				sumMaxVal:constSumMaxVal,
				sumMaxValStr:'1亿',
				sumAdd:'',
				sumStart:'',
				sumEnd:'',
				// 备注相关
				remarkMaxLength:100,
				remark: '',
				remarkQuery: '',
				
				list_scroll_height:'',
				listSum: '',
				// lists: [],
				list:{// 列表展示使用
					data:[],
					hasLoadedData:false,
					isLastPage:false
				},
				listShowNoDataTip:false,// 有些地方不能用list.listShowNoDataTip  先放到list外面
				// 配置相关
				title: '收入列表',
				themeColor: config.PICKER_THEME_COLOR,
				page:1,
				layout:{
					form:{show: true},
					list:{show: false}
				}
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
			/**
			 * 统计列表总和
			 */
			statisticSum(){
				let reqURL = config.SERVER_URL+"m/receipts/statisticSum.do";
				uni.request({url:reqURL,
							data:{loginName : this.loginName,token : this.token,
								  recDateStart:this.recDateStart,recDateEnd:this.recDateEnd,fkReceiptsTypeId:this.typeQueryValue,
								  expSumStart:this.sumStart,expSumEnd:this.sumEnd,remark:this.remarkQuery},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								if (res.data.success){
									if (res.data.statisticSum!=null && res.data.statisticSum!=""){
										this.listSum = res.data.statisticSum;	
									}else{
										this.listSum = "-";
									}
								}
							},fail: (res) => {
							},complete: (res) => {
							}
						});
			},
			/**
			 * 加载列表
			 * @param {Object} e
			 * @param {Object} opeType  查询方式：点击查询/加载更多
			 */
			loadList(e,opeType){
				if ("query"==opeType){// 点击查询
					this.list.data = [];
					this.page = 1;
					this.list.isLastPage = false;
				}else if ("more"==opeType && !this.list.isLastPage){// 加载更多
					this.page++;
				}
				if (this.list.isLastPage){
					uni.showToast({title:'没有更多数据啦！',icon:'none',duration:config.DURATION});
					return;
				}
				
				if (this.recDateStart!=null && this.recDateEnd !=null && this.recDateStart>this.recDateEnd){
					uni.showToast({title:'查询开始日期不能大于结束日期！',icon:'none',duration:config.DURATION_MIDDLE});
					return;
				}
				
				if (this.sumStart!=null && this.sumStart!='' && this.sumEnd!=null && this.sumEnd!='' && this.sumStart>this.sumEnd){
					uni.showToast({title:'查询最小金额不能大于最大金额！',icon:'none',duration:config.DURATION_MIDDLE});
					return;
				}
				
				if ("query"==opeType){// 只有点击查询时执行统计
					this.statisticSum();
				}
				
				// 加载列表
				uni.showLoading({title: '加载中...',mask:true});
				let reqURL = config.SERVER_URL+"m/receipts/searchData.do";
				uni.request({url:reqURL,
							data:{loginName : this.loginName,token : this.token,page:this.page,limit:config.PAGE_SIZE,
								  recDateStart:this.recDateStart,recDateEnd:this.recDateEnd,fkReceiptsTypeId:this.typeQueryValue,
								  expSumStart:this.sumStart,expSumEnd:this.sumEnd,remark:this.remarkQuery},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								uni.hideLoading();
								this.list.hasLoadedData = true;
								this.list.isLastPage = res.data.isLastPage;
								
								if (!res.data.success){
									uni.showToast({title:'加载列表失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
									return ;
								}
								
								let tempItem = res.data.items;
								if (tempItem && tempItem.length>0){
									this.listShowNoDataTip = false;
									for (let i = 0; i < tempItem.length; i++) {
										this.list.data.push(tempItem[i]);
									}
								}else{
									this.listShowNoDataTip = true;
								}
							},fail: (res) => {
								uni.hideLoading();
								uni.showToast({title:'加载列表失败！',icon:'none',duration:config.DURATION});
							},complete: (res) => {
							}
						});
			},
			loadMoreData(){// 上滑列表加载更多 
				this.loadList(null,"more");
			},
			clearQueryForm(){// 清空查询条件表单
				this.clearType("typeQuery");
				this.sumStart = '';
				this.sumEnd = '';
				this.remarkQuery = '';
			},
			save(){// 保存数据
				if ( this.recDate==null || this.recDate=='' || this.recDate.length==0){
					uni.showToast({title:'请选择收入日期！',icon:'none',duration:config.DURATION});
					return;
				}
				
				if ( this.typeAddValue.length==0){
					uni.showToast({title:'请选择收入类型！',icon:'none',duration:config.DURATION});
					return;
				}
				
				if (this.sumAdd==null || this.sumAdd==''){
					uni.showToast({title:'请填写收入金额！',icon:'none',duration:config.DURATION});
					return;
				}
				/* if (!vSum(this.sumAdd) || this.sumAdd<=this.sumMinVal || this.sumAdd>=this.sumMaxVal ){
					uni.showToast({title:'请填写正确的金额！收入金额应大于'+
										this.sumMinVal+'且小于'+this.sumMaxValStr,
									icon:'none',duration:this.duration+2000});
					return;
				} */
				if (this.sumAdd<=this.sumMinVal || this.sumAdd>=this.sumMaxVal ){
					uni.showToast({title:'请填写正确的金额！收入金额应大于'+
										this.sumMinVal+'且小于'+this.sumMaxValStr,
									icon:'none',duration:config.DURATION_MIDDLE});
					return;
				}
				
				uni.showLoading({title: '正在保存...',mask:true});
				let tempURL = '';
				let opeTypeTip = '';
				let reqParam = {loginName : this.loginName,token : this.token,
									recDate:this.recDate,fkReceiptsTypeId:this.typeAddValue,
									recSum:this.sumAdd,remark:this.remark};
				if (this.beanId!=null && this.beanId!=''){// 编辑
					tempURL = config.SERVER_URL+"m/receipts/update.do";	
					reqParam.id = this.beanId;
					opeTypeTip = '修改';
				}else{// 添加
					tempURL = config.SERVER_URL+"m/receipts/save.do";
					opeTypeTip = '保存';
				}
				uni.request({url:tempURL,
							data:reqParam,
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								uni.hideLoading();
								if (res.data.success){
									this.loadList(null,"query");// 重新加载数据
									this.clearAddForm();
									uni.showToast({title:opeTypeTip+'成功！',icon:'none',duration:config.DURATION});
								}else{
									uni.showToast({title:opeTypeTip+'失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
								}
							},fail: (res) => {
								uni.hideLoading();
								uni.showToast({title:opeTypeTip+'收入请求失败！',icon:'none',duration:config.DURATION});
							},complete: (res) => {
							}
						});
				
			},
			editData(e,item){// 编辑数据事件
				uni.showLoading({title: '加载数据...',mask:true});
				
				let reqURL = config.SERVER_URL+"m/receipts/edit.do";
				uni.request({url:reqURL,
							data:{loginName : this.loginName,token : this.token,beanId:item.id},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								uni.hideLoading();
								if (res.data.success){
									this.beanId = res.data.bean.id;
									this.recDate = res.data.bean.recDate;
									this.typeAddValue = res.data.bean.fkReceiptsTypeId;
									this.typeAddText = res.data.receiptsTypeName;
									this.typeAddTipClass = false;
									this.sumAdd = res.data.bean.recSum;
									this.remark = res.data.bean.remark;
								}else{
									uni.showToast({title:'加载失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
								}
							},fail: (res) => {
								uni.hideLoading();
								uni.showToast({title:'加载失败！',icon:'none',duration:config.DURATION});
							},complete: (res) => {
							}
						});
			},
			clearAddForm(){// 清空添加区域表单
			    this.beanId = '';
				this.clearType("typeAdd");
				this.sumAdd='';
				this.remark='';
			},
			deleteData(e,item){// 删除数据事件
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					success: (res) => {
						if (res.confirm) {// 确定删除
							uni.showLoading({title: '正在删除...',mask:true});
							
							let reqURL = config.SERVER_URL+"m/receipts/delete.do";
							uni.request({url:reqURL,
										data:{loginName : this.loginName,token : this.token,ids:item.id},
										dataType:'json',
										method:'POST',
										header: {'content-type': 'application/x-www-form-urlencoded'},
										success: (res) => {
											uni.hideLoading();
											if (res.data.success){
												uni.showToast({title:'删除成功！',icon:'none',duration:config.DURATION});
												this.loadList(null,'query');
											}else{
												uni.showToast({title:'删除失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
											}
										},fail: (res) => {
											uni.hideLoading();
											uni.showToast({title:'删除失败！',icon:'none',duration:config.DURATION});
										},complete: (res) => {
										}
									});
						} else if (res.cancel) {// 取消删除
							
						}
					}
				});
			},
			viewData(e,item){// 跳转到详情页面
				uni.navigateTo({
				    url: 'receipts-detail?beanId='+item.id
				});
			},
			/* toLoginPage(){// 跳转到登录页面  url: '../../login/login'
				uni.navigateTo({
				    url: '../../user/login'
				});
			}, */
			trigerCollapse(layout) {// 控制面板收缩
			    if (layout=="form"){
					this.layout.form.show = !this.layout.form.show;
				}
			},
			// 日期相关方法开始
			bindDateChange: function(e,elementId) {// 日期确定事件 
				if ("recDate"==elementId){
					this.recDate = e.target.value;
				}else if ("recDateStart"==elementId){
					this.recDateStart = e.target.value;
				}else if ("recDateEnd"==elementId){
					this.recDateEnd = e.target.value;
				}
			},
			cancelDate:function (e,id){// 日期取消事件
				// 日期不能取消
				/* if ("recDate"==id){
					this.recDateTip = true;
					this.recDate = this.datePlaceholder;
				}else{
					
				} */
			},
			getDate(type) {
				const date = new Date();
					
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
					
				if (type === 'start') {
					day=1;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
					
				return `${year}-${month}-${day}`;
			},
			// 日期相关方法结束
			loadType(){
				let d = new Date();
				let reqURL = config.SERVER_URL+"m/receiptsType/loadTreeData.do?fieldMap=value:id,label:receipts_type_name,parentId:fk_parent_id&treeRootVal=-1&treeFlag=receiptsType&resType=map&multiSelect=false";
				uni.request({url:reqURL,
							data:{loginName : this.loginName,token : this.token,t: d.getTime()},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								if (res.data!=null && res.data!=undefined){
									if (res.data.length>0){
										this.typeValueArray = res.data;
									}
								}else{
									uni.showToast({title:'加载收入类型失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
								}
							},fail: (res) => {
								uni.showToast({title:'加载收入类型失败！',icon:'none',duration:config.DURATION});
							},complete: (res) => {
							}
					});
			},
			selectType(e,ref) {// 收入类型框点击事件
				uni.hideKeyboard();
				if (this.typeValueArray==undefined || this.typeValueArray==null || this.typeValueArray.length==0){
					uni.showToast({title:'您还没有配置收入类型！请在"设置"中生成类型或登录管理后台配置类型！',icon:'none',duration:config.DURATION_LONG});
					return;
				}
				if ("typeAdd"==ref){
					this.$refs.typeAddPicker.show();
				}else if ("typeQuery"==ref){
					this.$refs.typeQueryPicker.show();
				}
			},
			typeOnConfirm(e,elementId) {// 收入类型确定事件
				let selectedObj = this.typeValueArray[e.index[0]].children[e.index[1]];
				let selectedVal = selectedObj.value;
				let selectedLabel = selectedObj.label;
				
				if ("typeAdd"==elementId){
					this.typeAddValue = selectedVal;
					this.typeAddText = selectedLabel;
					this.typeAddTipClass = false;
				}else if ("typeQuery"==elementId){
					this.typeQueryValue = selectedVal;
					this.typeQueryText = selectedLabel;
					this.typeQueryTipClass = false;
				}
			},
			typeOnCancel(e,elementId) {// 收入类型取消事件
				this.clearType(elementId);
			},
			clearType(type){// 清空收入类型的值
				if ("typeAdd"==type){
					this.typeAddValue = '';
					this.typeAddText = this.typeTip;
					this.typeAddTipClass = true;
				}else if ("typeQuery"==type){
					this.typeQueryValue = '';
					this.typeQueryText = this.typeTip;
					this.typeQueryTipClass = true;
				}
			},
			sumBlur(e,eleId){// 金额失去焦点
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
        },
		onShow(){
			if (!this.hasLogin){
				this.listShowNoDataTip = true;
				appCommon.toLoginPage();
			}else{
				this.loadType();// 加载收入类型
			}
			
			if (this.hasLogin && !this.list.hasLoadedData) {
				this.loadList(null,"query");
			}
		},onReady() {
			// 计算列表滚动区域高度，使高度自适应
			uni.getSystemInfo({
				success: (res) =>{
					let fix_height_view = uni.createSelectorQuery().select("#fix_height_view");
					fix_height_view.boundingClientRect(data=>{
						// 滚动区域高度 = 窗口高度-固定区域高度
						this.list_scroll_height = res.windowHeight - data.height;
					}).exec();
				},fail:function(){
				}
			});
		}
    }
</script>

