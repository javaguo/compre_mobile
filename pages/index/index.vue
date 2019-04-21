<template>
	<view class="com_page">
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-flex uni-row">
				<view class="text_group_title">累计</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value uni-ellipsis" >{{receiptsSumAll}}</view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value uni-ellipsis" >{{expendSumAll}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" >{{balanceAll}}</view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">本年累计</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value uni-ellipsis" >{{receiptsSumYear}}</view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value uni-ellipsis" >{{expendSumYear}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" >{{balanceYear}}</view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">本月累计</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >收入：</view>
				<view class="text text_value uni-ellipsis" >{{receiptsSumMonth}}</view>
				<view class="text text_label" >支出：</view>
				<view class="text text_value uni-ellipsis" >{{expendSumMonth}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" >{{balanceMonth}}</view>
			</view>
			
			<view class="uni-flex uni-row">
				<view class="text_group_title">未清借款</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >借入：</view>
				<view class="text text_value uni-ellipsis" >{{borrowedSumAll}}</view>
				<view class="text text_label" >借出：</view>
				<view class="text text_value uni-ellipsis" >{{lendSumAll}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text text_label" >差额：</view>
				<view class="text text_value uni-ellipsis" >{{borrowLendBalanceAll}}</view>
			</view>
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
		data() {
			return {
				title: '概览',
				receiptsSumAll:'',
				expendSumAll:'',
				balanceAll:'',
				receiptsSumYear:'',
				expendSumYear:'',
				balanceYear:'',
				receiptsSumMonth:'',
				expendSumMonth:'',
				balanceMonth:'',
				borrowedSumAll:'',
				lendSumAll:'',
				borrowLendBalanceAll:''
			}
		},
		computed: mapState(['loginName','hasLogin','token']),
		methods: {
		    statistics(){
				console.log("加载统计信息。。。");
				let reqURL = config.SERVER_URL+"m/statistics/searchData.do";
				uni.request({url:reqURL,
							data:{loginName : this.loginName,token : this.token,page:1,limit:10},
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								console.log(JSON.stringify(res));
								if (!res.data.success){
									uni.showToast({title:'加载统计信息失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
									return ;
								}
								
								let tempItem = res.data.items;
								if (tempItem && tempItem.length>0){
									for (let i = 0; i < tempItem.length; i++) {
										let row = tempItem[i];
										switch (i){
											case 0:
												this.receiptsSumAll = row.value1;this.expendSumAll = row.value2;this.balanceAll = row.value2A;
												break;
											case 1:
												this.receiptsSumYear = row.value1;this.expendSumYear = row.value2;this.balanceYear = row.value2A;
												break;
											case 2:
												this.receiptsSumMonth = row.value1;this.expendSumMonth = row.value2;this.balanceMonth = row.value2A;
												break;
											case 3:
												break;
											case 4:
												break;
											case 5:
												this.borrowedSumAll = row.value1;this.lendSumAll = row.value2;this.borrowLendBalanceAll = row.value2A;
												break;						
											default:
												break;
										}
									}
								}
							},fail: (res) => {
								uni.showToast({title:'加载统计信息失败！',icon:'none',duration:config.DURATION});
							},complete: (res) => {
							}
						});
			}
		},	
		onShow(){
			if (!this.hasLogin) {
				appCommon.toLoginPage();
			}else{
				this.statistics();
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
