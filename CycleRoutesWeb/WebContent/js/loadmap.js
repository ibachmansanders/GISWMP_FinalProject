
var map;
var tab_id;

//TEST -this needs to be dynamic later
tab_id={"tab_id":"1"};

function initialization() {
  showSites(tab_id);
}

function toggleLayer(id){
	tab_id["tab_id"]=id;
	showSites(tab_id);
}

//onSubmit button fires attractions layer
$("#toggleAttractions").click(function(){toggleLayer("1")}); //once submit is clicked, show map with attractions
$("#toggleTweets").click(function(){toggleLayer("2")}); //same for tweets

function showSites(tab_id) {
  $.ajax({
    url: 'HttpServlet',
    type: 'POST', //keeps data secure and out of the URL. Also, it's a lot of Java to fit in HTML,
	data: tab_id, //use tab_id as an identifier- here to simply load attractions (attractions = id1)
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
  
  if (tab_id["tab_id"]=="1") {
	  loadAttractions(sites,map,bounds); //if we're loading attractions, fire the function
  };
  if (tab_id["tab_id"]=="2") {
	  loadGeoTweets(sites,map,bounds); //if we're loading attractions, fire the function
  };
  
  map.fitBounds(bounds);
}

function loadAttractions(sites,map,bounds) {
  //only fires if sites have been specified
  if (sites.length>0){
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
  };

}

function loadGeoTweets(sites,map,bounds) {
	//only fires if sites have been specified
	if (sites.length>0){
		$.each(sites, function(i, e) {
		
			//isolate lat/lon
			var lat = e["latitude"]; //collect lat/long from coordinates
			var long = e["longitude"];
		  
			//format points to set boundaries
			var latlng = new google.maps.LatLng(lat, long);
			
			//adjust map extent to fit markers
			bounds.extend(latlng);
			
			//add marker to map
			var marker = new google.maps.Marker({
				position:latlng,
				map:map //adds the marker to the map
			});
		});
	};
}


//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
