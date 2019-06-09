<template>
    <view class="content com_page">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input type="text" focus clearable v-model.trim="loginName" placeholder="请输入账号"
						:maxlength="loginNameMaxLength" ></m-input>
            </view>
            <view class="input-row border">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model.trim="password" placeholder="请输入密码"
						:maxlength="passwordMaxLength"></m-input>
            </view>
			<view class="input-row border">
			    <text class="title">确认密码：</text>
			    <m-input type="password" displayable v-model.trim="passwordConfirm" placeholder="请再次输入密码"
						:maxlength="passwordMaxLength"></m-input>
			</view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="register">注册</button>
        </view>
    </view>
</template>

<script>
	import config from '../../resource/js/app/config.js';
	import md5 from '../../resource/js/plugin/md5.min.js';
	
    import service from '../../service.js';
    import mInput from '../../components/m-input.vue';

    export default {
        components: {
            mInput
        },
        data() {
            return {
                loginName: '',
                password: '',
				passwordConfirm:'',
				passwordEncry:'',
				loginNameMaxLength:16,
				passwordMaxLength:25
            }
        },
        methods: {
            register() {
                if (this.loginName.length < 3) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 3 个字符！',
						duration:config.DURATION_MIDDLE
                    });
                    return;
                }
				
				let regx = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
				if (!regx.test(this.loginName)){
					uni.showToast({
					    icon: 'none',
					    title: '账号不合法，正确格式为：字母开头，长度在3~16之间，允许字母数字下划线！',
						duration:config.DURATION_LONG
					});
					return;
				}
				
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符！',
						duration:config.DURATION_MIDDLE
                    });
                    return;
                }
				if (this.passwordConfirm.length < 6) {
				    uni.showToast({
				        icon: 'none',
				        title: '确认密码最短为 6 个字符！',
						duration:config.DURATION_MIDDLE
				    });
				    return;
				}
				if (this.password!=this.passwordConfirm){
					uni.showToast({
					    icon: 'none',
					    title: '两次输入的密码不一致！',
						duration:config.DURATION_MIDDLE
					});
					return;
				}
				this.passwordEncry = md5(this.password);
				
				uni.showLoading({title: '正在注册...',mask:true});
				let reqParam = {loginName : this.loginName,password : this.passwordEncry};
				
				uni.request({url:config.SERVER_URL+"sysUser/register.do",
							data:reqParam,
							dataType:'json',
							method:'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							success: (res) => {
								uni.hideLoading();
								if (res.data.success){
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
									
									uni.showToast({title:'注册成功！',icon:'none',duration:config.DURATION});
									uni.navigateBack({
									    delta: 1
									});
								}else{
									uni.showToast({title:'抱歉，注册失败！'+res.data.msg,icon:'none',duration:config.DURATION_MIDDLE});
								}
								
								
							},fail: (res) => {
								uni.hideLoading();
								uni.showToast({title:'抱歉，注册请求失败！',icon:'none',duration:config.DURATION});
							},complete: (res) => {
							}
						});	
            }
        }
    }
</script>

<style>

</style>
