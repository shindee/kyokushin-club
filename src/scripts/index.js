window.onload = function() {
	
	if(window.location.hash) {
		var elementName = window.location.hash.substr(1, window.location.hash.length);
		setTimeout(function(){
			$('a[name="discover"]')[0].scrollIntoView();
		}, 100)
		
	}
};

