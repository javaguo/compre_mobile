<template>
    <view class="com_page com_layout_column">
        <page-head :title="title"></page-head>
		<view class="uni-flex uni-row">
			<view class="text text_label" >日期：</view>
			<view class="text text_value" >{{recDate}}</view>
		</view>
		<view class="uni-flex uni-row">
			<view class="text text_label" >类型：</view>
			<view class="text text_value" >{{typeTextParent}}&nbsp;&nbsp;&nbsp;&nbsp;{{typeText}}</view>
		</view>
		<view class="uni-flex uni-row">
			<view class="text text_label" >金额：</view>
			<view class="text text_value" >{{sum}}</view>
		</view>
		<view class="uni-flex uni-row">
			<view class="text text_label" >备注：</view>
			<view class="text text_value" >{{remark}}</view>
		</view>
		<view class="uni-flex uni-row">
			<view class="text text_label" >添加时间：</view>
			<view class="text text_value" >{{addTime}}</view>
		</view>
		<view class="uni-flex uni-row">
			<view class="text text_label" >更新时间：</view>
			<view class="text text_value" >{{updateTime}}</view>
		</view>
		
		<view class="uni-padding-wrap uni-common-mt">
			<button type="default" @click="back">返回</button>
		</view>
    </view>
</template>

<script>
	import config from '../../../resource/js/app/config.js';
	import appCommon from '../../../resource/js/app/common.js';
	
	import {
	    mapState,
	    mapMutations
	} from 'vuex';
	
    export default {
        data() {
            return {
				beanId:'',
				recDate: '',
				typeTextParent:'',
				typeText: '',
				sum:'',
				remark: '',
				addTime:'',
				updateTime:''
            }
        },
		computed: mapState(['loginName','hasLogin','token']),
		methods: {
			loadDetail(){
				uni.showLoading({title: '加载数据...',mask:true});
				
				let reqURL = config.SERVER_URL+"m/receipts/edit.do";
				uni.request({url:reqURL,
							data:{loginName : this.loginName,token : this.token,beanId:this.beanId},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								uni.hideLoading();
								if (res.data.success){
									this.recDate = res.data.bean.recDate;
									this.typeTextParent = res.data.receiptsTypeNameParent;
									this.typeText = res.data.receiptsTypeName;
									this.sum = res.data.bean.recSum;
									this.remark = res.data.bean.remark;
									this.addTime = res.data.bean.addTime;
									this.updateTime = res.data.bean.updateTime;
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
			back(){
				uni.navigateBack();
			}
		},
		onBackPress() {
		},
		onUnload() {
		},
        onLoad(event) {
			if (this.hasLogin) {
				this.beanId = event.beanId;
				this.loadDetail();
			}
        },
		onShow(){
			if (!this.hasLogin) {
				appCommon.toLoginPage();
			}
		}
    }
</script>

