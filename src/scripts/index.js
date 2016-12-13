window.onload = function() {
	
	if(window.location.hash) {
		var elementName = window.location.hash.substr(1, window.location.hash.length);
		setTimeout(function(){
			$('a[name="discover"]')[0].scrollIntoView();
		}, 100);
		
	}
	
	//11 Mottos Dialog
	var mottosDialog = document.querySelector('#mottosDialog');
    var showMottosDialogLink = document.querySelector('#mottosLink');
    if (! mottosDialog.showModal) {
      dialogPolyfill.registerDialog(mottosDialog);
    }
    showMottosDialogLink.addEventListener('click', function() {
    	mottosDialog.showModal();
    });
    mottosDialog.querySelector('.close').addEventListener('click', function() {
    	mottosDialog.close();
    });
    
	//DOJO KUN Dialog
	var dojoKunDialog = document.querySelector('#dojoKunDialog');
    var showDojoKunDialogLink = document.querySelector('#dojoKunLink');
    if (! dojoKunDialog.showModal) {
      dialogPolyfill.registerDialog(dojoKunDialog);
    }
    showDojoKunDialogLink.addEventListener('click', function() {
    	dojoKunDialog.showModal();
    });
    dojoKunDialog.querySelector('.close').addEventListener('click', function() {
    	dojoKunDialog.close();
    });
};

