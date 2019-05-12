<template>
	<view class="com_page com_layout_column">
		<page-head :title="title"></page-head>

	<!-- 固定高度区域开始 -->
	<view id="fix_height_view">
		<!-- 一级类型表单添加区域开始 -->
		<view class="com_form">
			<form>
				<view class="com_form_row">
					<input class="com_form_input" placeholder-class="com_placeholder" placeholder="一级类型名称" :maxlength="typeNameMaxLength"
					 v-model.trim="typeNameLevel1" />
					 <input class="com_form_input" placeholder-class="com_placeholder" type="digit" 
					 	:maxlength="orderNumMaxLength" placeholder="序号"  v-model.trim="orderNumLevel1"/>
					<button class="com_form_save" @click="clearFormLevel1">清空</button>
					<button class="com_form_save" @click="save('level1')">保存</button>
				</view>
			</form>
		</view>
		<!-- 一级类型表单添加区域结束 -->
		
		<view class="com_line"></view>
		
		<!-- 二级类型表单添加区域开始 -->
		<view class="com_form" >
			<form>
			 <view class="com_form_row">
				 <view class="com_form_input com_form_type" :class="typeAddTipClass ? 'com_placeholder' : ''"
				 	  @click="selectType($event,'typeAdd')">{{typeNameLevel1Text}}</view>
				 <mpvue-picker :themeColor="themeColor" ref="typeAddPicker" :mode="typeMode" :deepLength="typeDeepLength" 
				 		:pickerValueDefault="typeAddSelectedIndex"  :pickerValueArray="typeValueArray"
				 		@onConfirm="typeOnConfirm($event,'typeAdd')" @onCancel="typeOnCancel($event,'typeAdd')" >
				 </mpvue-picker>
				 
			 	<input class="com_form_input" placeholder-class="com_placeholder" placeholder="二级类型名称" :maxlength="typeNameMaxLength"
					v-model.trim="typeNameLevel2"/>
			  </view>
			  <view class="com_form_row">
			  		<input class="com_form_input type_add_order_num" placeholder-class="com_placeholder" type="digit" 
			  			:maxlength="orderNumMaxLength" placeholder="序号"  v-model.trim="orderNumLevel2"/>	
					<view class="com_form_full"></view>
			  		<button class="com_form_save" @click="clearFormLevel2">清空</button>
			  		<button class="com_form_save" @click="save('level2')">保存</button>
			  </view>
			</form>
		</view>
		<!-- 二级类型表单添加区域结束 -->
		
		<view class="com_line com_line_color2"></view>
		
		<view class="uni-flex uni-row list_top" style="justify-content: space-between;">
			<view class="list_top_title">类型列表：</view>
			<view class="list_top_icon">
				<image class="list-icon_img" src="../../../static/img/common/refresh32.png" @click="loadList($event, 'query')"></image>
			</view>
		</view>
		
	</view>
	<!-- 固定高度区域结束 -->	
		
	<!-- 列表区域开始 -->
	<scroll-view class="" :style="{height:list_scroll_height+'px'}" scroll-y="true" @scrolltolower="loadMoreData">
		<view v-show="listShowNoDataTip" class="com_list com_list_tip">暂无数据！</view>
		
		<block v-for="(item,index) in list.data" :key="index">
			<view class="com_list">
				<view class="com_list_row com_list_row_top">
					<!-- <view class="list_text uni-ellipsis" v-if="item.fkParentId!=null" ></view> -->
					<view :class="item.fkParentId==null ? 'com_bold' : ''" class="list_text list_type uni-ellipsis">{{item.fkParentId!=null?item.fkParentId:item.receiptsTypeName}}</view>
					<view class="list_text list_type uni-ellipsis">{{item.fkParentId!=null?item.receiptsTypeName:""}}</view>
					<view :class="item.fkParentId==null ? 'com_bold' : ''"  class="list_text com_form_full uni-ellipsis">{{item.orderNum}}</view>
					
					<view class="list_icon">
						<image class="list-icon_img" src="../../../static/img/common/editor32.png" @click="editData($event,item)"></image>
					</view>
					<view class="list_icon">
						<image class="list-icon_img" src="../../../static/img/common/delete32.png" @click="deleteData($event,item)"></image>
					</view>
				</view>
			</view>
		</block>
	</scroll-view>
	<!-- 列表区域结束 -->
</view>
</template>
<style>
	@import '../../../resource/css/account/type.css';
</style>
<script>
	import config from '../../../resource/js/app/config.js';
	import appCommon from '../../../resource/js/app/common.js';

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
			const constTypeTip = "选择一级类型"; // 只在下面的return块里使用
			return {
				typeNameMaxLength: 10,
				orderNumMaxLength: 8,
				orderNumMinVal:0,
				orderNumMaxVal:99999999,
				// 添加编辑一级类型使用
				beanIdLevel1: '',
				typeNameLevel1: '',
				orderNumLevel1:'',
				// 添加编辑二级类型使用
				beanIdLevel2: '',
				typeNameLevel1Text: constTypeTip,
				typeNameLevel1Value: '',
				typeNameLevel2: '',
				orderNumLevel2:'',
				// 类型picker属性
				typeValueArray: [],
				typeMode: 'selector',
				typeDeepLength: 1,
				typeAddSelectedIndex: [0], // 类型级联添加区域使用
				typeTip: constTypeTip,
				typeAddTipClass: true,

				list_scroll_height:'',
				listSum: '',
				// lists: [],
				list: { // 列表展示使用
					data: [],
					hasLoadedData: false,
					isLastPage: false
				},
				listShowNoDataTip: false, // 有些地方不能用list.listShowNoDataTip  先放到list外面
				// 配置相关
				title: '收入类型',
				themeColor: config.PICKER_THEME_COLOR,
				page: 1,
				layout: {
					form: {
						show: true
					},
					list: {
						show: false
					}
				}
			}
		},
		computed: {
		},
		computed: mapState(['loginName', 'hasLogin', 'token']),
		methods: {
			loadList(e, opeType) {
				if ("query" == opeType) { // 查询，重新加载列表
					this.list.data = [];
					this.page = 1;
					this.list.isLastPage = false;
				} else if ("more" == opeType && !this.list.isLastPage) { // 加载更多
					this.page++;
				}
				if (this.list.isLastPage) {
					uni.showToast({
						title: '没有更多数据啦！',
						icon: 'none',
						duration: config.DURATION
					});
					return;
				}

				// 加载列表
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				let reqURL = config.SERVER_URL + "m/receiptsType/searchData.do";
				uni.request({
					url: reqURL,
					data: {
						loginName: this.loginName,
						token: this.token,
						page: this.page,
						limit: config.PAGE_SIZE_TYPE
					},
					dataType: 'json',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						uni.hideLoading();
						this.list.hasLoadedData = true;
						this.list.isLastPage = res.data.isLastPage;

						if (!res.data.success) {
							uni.showToast({
								title: '加载列表失败！' + res.data.msg,
								icon: 'none',
								duration: config.DURATION_MIDDLE
							});
							return;
						}

						let tempItem = res.data.items;
						if (tempItem && tempItem.length > 0) {
							this.listShowNoDataTip = false;
							for (let i = 0; i < tempItem.length; i++) {
								this.list.data.push(tempItem[i]);
							}
						} else {
							this.listShowNoDataTip = true;
						}
					},
					fail: (res) => {
						uni.hideLoading();
						uni.showToast({
							title: '加载列表失败！',
							icon: 'none',
							duration: config.DURATION
						});
					},
					complete: (res) => {}
				});
			},
			loadMoreData() { // 上滑列表加载更多 
				this.loadList(null, "more");
			},
			save(typeLevel) { // 保存数据
				let id,fkParentId,receiptsTypeName,orderNum;
				
				if (typeLevel=="level1"){// 处理一级类型相关字段
					id = this.beanIdLevel1;
					if (this.typeNameLevel1 == ''){
						uni.showToast({
							title: '请填写一级类型名称！',
							icon: 'none',
							duration: config.DURATION
						});
						return;
					}
					receiptsTypeName = this.typeNameLevel1;
					
					orderNum = this.orderNumLevel1;
				}else if (typeLevel=="level2"){// 处理二级类型相关字段
					id = this.beanIdLevel2;
					if (this.typeNameLevel1Value == ''){
						uni.showToast({
							title: '请选择一级类型！',
							icon: 'none',
							duration: config.DURATION
						});
						return;
					}
					fkParentId = this.typeNameLevel1Value;
					
					if (this.typeNameLevel2 == ''){
						uni.showToast({
							title: '请填写二级类型名称！',
							icon: 'none',
							duration: config.DURATION
						});
						return;
					}
					receiptsTypeName = this.typeNameLevel2;
					
					orderNum = this.orderNumLevel2;
				}else{
					return ;
				}
				
				if (orderNum == null || orderNum == ''){
					uni.showToast({
						title: '请填写序号！',
						icon: 'none',
						duration: config.DURATION
					});
					return;
				}
				if (orderNum < this.orderNumMinVal || orderNum > this.orderNumMaxVal) {
					uni.showToast({
						title: '序号范围应在' +
							this.orderNumMinVal + ' - ' + this.orderNumMaxVal+"之间！",
						icon: 'none',
						duration: config.DURATION_MIDDLE
					});
					return;
				}

				uni.showLoading({
					title: '正在保存...',
					mask: true
				});
				let tempURL = '';
				let opeTypeTip = '';
				let reqParam = {
					loginName: this.loginName,
					token: this.token,
					receiptsTypeName:receiptsTypeName,
					orderNum:orderNum
				};
				if (typeLevel=="level2"){
					reqParam.fkParentId = fkParentId;
				}
				
				if ( id!=undefined && id!= null && id != '') { // 编辑
					tempURL = config.SERVER_URL + "m/receiptsType/update.do";
					reqParam.id = id;
					opeTypeTip = '修改';
				} else { // 添加
					tempURL = config.SERVER_URL + "m/receiptsType/save.do";
					opeTypeTip = '保存';
				}
				uni.request({
					url: tempURL,
					data: reqParam,
					dataType: 'json',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.success) {
							this.loadList(null, "query"); // 重新加载数据
							if (typeLevel=="level1"){
								this.loadType(); // 一级节点有变动，重新加载一级节点
								this.clearFormLevel1();
							}else if (typeLevel=="level2"){
								this.clearFormLevel2();
							}
							
							uni.showToast({
								title: opeTypeTip + '成功！',
								icon: 'none',
								duration: config.DURATION
							});
						} else {
							uni.showToast({
								title: opeTypeTip + '失败！' + res.data.msg,
								icon: 'none',
								duration: config.DURATION_MIDDLE
							});
						}
					},
					fail: (res) => {
						uni.hideLoading();
						uni.showToast({
							title: opeTypeTip + '失败！',
							icon: 'none',
							duration: config.DURATION
						});
					},
					complete: (res) => {}
				});
			},
			editData(e, item) { // 编辑数据事件
				uni.showLoading({
					title: '加载数据...',
					mask: true
				});

				let reqURL = config.SERVER_URL + "m/receiptsType/edit.do";
				uni.request({
					url: reqURL,
					data: {
						loginName: this.loginName,
						token: this.token,
						beanId: item.id
					},
					dataType: 'json',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.success) {
							if (res.data.bean.fkParentId==-1){// 一级类型
								this.beanIdLevel1 = res.data.bean.id;
								this.typeNameLevel1 = res.data.bean.receiptsTypeName;
								this.orderNumLevel1 = res.data.bean.orderNum;
							}else{// 二级类型
								this.beanIdLevel2 = res.data.bean.id;
								this.typeNameLevel1Value = res.data.bean.fkParentId;
								this.typeNameLevel1Text = item.fkParentId;
								this.typeAddTipClass = false;
								this.typeNameLevel2 = res.data.bean.receiptsTypeName;
								this.orderNumLevel2 = res.data.bean.orderNum;
							}
						} else {
							uni.showToast({
								title: '加载失败！' + res.data.msg,
								icon: 'none',
								duration: config.DURATION_MIDDLE
							});
						}
					},
					fail: (res) => {
						uni.hideLoading();
						uni.showToast({
							title: '加载失败！',
							icon: 'none',
							duration: config.DURATION
						});
					},
					complete: (res) => {}
				});
			},
			clearFormLevel1(){
				this.beanIdLevel1 = '';
				this.typeNameLevel1 = '';
				this.orderNumLevel1 = '';
			},
			clearFormLevel2(){
				this.beanIdLevel2 = '';
				this.clearType("typeAdd");
				this.typeNameLevel2 = '';
				this.orderNumLevel2 = '';
			},
			deleteData(e, item) { // 删除数据事件
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					success: (res) => {
						if (res.confirm) { // 确定删除
							uni.showLoading({
								title: '正在删除...',
								mask: true
							});

							let reqURL = config.SERVER_URL + "m/receiptsType/delete.do";
							uni.request({
								url: reqURL,
								data: {
									loginName: this.loginName,
									token: this.token,
									ids: item.id
								},
								dataType: 'json',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								success: (res) => {
									uni.hideLoading();
									if (res.data.success) {
										uni.showToast({
											title: '删除成功！',
											icon: 'none',
											duration: config.DURATION
										});
										this.loadList(null, 'query');
									} else {
										uni.showToast({
											title: '删除失败！' + res.data.msg,
											icon: 'none',
											duration: config.DURATION_LONG
										});
									}
								},
								fail: (res) => {
									uni.hideLoading();
									uni.showToast({
										title: '删除失败！',
										icon: 'none',
										duration: config.DURATION
									});
								},
								complete: (res) => {}
							});
						} else if (res.cancel) { // 取消删除

						}
					}
				});
			},
			trigerCollapse(layout) { // 控制面板收缩
				if (layout == "form") {
					this.layout.form.show = !this.layout.form.show;
				}
			},
			loadType() {
				let d = new Date();
				let reqURL = config.SERVER_URL +
					"m/receiptsType/loadTreeData.do?fieldMap=value:id,label:receipts_type_name,parentId:fk_parent_id&treeRootVal=-1&treeFlag=receiptsTypeLevel1&resType=map&multiSelect=false";
				uni.request({
					url: reqURL,
					data: {
						loginName: this.loginName,
						token: this.token,
						t: d.getTime()
					},
					dataType: 'json',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data != null && res.data != undefined) {
							if (res.data.length > 0) {
								this.typeValueArray = res.data;
							}
						} else {
							uni.showToast({
								title: '加载收入类型失败！' + res.data.msg,
								icon: 'none',
								duration: config.DURATION_MIDDLE
							});
						}
					},
					fail: (res) => {
						uni.showToast({
							title: '加载收入类型失败！',
							icon: 'none',
							duration: config.DURATION
						});
					},
					complete: (res) => {}
				});
			},
			selectType(e, ref) { // 收入类型框点击事件
				uni.hideKeyboard();
				if (this.typeValueArray == undefined || this.typeValueArray == null || this.typeValueArray.length == 0) {
					uni.showToast({
						title: '请先添加一级收入类型！您还没有一级收入类型！',
						icon: 'none',
						duration: config.DURATION_LONG
					});
					return;
				}
				if ("typeAdd" == ref) {
					this.$refs.typeAddPicker.show();

				}
			},
			typeOnConfirm(e, elementId) { // 收入类型确定事件
				let selectedObj = this.typeValueArray[e.index[0]];
				let selectedVal = selectedObj.value;
				let selectedLabel = selectedObj.label;

				if ("typeAdd" == elementId) {
					this.typeNameLevel1Value = selectedVal,
					this.typeNameLevel1Text = selectedLabel;
					this.typeAddTipClass = false;
				}
			},
			typeOnCancel(e, elementId) { // 收入类型取消事件
				this.clearType(elementId);
			},
			clearType(type) { // 清空收入类型的值
				if ("typeAdd" == type) {
					this.typeNameLevel1Value = '',
					this.typeNameLevel1Text = this.typeTip;
					this.typeAddTipClass = true;
				}
			}
		},
		onBackPress() {
			if (this.$refs.typeAddPicker.showPicker) {
				this.$refs.typeAddPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.typeAddPicker.showPicker) {
				this.$refs.typeAddPicker.pickerCancel();
			}
		},
		onLoad() {},
		onShow() {
			if (!this.hasLogin) {
				this.listShowNoDataTip = true;
				appCommon.toLoginPage();
			} else {
				this.loadType(); // 加载收入类型
			}

			if (this.hasLogin && !this.list.hasLoadedData) {
				this.loadList(null, "query");
			}
		},onReady() {
			// 计算列表滚动区域高度，使自适应
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
