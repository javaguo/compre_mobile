<template>
	<view class="com_page">
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-flex uni-row">
				<view class="text_group_title">累计</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value" >123456789.0</view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value" >123456789.0</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value" >123456789.0</view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">本年累计</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value" >2</view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value" >1</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value" >123456789.0</view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">本月累计</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value" >123456789.00</view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value" >1</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value" >123456789.0</view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">未清借款</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >借入：</view>
				<view class="text text_value" ></view>
				<view class="text text_label" >借出：</view>
				<view class="text text_value" >123456789.0</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value" >123456789.0</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: '概览'
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
		color: #666666;
		font-size: 30upx;
	}
	.text{
		margin:0upx 0upx;
		padding: 0 10upx;
		background-color: #FFFFFF;
		height: 60upx;
		line-height: 60upx;
		color: #777;
		font-size: 30upx;
	}
	.text_label{
		color: #444;
		text-align: left;
		font-size: 26upx;
	}
	.text_value{
		text-align: left;
		color: #222;
		font-weight: bold;
		flex: 1;
	}
</style>
