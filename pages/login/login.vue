<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input class="m-input" type="text" clearable focus v-model="loginName" placeholder="请输入账号"></m-input>
            </view>
            <view class="input-row">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
            </view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="bindLogin">登录</button>
        </view>
        <view class="action-row">
            <navigator url="../reg/reg">注册账号</navigator>
            <text>|</text>
            <navigator url="../pwd/pwd">忘记密码</navigator>
        </view>
    </view>
</template>

<script>
	import config from '../../resource/js/app/config.js';
    import service from '../../service.js';
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import mInput from '../../components/m-input.vue'

    export default {
        components: {
            mInput
        },
        data() {
            return {
                loginName: config.TEST_LOGIN_NAME,
                password: '',
                positionTop: 0
            }
        },
        computed: mapState(['forcedLogin','hasLogin','token']),
        methods: {
            ...mapMutations(['loginInit']),
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
            bindLogin() {
                if (this.loginName.length < 1) {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入账号'
                    });
                    return;
                }
                if (this.password.length < 1) {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入密码'
                    });
                    return;
                }
				
				this.login();
            },
			login(){
				let tempURL = config.SERVER_URL+"login/login.do";
				let reqData = {loginSource:"M",loginName : config.TEST_LOGIN_NAME,password : config.TEST_LOGIN_PWD};
				// let reqData = {loginSource:"M",loginName : this.loginName,password : this.password};
				
				let reqObj = {url:tempURL,data:reqData,dataType:'',
					success: (res) => {
						/* console.log("login success："+JSON.stringify(res.data)); */
						if (res.data.success){
							uni.showToast({icon: 'none',title: '登录成功！'});
							this.loginInit({"loginName":this.loginName,"token":res.data.token});
							this.toMain();
						}else{
							uni.showToast({
							    icon: 'none',
							    title: res.data.info
							});
						}
					},fail: (res) => {
						uni.showToast({title:'登录请求失败！'+JSON.stringify(res.data),icon:'none',duration:this.duration+500});
					},complete: (res) => {
					}};
				uni.request(reqObj);
			},
            toMain() {
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../main/main',
                    });
                } else {
                    uni.navigateBack();
                }

            }
        },
        onLoad() {
            this.initPosition();
            // this.initProvider();
        }
    }
</script>

<style>
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 20upx;
    }
</style>
