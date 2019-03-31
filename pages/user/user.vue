<template>
    <view class="com_content com_page">
		<view class="uni-flex uni-row">
			<view class="text text_label" >账号：</view>
			<view class="text text_value" >{{loginName}}</view>
		</view>
		<view class="uni-flex uni-row">
			<view class="text text_label" >用户名：</view>
			<view class="text text_value" >{{userName}}</view>
		</view>
		
        <view class="btn-row">
            <button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
            <button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
        </view>
    </view>
</template>

<script>
	import config from '../../resource/js/app/config.js';
	import appCommon from '../../resource/js/app/common.js';
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        computed: {
            ...mapState(['hasLogin', 'forcedLogin','loginName','userName'])
        },
        methods: {
            ...mapMutations(['logoutDestroy']),
            bindLogin() {
				if (this.hasLogin) {
				    uni.showToast({title:'您已登录！',icon:'none'});
				}else{
					appCommon.toLoginPage();
				}
            },
            bindLogout() {
                this.logoutDestroy();
				
				// 清除登录名、密码缓存
				uni.removeStorage({key: config.KEY_LOGIN_NAME,success: function (res) {}});
				uni.removeStorage({key: config.KEY_PASSWORD_ENCRY,success: function (res) {}});
				
                /**
                 * 如果需要强制登录跳转回登录页面
                 */
                if (this.forcedLogin) {
                    /* uni.reLaunch({
                        url: '../user/login',
                    }); */
					appCommon.toLoginPage();
                }
            }/* ,
			toLoginPage(){
				uni.navigateTo({
				    url: '../user/login'
				});
			} */
        },onLoad() {
        },
		onShow(){
			if (!this.hasLogin) {
				appCommon.toLoginPage();
			}
		}
    }
</script>

<style>

</style>
