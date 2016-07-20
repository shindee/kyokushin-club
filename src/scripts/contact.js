var dojoMap;
function initDojoMap(){
	
		var location = new google.maps.LatLng(50.80588,4.34067);
		var mapDiv = document.getElementById('googleMapsDojoDiv');
		dojoMap = new google.maps.Map(mapDiv, {
		        center: location,
		        zoom: 17
		    });
	
	
   
    
    
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">Kyokushin Bruxelles Club</h1>'+
    '<div id="bodyContent">'+
    '</div>'+
    '</div>';

	//var infowindow = new google.maps.InfoWindow({
	//  content: contentString
	//});
	
	
	
	var marker = new MarkerWithLabel({
		position: location,
	    map: dojoMap,
	    //animation: google.maps.Animation.DROP,
	   // labelContent: "DOJO",
	   // labelAnchor: new google.maps.Point(15, 70),
	   // labelClass: "dojo-label", // the CSS class for the label
	  //  labelInBackground: false,
       // icon: pinSymbol('red')
	});
	
	
	//infowindow.open(map, marker);
	
	/*var iw = new google.maps.InfoWindow({
    content: "Home For Sale"
	});
*/
	//google.maps.event.addListener(marker, "click", function (e) {
	// infowindow.open(map, this);
  //  });
    
	
}

function initParkMap(){
	var clubParkLocation = new google.maps.LatLng(50.893157,4.363009);
	var mapParkDiv = document.getElementById('googleMapsParkDiv');
	var parkMap = new google.maps.Map(mapParkDiv, {
	        center: clubParkLocation,
	        zoom: 17
	    });
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 2,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 2
    };
}

window.onload = function() {
	initDojoMap();
	$('a[href="#park-panel"]').on('click',function(){
		initParkMap();
	});
	
	$('#loadingSpinner').hide();
	$('#mapsContent').show();
};

function initParkMap() {
    var mapCanvas = document.getElementById('googleMapsParkDiv');
    var location = new google.maps.LatLng(50.893157, 4.363009);
    var mapOptions = {
        center: location,
        zoom: 17
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
    
    setTimeout(function () {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(mapOptions.center);
        
        var marker = new MarkerWithLabel({
    		position: location,
    	    map: map,
    	    //animation: google.maps.Animation.DROP,
    	   // labelContent: "DOJO",
    	   // labelAnchor: new google.maps.Point(15, 70),
    	   // labelClass: "dojo-label", // the CSS class for the label
    	  //  labelInBackground: false,
           // icon: pinSymbol('red')
    	});
    }, 500);
}

//$(document).ready(function() {
	  // Handler for .ready() called.
	
	//run this after all content has been downloaded
	//setTimeout(function () {
		
   // }, 1000);
//});
