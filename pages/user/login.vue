<template>
    <view class="com_content com_page">
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
		<!-- 
        <view class="action-row">
            <navigator url="../reg/reg">注册账号</navigator>
            <text>|</text>
            <navigator url="../pwd/pwd">忘记密码</navigator>
        </view>
		-->
    </view>
</template>

<script>
	import config from '../../resource/js/app/config.js';
    import {
        mapState,
        mapMutations
    } from 'vuex';
    import mInput from '../../components/m-input.vue';
	import md5 from '../../resource/js/plugin/md5.min.js';

    export default {
        components: {
            mInput
        },
        data() {
            return {
                loginName: '',
                password: '',
				passwordEncry:'',
                positionTop: 0
            }
        },
        computed: mapState(['forcedLogin','hasLogin','token']),
        methods: {
            ...mapMutations(['loginInit']),
            bindLogin() {// 登录事件
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
				this.passwordEncry = md5(this.password);
				
				this.login();
            },
			login(){// 登录请求
				uni.hideLoading();
				let tempURL = config.SERVER_URL+"login/login.do";
				let reqData = {loginSource:config.LOGINSOURCE,loginName : this.loginName,password : this.passwordEncry};
				
				uni.request({url:tempURL,data:reqData,dataType:'',
					success: (res) => {
						uni.hideLoading();
						
						// 缓存用户名、密码
						uni.setStorage({
							key: config.KEY_LOGIN_NAME,
							data: this.loginName,
							success:()=>{},
							complete:()=>{}
						});
						uni.setStorage({
							key: config.KEY_PASSWORD,
							data: this.password,
							success:()=> {},
							complete:()=>{}
						});
						uni.setStorage({
							key: config.KEY_PASSWORD_ENCRY,
							data: this.passwordEncry,
							success:()=> {},
							complete:()=>{}
						});
						
						if (res.data.success){
							uni.showToast({icon: 'none',title: '登录成功！',duration:config.DURATION});
							this.loginInit({"loginName":this.loginName,"token":res.data.token});
							this.toMain();
						}else{
							uni.showToast({icon: 'none',title: res.data.info,duration:config.DURATION});
						}
					},fail: (res) => {
						uni.hideLoading();
						uni.showToast({title:'登录请求失败！',icon:'none',duration:config.DURATION});
					},complete: (res) => {
					}
				});
			},
			autoFillLoginInfo(){// 自动填充登录信息
				uni.getStorage({key: config.KEY_LOGIN_NAME,
								success:(res)=> {
									this.loginName = res.data;
								},fail:(res)=> {
								},complete:(res)=> {
								}});
				uni.getStorage({key: config.KEY_PASSWORD,
								success:(res)=> {
									this.password = res.data;
								},fail:(res)=> {
								},complete:(res)=> {
								}});	
				uni.getStorage({key: config.KEY_PASSWORD_ENCRY,
								success:(res)=> {
									this.passwordEncry = res.data;
								},fail:(res)=> {
								},complete:(res)=> {
								}});
			},
			autoLogin(){// 自动登录
				if (this.loginName!=null && this.loginName!=''
					&& this.passwordEncry!=null && this.passwordEncry!=''){
					this.login();
				}
			},
            toMain() {
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                /* if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../main/main',
                    });
                } else {
                    uni.navigateBack();
                } */
				uni.reLaunch({
				    url: '/pages/account/expend/expend-list',
				});

            },
			initPosition() {
			    /**
			     * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			     * 反向使用 top 进行定位，可以避免此问题。
			     */
			    this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			}
        },
		onShow(){
			this.autoFillLoginInfo();
			if (!config.hasLogin){
				// this.autoLogin(); // 怀疑此处自动登录可能导致白屏或闪退，注掉实际观察验证一段时间
			}
		},
        onLoad() {
            this.initPosition();
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
