// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
var token = '';

const getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(USERS_KEY);
    if (!ret) {
        ret = '[]';
    }
    return JSON.parse(ret);
}

const addUser = function (userInfo) {
    let users = getUsers();
    users.push({
        account: userInfo.account,
        password: userInfo.password
    });
    uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}

function login(){
	// let tempURL = "http://localhost:8101/login/login.do";// 开发环境
	let tempURL = "http://39.104.162.221:8102/per/login/login.do";// 测试环境
	
	let reqData = {loginSource:"M",loginName : "zjg",password : "c696360395cb2338d78f9682de683f7e"}; // 开发环境
	// let reqData = {loginSource:"M",loginName : "zjg",password : "c696360395cb2338d78f9682de683f7e"};// 测试环境
	
	
	let reqObj = {url:tempURL,data:reqData,dataType:'',
		success: (res) => {
			/* console.log("success："+JSON.stringify(res.data));
			console.log("success："+res.data.success);
			console.log("res.data.token："+res.data.token);
			console.log("token："+token); */
			if (res.data.success){
				uni.showToast({
				    icon: 'none',
				    title: '登录成功！'
				});
			}
			token = res.data.token;
			/* console.log("token2："+token); */
		},fail: (res) => {
			uni.showToast({title:'登录请求失败！'+JSON.stringify(res.data),icon:'none',duration:this.duration+500});
			/* console.log("fail："+JSON.stringify(res.data)); */
		},complete: (res) => {
			/* console.log("complete："+JSON.stringify(res.data)); */
		}};
	uni.request(reqObj);
}

function getToken(){
	console.log("getToken："+token);
	return token;
}

export default {
    getUsers,
    addUser,
	login,
	getToken,
	token
}
