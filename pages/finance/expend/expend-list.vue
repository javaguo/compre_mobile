<template>
    <view class="com_page com_layout_column">
        <page-head :title="title"></page-head>
		<view class="com_form com_form_bottom" >
			<view class="com_form_row">
				<picker mode="date" name="expDate" :value="expDate"  @change="bindDateChange($event,'expDate')" @cancel="cancelDate($event,'expDate')">
					<view class="com_form_input com_form_date" >{{expDate}}</view>
				</picker>
				
				<view class="com_form_input com_form_type" @click="showMulLinkageTwoPicker">{{pickerText}}</view>
				<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
				@onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
				
				<input class="com_form_input com_form_sum" type="digit" placeholder="金额" />
			 </view>
			 <view class="com_form_row">
			 	<input class="com_form_input com_form_remark" placeholder="备注" />
				<button class="com_form_save">保存</button>
			  </view>
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
				
				<input class="com_form_input com_form_type" :value="pickerText" @click="showMulLinkageTwoPicker" placeholder="收入类型" />
				<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
				@onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
			 </view>
			 <view class="com_form_row">
			 	<input class="com_form_input com_form_sum_q" type="digit" placeholder="最小金额" />
				<view class="com_form_text">-</view>
			 	<input class="com_form_input com_form_sum_q" type="digit" placeholder="最大金额" />
			 	<input class="com_form_input com_form_remark" placeholder="备注" />
				<button class="com_form_save">查询</button>
			  </view>
		</view>
		
        <view class="">
			<scroll-view class="com_list_scroll" scroll-y="true">
            <block v-for="(item,index) in lists" :key="index">
                    <view class="com_list" >
						<view class="com_list_row com_list_row_top" >
							<view class="list_text list_date">2019-02-18</view>
							<view class="list_text list_type1 uni-ellipsis">餐饮支出餐饮支出餐饮支出</view>
							<view class="list_text list_type2 uni-ellipsis">三餐三餐三餐三餐三餐三餐三餐</view>
							<view class="list_text list_sum uni-ellipsis">a3534399892.20a</view>
						</view>
						<view class="com_list_row">
							<view class="list_text list_row2_column1">备注：</view>
							<view class="list_text list_row2_column2 uni-ellipsis" ></view>
							<view class="list_icon">
								<image class="list-icon_img" src="../../../static/img/common/editor32.png"></image>
							</view>
							<view class="list_icon">
								<image class="list-icon_img" src="../../../static/img/common/delete32.png"></image>
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
	import mpvuePicker from '../../../components/mpvue-picker/mpvuePicker.vue';
	import cityData from '../../../common/city.data.js';

	
    export default {
		components: {
			mpvuePicker
		},
        data() {
			const currentDate = this.getDate({
				format: true
			});
			
            return {
                title: '收入列表',
				expDate: currentDate,
				expDateStart: currentDate,
				expDateEnd: currentDate,
				layout:{
					form:{show: true},
					list:{show: false}
				},
                lists: [],
				mulLinkageTwoPicker: cityData,
				themeColor: '#007AFF',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [],
				pickerText: ''
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
			trigerCollapse(layout) {
			    if (layout=="form"){
					this.layout.form.show = !this.layout.form.show;
				}
			},
			bindDateChange: function(e,id) {
				if ("expDate"==id){
					this.expDate = e.target.value;
				}else if ("expDateStart"==id){
					this.expDateStart = e.target.value;
				}else if ("expDateEnd"==id){
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
			// 二级联动选择
			showMulLinkageTwoPicker() {
				this.pickerValueArray = this.mulLinkageTwoPicker
				this.mode = 'multiLinkageSelector'
				this.deepLength = 2
				this.pickerValueDefault = [0, 0]
				this.$refs.mpvuePicker.show()
			},
			onConfirm(e) {
				this.pickerText = JSON.stringify(e)
			},
			onCancel(e) {
			}
		},
		onBackPress() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel()
			}
		},
        onLoad() {
            let list = [];
            for (let i = 0; i < 10; i++) {
                list.push(i)
            }
            this.lists = list;
        }
    }
</script>

<style>

</style>
