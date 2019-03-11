let vSum = function(number){
	let regx = /^[1-9]{1}[0-9]{1,7}(.[0-9]{1,2})?$/g;
	if (regx.test(number)){
		console.log("vSum true："+number);
		return true;
	}else{
		console.log("vSum false："+number);
		return false;
	}
}

export {vSum}