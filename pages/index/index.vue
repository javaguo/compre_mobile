<template>
	<view class="com_page">
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-flex uni-row">
				<view class="text_group_title">累计(开发中...)</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value uni-ellipsis" ></view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">本年累计(开发中...)</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value uni-ellipsis" ></view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">本月累计(开发中...)</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value uni-ellipsis" ></view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">未清借款(开发中...)</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >借入：</view>
				<view class="text text_value uni-ellipsis" ></view>
				<view class="text text_label" >借出：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" ></view>
			</view>
		</view>
	</view>
</template>
<script>
	import appCommon from '../../resource/js/app/common.js';
	import {
	    mapState,
	    mapMutations
	} from 'vuex';
	
	export default {
		data() {
			return {
				title: '概览'
			}
		},
		computed: mapState(['loginName','hasLogin','token']),
		methods: {
		    statistics(){
				
			}
		},	
		onShow(){
			if (!this.hasLogin) {
				appCommon.toLoginPage();
			}
		}
	}
</script>

<style>
.text_group_title{
	margin:5upx 0upx;
	padding: 0 10upx;
	height: 70upx;
	line-height: 70upx;
	color: #8a8a8a;
	font-size: 35upx;
	flex: 1;
	text-align: left;
}
.text{
	margin:0upx 0upx;
	padding: 0 10upx;
	background-color: #FFFFFF;
	height: 60upx;
	line-height: 60upx;
	color: #8a8a8a;
	font-size: 35upx;
	text-align: left;
}
.text_label{
	width: 100upx;
}
.text_value{
	flex: 1;
	color: #111;
	font-size: 38upx;
}	
</style>
