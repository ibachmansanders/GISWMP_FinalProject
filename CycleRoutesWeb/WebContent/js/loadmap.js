window.map; //make map globally available
var tab_id;
var infoBox = new InfoBox();
var attractionMarkers=[];
var tweetMarkers=[];
var routesArray = []; //holds routes
var startMarkers = []; //holds start markers
var endMarkers = []; //holds destination markers
var sourceCoord = []; //holds start coordinates
var targetCoord = []; //holds destination coordinates

//TEST -this needs to be dynamic later
tab_id=1;

function initialization() {
	var mapOptions = {
			mapTypeId : google.maps.MapTypeId.TERRAIN, // Set the type of Map
	    };
	  
	// Render the map within the empty div
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	  
	google.maps.event.addListener(map, 'click', function() {
        infoBox.close();
	}); 
	  
	showSites(tab_id,sourceCoord,targetCoord);
}

function toggleLayer(id,sourceCoord,targetCoord){
	//identify which type of markers you're working with, create variable for array
	var markersArray;
	if(id == "1"){
		markersArray = attractionMarkers;
	} else if (id == "2") {
		markersArray = tweetMarkers;
	} else {
		markersArray = routesArray; //directions button
	};

	//IF the data hasn't been loaded yet, load it from the DB
	if (id == "1" && markersArray.length == 0){
		tab_id=id;
		showSites(tab_id);
	} else if (id == "2" && markersArray.length == 0){
		tab_id=id;
		showSites(tab_id);
	} else if (id == "3"){ //TODO YOU NEED TO HAVE A WAY TO RESET ROUTES
		//make existing routes,route markers, tweets,and attractions null
		var allArrays = [routesArray,startMarkers,endMarkers,tweetMarkers,attractionMarkers];
		$.each(allArrays,function(i,e){
			for(i=0;i<e.length;i++) {
				if(e[i].getMap() != null) {e[i].setMap(null)};
			};
		});
		tab_id=id;
		showSites(tab_id,sourceCoord,targetCoord);
	} else { //all data loaded?  Toggle/reverse visibility.
		//togglelayers (null) code
		for(i=0; i < markersArray.length; i++){
			if (markersArray[i].getMap() != null) {markersArray[i].setMap(null)}
			else {markersArray[i].setMap(map)};
		};
	};
}

//onSubmit button fires attractions layer
$("#toggleAttractions").click(function(){toggleLayer("1",sourceCoord,targetCoord)}); //once submit is clicked, show map with attractions
$("#toggleTweets").click(function(){toggleLayer("2",sourceCoord,targetCoord)}); //same for tweets
$("#getDirections").click(function(){toggleLayer("3",sourceCoord,targetCoord)}); //same for directions

function showSites(tab_id,sourceCoord,targetCoord) {
	var a = []; //empty data array;
	//populate a with name:value pairs for HttpServlet
	a.push({name: "tab_id",value: tab_id});
	a.push({name: "sourceCoord",value: sourceCoord});
	a.push({name: "targetCoord",value: targetCoord});
	a = a.filter(function(item){return item.value != '';}); //erase any empty arrays
    $.ajax({
      url: 'HttpServlet',
      type: 'POST', //keeps data secure and out of the URL. Also, it's a lot of Java to fit in HTML,
	  data: a, //use tab_id as an identifier- here to simply load attractions (attractions = id1)
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
  
  if (tab_id=="1") {
	  loadAttractions(sites,bounds); //if we're loading attractions, fire the function
  };
  if (tab_id=="2") {
	  loadGeoTweets(sites,bounds); //if we're loading attractions, fire the function
  };
  if (tab_id=="3") {
	  loadRoutes(sites,bounds);
  };
  
  map.fitBounds(bounds);
}

function loadAttractions(sites,bounds) {
	//only fires if sites have been specified
	if (sites.length>0){
		$.each(sites, function(i, e) {
			//isolate name and text
			var name = e["name"];
			var text = e["text"];
			var html = "<b>"+name+"</b><br>"+text;
			var dataType = "attractions";
			
			//response will be in String format, so parse to JSON
			e = JSON.parse(e["json"]);
		
			//isolate lat/lon
			var lat = e["coordinates"][1]; //collect lat/lng from coordinates
			var lng = e["coordinates"][0];
		  
			//format points to set boundaries
			var latlng = new google.maps.LatLng(lat, lng);
		 
			bounds.extend(latlng);		  
			
			var marker = createMarker(latlng,name,html,dataType,attractionMarkers);
	    
	  });
  };

}

function loadGeoTweets(sites,bounds) {
	//only fires if sites have been specified
	if (sites.length>0){
		$.each(sites, function(i, e) {
		
			//isolate lat/lon
			var lat = e["latitude"]; //collect lat/lng from coordinates
			var lng = e["longitude"];
		  
			//format points to set boundaries
			var latlng = new google.maps.LatLng(lat, lng);
			
			//adjust map extent to fit markers
			bounds.extend(latlng);
			
			//isolate name and text
			var name = e["name"];
			var text = e["text"];
			var html = "<b>"+name+"</b><br>"+text;
			var dataType = "tweets";
			
			var marker = createMarker(latlng,name,html,dataType,tweetMarkers);
			

		});
	};
}

//Function to create a google marker and set up event window
// from https://gist.github.com/phirework/4771983
// removed "category" from function parameters since we don't categorize the tweets yet.
//function createMarker(latlng, name, html, category) {
function createMarker(latlng, name, html, dataType,markers) {
    // block to make different marker symbols for the "dataType" parameter.
    if (dataType == "tweets") {
        var myIcon = {
        		url: 'img/tweets.svg',
        		scaledSize: new google.maps.Size(40,40),
        }
        var backgroundColor = "rgba(64,153,255,0.6)";
        
    } else if (dataType == "attractions") {
        var myIcon = {
        		url: 'img/attractions.svg',
        		scaledSize: new google.maps.Size(40,40),
        }
        var backgroundColor = "rgba(120,120,120, 0.6)";
    } else if (dataType == "routeStart") {
    	var myIcon = {
    			url: 'img/routeStart.png',
    	}
    	var backgroundColor = "rgba(35,139,69,0.6)";
    } else if (dataType == "routeEnd") {
    	var myIcon = {
    			url: 'img/routeEnd.png',
    	}
    	var backgroundColor = "rgba(35,139,69,0.6)";
    }

    var marker = new google.maps.Marker({
        position: latlng,
        //        icon: category + ".png",
        icon: myIcon,
        map: map,
        title: name,
        zIndex: Math.round(latlng.lat()*-100000)<<5 //makes sure markers don't stack by latitude
    });
    
    //animate markers :)
    marker.setAnimation(google.maps.Animation.DROP);

    // === Store the category and name info as a marker properties ===
    //      marker.mycategory = category; TODO? What is the purpose of this?  
    marker.myname = name;
    
    google.maps.event.addListener(marker, 'click', function() {
    	var myOptions = setInfoBoxOptions(latlng.lat(),latlng.lng(),name,html,backgroundColor,dataType) //NOTE that we have to pass latln.lat(), latlng.lng(), not latlng (which is a google object and not workable) for the functions to access both lat lng in the directions
        infoBox.setOptions(myOptions)
        infoBox.open(map, this);
        
    });
    
    //push marker to the current array
    markers.push(marker);
}; // end createMarker


//set up infoBox to include directions button, capture lat/lng
function setInfoBoxOptions(lat,lng,name,html,backgroundColor,dataType) {
	//create a div to style
	var infoBoxDiv = document.createElement("div");
	//style the div
	infoBoxDiv.style.cssText = "margin-top: 30px; background: " + backgroundColor + "; padding: 10px; border-radius: 5px; color: #fff";
    var fullContent = name 
    infoBoxDiv.innerHTML = html; 
    
    if (dataType != "routeStart"&&dataType!="routeEnd") {
	    //create the start/end buttons
	    //NOTE the onclick functions!
	    var startButton = "<p><button type='button' id='startbutton' onclick='getStartCoords("+lat+","+lng+")'>Ride from Here</button></p>";
	    var endButton = "<p><button type='button' id='endbutton' onclick='getEndCoords("+lat+","+lng+")'>Ride to Here</button></p>";
	    var addNavButtons = startButton + endButton;
	    //add them to the infoBox html
	    infoBoxDiv.innerHTML += addNavButtons;
    };
    
    //configure options
    var infoBoxOptions = {
            content: infoBoxDiv,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-125, -30), //centers infobox on the marker
            zIndex: null,
            boxStyle: { 
                width: "250px",
            },
            closeBoxURL: "",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
        };
    
    return infoBoxOptions;
}


function loadRoutes(sites,bounds) {
	//only fires if sites have been specified
	  if (sites.length>0){
		  //store route coordinates in an array - initialize it
		  var routeCoord = [];
		  //TODO sites length should be 1 here, so should we get rid of $.each?
		  $.each(sites, function(i, e) {
			  //response will be in String format, so parse to JSON
			  e = JSON.parse(e["json"]);
			  
			  //TEST
			  /*
			  console.log(e);
			  console.log(e["coordinates"].length);
			  console.log(e["coordinates"][0]);
			  console.log(e["coordinates"][e["coordinates"].length-1]);
			  */

			  //loop through coordinate arrays and capture lat lng
			  for (i=0; i < e["coordinates"].length; i++) {
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
			  
			  //add route to map
			  bikeRoute.setMap(map);
			  
			  //add route to Array
			  routesArray.push(bikeRoute);
			  
			  //marker start and end
			  var start = e["coordinates"][0]; //isolate starting coordinates
			  //format coordinates for marker
			  var latlng = new google.maps.LatLng(start[1],start[0]);	
			  //define name and text
			  var name = "Start";
			  var length = google.maps.geometry.spherical.computeLength(bikeRoute.getPath()); //calculate route length using Google Geometry library
			  var lengthMiles = Math.round(length*0.000621371*10)/10; //convert to miles
			  var text = "Length: " + lengthMiles +" miles";
			  var html = "<b>"+name+"</b><br>"+text;
		  	  var dataType = "routeStart";
			  createMarker(latlng,name,html,dataType,startMarkers);
			  
			  var end = e["coordinates"][e["coordinates"].length-1]; //isolate ending coordinates
			  //format coordinates for marker
			  latlng = new google.maps.LatLng(end[1],end[0]);	
			  //define name and text
			  name = "End";
			  text = "Length: " + lengthMiles +" miles";
			  html = "<b>"+name+"</b><br>"+text;
		  	  dataType = "routeEnd";
			  createMarker(latlng,name,html,dataType,endMarkers);
		    
		  });
	  };
}

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);

//GLOBAL FUNCTIONS available to the html
function getStartCoords(lat,lng) {
	sourceCoord = [lng,lat];
	//TEST
	console.log(sourceCoord);
	$('#startbox').val(sourceCoord);//set start input field to show the coordinates
}

function getEndCoords(lat,lng) {
	targetCoord = [lng,lat];
	//TEST
	console.log(targetCoord);
	$('#endbox').val(targetCoord); //set end input field to show the coordinates
}

