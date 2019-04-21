let vSum = function(number){
	let regx = /^[1-9]{1}[0-9]{1,7}(.[0-9]{1,2})?$/g;
	if (regx.test(number)){
		return true;
	}else{
		return false;
	}
}

export {vSum}