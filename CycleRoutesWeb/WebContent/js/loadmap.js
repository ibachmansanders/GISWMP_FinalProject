
window.map; //make map globally available
var tab_id;
var attractionMarkers=[];
var tweetMarkers=[];

//TEST -this needs to be dynamic later
tab_id={"tab_id":"3"};

function initialization() {
	var mapOptions = {
			mapTypeId : google.maps.MapTypeId.TERRAIN, // Set the type of Map
	    };
	  
	  // Render the map within the empty div
	  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	  
	  showSites(tab_id);
}

function toggleLayer(id){
	//identify which type of markers you're working with, create variable for array
	var markersArray;
	if(id == "1"){
		markersArray = attractionMarkers;
	} else {
		markersArray = tweetMarkers;
	};

	//IF the data hasn't been loaded yet, load it from the DB
	if (id == "1" && markersArray.length == 0){
		tab_id["tab_id"]=id;
		showSites(tab_id);
	} else if (id == "2" && markersArray.length == 0){
		tab_id["tab_id"]=id;
		showSites(tab_id);
	} else { //all data loaded?  Toggle/reverse visibility.
		//togglelayers (null) code
		for(i=0; i < markersArray.length; i++){
			if (markersArray[i].getMap() != null) {markersArray[i].setMap(null)}
			else {markersArray[i].setMap(map)};
		};
	};
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
  
  var bounds = new google.maps.LatLngBounds ();
  
  if (tab_id["tab_id"]=="1") {
	  loadAttractions(sites,bounds); //if we're loading attractions, fire the function
  };
  if (tab_id["tab_id"]=="2") {
	  loadGeoTweets(sites,bounds); //if we're loading attractions, fire the function
  };
  if (tab_id["tab_id"]=="3") {
	  loadRoutes(sites,bounds);
  };
  
  map.fitBounds(bounds);
}

function loadAttractions(sites,bounds) {
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
		 
		 //add marker to the attractions array
		 attractionMarkers.push(marker);
		 
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

function loadGeoTweets(sites,bounds) {
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
			
			//add marker to the tweets array
			 tweetMarkers.push(marker);
		});
	};
}

function loadRoutes(sites,bounds) {
	//only fires if sites have been specified
	  if (sites.length>0){
		  //store route coordinates in an array - initialize it
		  var routeCoord = [];
		  $.each(sites, function(i, e) {
			  console.log(e);
			  //response will be in String format, so parse to JSON
			  e = JSON.parse(e["json"]);
			  			  
			  //loop through coordinate arrays and capture lat lng
			  for (i=0; i < e["coordinates"].length; i++) {
				//create json object to hold coordinates
				  var coord = {};
				  //capture lat/lng from the e object
				  lng = e["coordinates"][i][0];
				  lat = e["coordinates"][i][1];
				  //assign to json
				  coord["lat"] = lat
				  coord["lng"] = lng
				  //push to array
				  routeCoord.push(coord);
				  
				  //update map bounds
				  var latlng = new google.maps.LatLng(lat,lng); //format
				  bounds.extend(latlng); //adjust extent
			  };
			  
			  var bikeRoute = new google.maps.Polyline({
				  path: routeCoord,
				  geodesic: true,
				  strokeColor: '#238b45',
				  strokeOpacity: 1.0,
				  strokeWeight: 2
			  });
			  
			  bikeRoute.setMap(map);
			  
			  //HOW TO HANDLE ROUTES?
			  //https://developers.google.com/maps/documentation/javascript/examples/polyline-simple
		 
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


//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
