import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: false,
        hasLogin: false,
        // userName: "",
		loginName:"",
		token:""
    },
    mutations: {
		loginInit(state,userInfo) {
		    state.loginName = userInfo.loginName;
			state.token = userInfo.token;
		    state.hasLogin = true;
		}/* ,
        login(state, userName) {
            // state.userName = userName || '新用户';
            state.hasLogin = true;
        } */,
        logout(state) {
            // state.userName = "";
            state.hasLogin = false;
        }
    }
})

export default store
