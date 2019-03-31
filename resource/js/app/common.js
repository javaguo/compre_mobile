const toLoginPage = function () {
    /* uni.navigateTo({
        url: '/pages/user/login'
    }); */
	uni.reLaunch({
	    url: '/pages/user/login'
	});
}

export default {
    toLoginPage
}
