<template>
    <view class="content">
        <view class="btn-row">
            <button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
            <button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
        </view>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        computed: {
            ...mapState(['hasLogin', 'forcedLogin'])
        },
        methods: {
            ...mapMutations(['logout']),
            bindLogin() {
				if (this.hasLogin) {
				    uni.showToast({title:'您已登录！',icon:'none'});
				}else{
					this.toLoginPage();
				}
            },
            bindLogout() {
                this.logout();
                /**
                 * 如果需要强制登录跳转回登录页面
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../login/login',
                    });
                }
            },
			toLoginPage(){
				uni.navigateTo({
				    url: '../login/login'
				});
			}
        },onLoad() {
            if (!this.hasLogin) {
                this.toLoginPage();
            }
        }
    }
</script>

<style>

</style>
