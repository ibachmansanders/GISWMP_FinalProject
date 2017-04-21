
var map;

function initialization() {
  showSites();
}

function showSites() {
  $.ajax({
    url: 'HttpServlet',
    type: 'POST', //keeps data secure and out of the URL. Also, it's a lot of Java to fit in HTML,
	data: {"tab_id": "1"}, //use tab_id as an identifier- here to simply load attractions (attractions = id1)
    success: function(sites) { 
    	mapInitialization(sites);
    },
    error: function(xhr, status, error) {
    	alert("LOADMAP An AJAX error occured: " + status + "\nError: " + error);
    }
  });
}

function mapInitialization(sites) {
	console.log(sites);
  var mapOptions = {
    mapTypeId : google.maps.MapTypeId.ROADMAP, // Set the type of Map
      	};
  
  // Render the map within the empty div
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  
  var bounds = new google.maps.LatLngBounds ();
  
  $.each(sites, function(i, e) {
	  
	  //response will be in String format, so parse to JSON
	  e = JSON.parse(e["json"]);

	  //isolate lat/lon
	  var lat = e["coordinates"][1]; //collect lat/long from coordinates
	  var long = e["coordinates"][0];
	  
	  //format points to set boundaries
	 var latlng = new google.maps.LatLng(lat, long);
	 console.log(lat,long);
	 
	 bounds.extend(latlng);
	  
	 
	 var marker = new google.maps.Marker({
		 position:latlng,
		 map:map //adds the marker to the map
	 });
	 
	/*  
	var start_point = Number(e['start_point']);
    var end_point = Number(e['end_point']);
    var road_segment = new google.maps.LatLng(start_point, end_point); 
    
    bounds.extend(latlng);

    // TODO Create the polylines
    var road = new google.maps.Polyline({ // Set the marker
    	path: road_segment, 
    	geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    road.setMap(map);
    */
    
  });

  map.fitBounds(bounds);

}


//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
