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
				<button class="com_form_save" @click="saveExpend">保存</button>
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
	import {vSum} from '../../../resources/js/utils/regex.js';
	
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
				themeColor: '#007AFF',
				// pickerValueDefault: [0],
				// pickerValueArray: [],
				typeValueArray: cityData,
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
				let selectedObj = cityData[e.index[0]].children[e.index[1]];
				let selectedVal = selectedObj.value;
				let selectedLabel = selectedObj.label;
				
				console.log("JSON.stringify(e)："+JSON.stringify(e));
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
				if ("typeAdd"==elementId){
					this.typeAddValue = '';
					this.typeAddText = this.typeTip;
					this.typeAddTipClass = true;
				}else if ("typeQuery"==elementId){
					this.typeQueryValue = '';
					this.typeQueryText = this.typeTip;
					this.typeQueryTipClass = true;
				}
			},
			sumBlur(e,eleId){
				// console.log("sumBlur："+eleId);
			},
			saveExpend(){
				console.log("this.expDate："+this.expDate);
				if ( this.expDate==null || this.expDate=='' || this.expDate.length==0){
					uni.showToast({title:'请选择支出日期！',icon:'none',duration:this.duration});
					return;
				}
				console.log("this.typeAddValue："+this.typeAddValue);
				if ( this.typeAddValue.length==0){
					uni.showToast({title:'请选择支出类型！',icon:'none',duration:this.duration});
					return;
				}
				console.log("this.sumAdd："+this.sumAdd);
				console.log("this.remark："+this.remark);
				
				if (this.sumAdd==null || this.sumAdd==''){
					uni.showToast({title:'请填写支出金额！',icon:'none',duration:this.duration});
					return;
				}
				if (!vSum(this.sumAdd) || this.sumAdd<=this.sumMinVal || this.sumAdd>=this.sumMaxVal ){
					uni.showToast({title:'请填写正确的金额！支出金额应大于'+
										this.sumMinVal+'且小于'+this.sumMaxValStr,
									icon:'none',duration:this.duration+2000});
					return;
				}
				/* if (this.sumAdd<=this.sumMinVal || this.sumAdd>=this.sumMaxVal ){
					uni.showToast({title:'支出金额应大于'+this.sumMinVal+'且小于'+this.sumMaxValStr,icon:'none',duration:this.duration});
					return;
				} */
				
				let tempURL = "http://localhost:8101/compre/expendType/loadTreeData.do?fieldMap=id:id,text:expend_type_name,parentId:fk_parent_id&treeRootVal=-1&treeFlag=expendType&resType=map&multiSelect=true&node=root";
				let reqObj = {url:tempURL,data:'',dataType:'',
					success: (res) => {
						console.log("success："+res.data);
					},fail: (res) => {
						console.log("fail："+res.data);
					},complete: (res) => {
						console.log("complete："+res.data);
					}};
				uni.request(reqObj);
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
