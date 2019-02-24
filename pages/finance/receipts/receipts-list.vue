<template>
    <view class="com_page">
        <page-head :title="title"></page-head>
		<view class="uni-flex uni-row com_list" >
		<view class="" style="width: 200upx;">
			<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input">{{date}}</view>
			</picker>
		</view>
		</view>
        <view style="width: 100%;margin-right: 80upx;">
            <block v-for="(item,index) in lists" :key="index">
                    <view class="com_row_list com_list" >
						<view class="com_row" >
							<view class="uni-title list_date">2019-02-18</view>
							<view class="uni-title uni-ellipsis list_type1">餐饮支出餐饮支出餐饮支出</view>
							<view class="uni-title uni-ellipsis list_type2">三餐三餐三餐三餐三餐三餐三餐</view>
							<view class="uni-title list_sum">a99892.20a</view>
						</view>
						<view class="com_row">
							<view class="uni-title list_date">备注：</view>
							<view class="uni-title uni-ellipsis" style="flex: 1;">自动占满余量自动占满余量自动占满余量自动占满余量自动占满余量自动占满余量自动占满余量自动占满余量自动占满余量自动占满余量自动占满余量</view>
						</view>	
                    </view>
            </block>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
			const currentDate = this.getDate({
				format: true
			});
            return {
                title: '收入列表',
				date: currentDate,
                lists: []
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
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value
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
			}
		},
        onLoad() {
            let list = [];
            for (let i = 0; i < 5; i++) {
                list.push(i)
            }
            this.lists = list;
        }
    }
</script>

<style>
.list_date{
	width: 180upx;
}	
.list_type1{
	width: 180upx;
}
.list_type2{
	width: 180upx;
}
.list_sum{
	flex: 1;
	text-align: right;
}
</style>
