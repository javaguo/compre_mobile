import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        forcedLogin: true,// 是否需要强制登录
        hasLogin: false,
		loginName:"",
		token:"",
		userName:''
    },
    mutations: {
		loginInit(state,userInfo) {
		    state.loginName = userInfo.loginName;
			state.token = userInfo.token;
		    state.hasLogin = true;
		},
        logoutDestroy(state) {
            state.hasLogin = false;
			state.loginName = "";
			state.token = "";
        }
    }
})

export default store
