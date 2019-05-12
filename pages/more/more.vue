<template>
    <view class="com_page">
        <view class="btn-row">
            <button type="primary" class="primary" @tap="copyReceiptsTypeFromSys">生成默认收入类型</button>
        </view>
		<view class="btn-row">
		    <button type="primary" class="primary" @tap="navReceiptsType">自定义收入类型</button>
		</view>
		
		<view class="btn-row">
		    <button type="primary" class="primary" @tap="copyExpendTypeFromSys">生成默认支出类型</button>
		</view>
		<view class="btn-row">
		    <button type="primary" class="primary" @tap="navExpendType">自定义支出类型</button>
		</view>
    </view>
</template>

<script>
	import config from '../../resource/js/app/config.js';
	import appCommon from '../../resource/js/app/common.js';
	import {
	    mapState,
	    mapMutations
	} from 'vuex';

    export default {
        computed: mapState(['forcedLogin', 'hasLogin', 'loginName','token']),
		methods: {
		    copyReceiptsTypeFromSys(){
				uni.showModal({
					title: '提示',
					content: '确定生成默认收入类型吗？',
					success: (res) => {
						if (res.confirm) {// 确定
							uni.showLoading({title: '正在生成...',mask:true});
							
							let reqURL = config.SERVER_URL+"m/receiptsType/ajaxCopyReceiptsTypeFromSys.do";
							uni.request({url:reqURL,
										data:{loginName : this.loginName,token : this.token},
										dataType:'json',
										method:'POST',
										header: {'content-type': 'application/x-www-form-urlencoded'},
										success: (res) => {
											uni.hideLoading();
											if (res.data.success){
												uni.showToast({title:res.data.msg,icon:'none',duration:config.DURATION});
											}else{
												uni.showToast({title:'生成失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
											}
										},fail: (res) => {
											uni.hideLoading();
											uni.showToast({title:'生成失败！',icon:'none',duration:config.DURATION});
										},complete: (res) => {
										}
									});
						} else if (res.cancel) {// 取消
							
						}
					}
				});
			},
			navReceiptsType(){
				uni.navigateTo({
				    url: '../account/receipts-type/receipts-type-list'
				});
			},
			navExpendType(){
				uni.navigateTo({
				    url: '../account/expend-type/expend-type-list'
				});
			},
			copyExpendTypeFromSys(){
				uni.showModal({
					title: '提示',
					content: '确定生成默认支出类型吗？',
					success: (res) => {
						if (res.confirm) {// 确定
							uni.showLoading({title: '正在生成...',mask:true});
							
							let reqURL = config.SERVER_URL+"m/expendType/ajaxCopyExpendTypeFromSys.do";
							uni.request({url:reqURL,
										data:{loginName : this.loginName,token : this.token},
										dataType:'json',
										method:'POST',
										header: {'content-type': 'application/x-www-form-urlencoded'},
										success: (res) => {
											uni.hideLoading();
											if (res.data.success){
												uni.showToast({title:res.data.msg,icon:'none',duration:config.DURATION});
											}else{
												uni.showToast({title:'生成失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
											}
										},fail: (res) => {
											uni.hideLoading();
											uni.showToast({title:'生成失败！',icon:'none',duration:config.DURATION});
										},complete: (res) => {
										}
									});
						} else if (res.cancel) {// 取消
							
						}
					}
				});
			}
		},
        onLoad() {
        },
		onShow(){
			if (!this.hasLogin) {
				appCommon.toLoginPage();
			}
		}
    }
</script>
