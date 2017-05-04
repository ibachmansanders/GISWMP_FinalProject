window.map; //make map globally available
var tab_id;
var infoBox = new InfoBox();
var attractionMarkers=[];
var tweetMarkers=[];
var openMarkers = []; //holds user-made markers
var routesArray = []; //holds routes
var startMarkers = []; //holds start markers
var endMarkers = []; //holds destination markers
var sourceCoord = []; //holds start coordinates
var targetCoord = []; //holds destination coordinates
var geocoder = new google.maps.Geocoder; //to translate lat/lng into an address
//load visualization packages
google.charts.load('current', {'packages':['corechart']});

//set initial layer value
tab_id=1;

function initialization() {
	var mapOptions = {
			mapTypeId : google.maps.MapTypeId.TERRAIN, // Set the type of Map
			mapTypeControl: true,
		    mapTypeControlOptions: {
		        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		        position: google.maps.ControlPosition.BOTTOM_CENTER
		    }
	    };
	  
	// Render the map within the empty div
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
	
	//allow users to dblclick to create markers
	createMark(map);
	
	//trigger start/endbox to autocomplete addresses
	initAutocomplete();
	
	//allow users to enter addresses, and create a marker
	setGeocoder();
	
	//populate sidePanel with welcomePanel info
	welcomePanel();
	
	//setup widgets
	widgets();
	
	showSites(tab_id,sourceCoord,targetCoord);
	
	//enable tooltips
	$('[data-toggle="tooltip"]').tooltip();
}


function createMark(map) {
	//create an anon marker on dblclick
	google.maps.event.addListener(map, 'dblclick', function(event) { //listener
		//get latlng
		var lat = event.latLng.lat();
		var lng = event.latLng.lng();
		var latlng = new google.maps.LatLng(lat,lng);
		//set up marker parameters using geocoder
		geocoder.geocode({'location': latlng},function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var text = results[0].formatted_address;
				//set up marker parameters
				var name = "Address:";
				var html = "<b>"+name+"</b><br>"+text+"<br>";
				var dataType = "open"; //general markers- for styling
				var markers = openMarkers;
				var marker;
				marker= createMarker(latlng, name, html, dataType, markers)
			}else{
				alert(status);
			}
		});
	});
}


function initAutocomplete() { //gets set up on window load
	autocompleteSource = new google.maps.places.Autocomplete(document.getElementById('startbox')); //create a Google Autocomplete object
	autocompleteTarget =  new google.maps.places.Autocomplete(document.getElementById('endbox'));
	//when user selects an address (place_changed), active onPlaceChanged function as the place option in autocomplete
}


function setGeocoder() {
	var geocoder = new google.maps.Geocoder();
	document.getElementById('startbox').addEventListener('keydown',function(e) {
		if ( $('#startbox').val() != []) { //catch empty submissions, lest the user is sent to Florida...
			if (e.keyCode == 13 || e.keyCode == 9) { //fire function on 'tab key' - 9
				geocodeAddress(geocoder,map,'startbox',sourceCoord);
			};
		};
	});
	document.getElementById('endbox').addEventListener('keydown',function(e) {
		if ( $('#endbox').val() != []) { //catch empty submissions, lest the user is sent to Florida...
			if (e.keyCode == 13 || e.keyCode == 9) { //fire function on 'tab key' - 9
				geocodeAddress(geocoder,map,'endbox',targetCoord);
			};
		};
	});
	document.getElementById('startbox').addEventListener('blur',function(e) {
		//on clickOut
		if ( $('#startbox').val() != []) { //catch empty submissions, lest the user is sent to Florida...
			geocodeAddress(geocoder,map,'startbox',targetCoord);
		};
	});
	document.getElementById('endbox').addEventListener('blur',function(e) {
		//on clickOut
		if ( $('#endbox').val() != "") { //catch empty submissions, lest the user is sent to Florida...
			geocodeAddress(geocoder,map,'endbox',targetCoord);
		};
	});
}


function welcomePanel() {
	
	var sidePanelContent = $('#sidePanelContent'); //panel content to collapse or show
	sidePanelContent.collapse({toggle: true}); //avoids any errors onLoad for toggling the panel
	var expandArrow = $("#panelButton");
	expandArrow.html('<img alt="collapse" id="panelButtonImg" src="img/hashArrow.png">');
	
	//have arrow change based on visibility of the panel information
	expandArrow.click(function(){
		if (expandArrow.html() == '<img alt="collapse" id="panelButtonImg" src="img/hashArrow.png">') {
			expandArrow.html('<img alt="collapse" id="panelButtonImg" src="img/hashArrowDown.png">');
			sidePanelContent.collapse("hide");
		} else {
			expandArrow.html('<img alt="collapse" id="panelButtonImg" src="img/hashArrow.png">');
			sidePanelContent.collapse("show");
		};
	})
	
	var panelContent = $("#sidePanelContent");
	var html = "<h2>Cycle Routes</h2><br><p>This map will show you the safest and most enjoyable bike routes in Duluth.<br>Create routes by searching for an address, selecting attractions or tweets on the map, or double clicking anywhere on the map to create your own destination.  Safe travels.</p>"
	panelContent.html(html);
}


function widgets(){
	//widget to display help info
	var helpWidget = $("#help");
	html = "<img src = 'img/help.png' id='helpImg' class='widget' alt='help' data-toggle='tooltip' data-placement='bottom' title='Walkthrough'>";
	helpWidget.html(html);
	//widget to allow user to locate self and use as starting point
	var locateWidget = $("#locateMe");
	html = "<img src = 'img/locateMe.png' id='locateMeImg' class='widget' alt='use gps' data-toggle='tooltip' data-placement='bottom' title='Use GPS'>";
	locateWidget.html(html);
	var resetView = $("#resetView");
	html = "<img src = 'img/resetView.png' id='resetViewImg' class='widget' alt='reset map view' data-toggle='tooltip' data-placement='bottom' title='Reset the Map'>";
	resetView.html(html);
	//reset view onClick recenters the map
	resetView.click(function() {
		map.setCenter({lat: 46.7615612352751, lng: -92.15266549999996});
		map.setZoom(12);
	});
	//locateWidget onClick uses User's GPS location
	locateWidget.click(function(){
		userLocation();
	});
	
    // add event listeners for about panel 
    aboutWidget = $("#aboutbutton");
    aboutWidget.click(function(){
        if ($("#aboutuspanel").css("display") == "block") {
            $("#aboutuspanel").css("display", "none");
        } else {
            $("#aboutuspanel").css("display", "block");
        };
    }); 
    
	//a few nifty triggers to close map clutter onClick
	google.maps.event.addListener(map, 'click', function() {
        infoBox.close();
	}); 
	google.maps.event.addListener(map,'click', function() {
		$("#aboutuspanel").css("display", "none");
	});
};


//allow user to use GPS location as starting point
function userLocation() {
	//onClick, user is asked to allow to use location- IF it is allowed, create a marker at that point and set it as the start location
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			var latlng = new google.maps.LatLng(lat,lng);
			var name;
			var text = "Coordinates: "+Math.round(lat*10000)/10000+", "+Math.round(lng*10000)/10000; //show to four decimals
			var dataType = 'routeStart'; //don't show directions to/from
			var markers = openMarkers; //add these to the open markers
			map.setCenter(latlng); //set center at your location
			//use geocoder to find address location, use it as name and create marker
			geocoder.geocode({'location': latlng}, function(results, status,name){
				if (status === 'OK') { //if the geocode works
					if (results[0]) { //if street address results exist
						name = results[0].formatted_address;//set start input field to show the reversed-geocoded street address based on coords
						var html = "<b>"+name+"</b><br>"+text;
						marker= createMarker(latlng, name, html, dataType,markers);
					} else if (results[1]) {
						name = results[1].formatted_address;//set start input field to show the reversed-geocoded neighborhood based on coords
						var html = "<b>"+name+"</b><br>"+text;
						marker= createMarker(latlng, name, html, dataType,markers);
					} else {
						name = "Your Location";
						var html = "<b>"+name+"</b><br>"+text;
						marker= createMarker(latlng, name, html, dataType,markers);
					};
				};
			});
			getStartCoords(lat,lng); //send the marker coordinates to this function to populate the startbox text, georeferenced, and set sourceCoords etc.
		});
	};
}


function geocodeAddress(geocoder,map,box,whichCoord) {
	var address = document.getElementById(box).value; //get address from input box (startbox or endbox)
	geocoder.geocode({'address':address},function(results,status) { //geocode!
		if(status === 'OK') { //if address geocodes succesfully:
			map.setCenter(results[0].geometry.location); //center on address
			//get latlng
			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();
			var latlng = new google.maps.LatLng(lat,lng);
			//set up marker parameters
			var name = address;
			var text = "Coordinates: "+Math.round(lat*10000)/10000+", "+Math.round(lng*10000)/10000; //show to four decimals
			var html = "<b>"+name+"</b><br>"+text;
			var dataType = "open"; //general markers- for styling
			var markers = openMarkers;
			var marker;
			//create the marker, add it to the map
			marker= createMarker(latlng, name, html, dataType,markers);
			//set the target/source coord to this location
			if (box == 'startbox') {sourceCoord = [lng,lat];};
			if (box == 'endbox') {targetCoord = [lng,lat];};
		}
	})
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
	} else if (id == "3"){ 
		//make existing routes,route markers, tweets,and attractions null
		var allArrays = [routesArray,startMarkers,endMarkers,tweetMarkers,attractionMarkers,openMarkers];
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

//BUTTON INTERACTIVITY
//onSubmit button fires attractions layer
$("#toggleAttractions").click(function(){
	toggleLayer("1",sourceCoord,targetCoord);
	if (attractionMarkers[0].getMap() != null) {
		$(this).addClass("active");
	} else {
		$(this).removeClass("active");
	};
}); //once submit is clicked, show map with attractions
$("#toggleTweets").click(function(){
	toggleLayer("2",sourceCoord,targetCoord);
	if(tweetMarkers.length == 0) {
		$(this).addClass("active"); //for the first time tweets are loaded
	} else if (tweetMarkers[0].getMap() != null) {
		$(this).addClass("active");
	} else {
		$(this).removeClass("active");
	};
}); //once submit is clicked, show map with tweets
$("#getDirections").click(function(){
	//attractions and tweets will be removed, so adjust their styling accordingly
	$("#toggleAttractions").removeClass("active");
	$("#toggleTweets").removeClass("active");
	toggleLayer("3",sourceCoord,targetCoord)
	}); //once submit is clicked, show map with directions


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
    	  alert("That location is outside of Duluth.  Please select a location closer to the city.");
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
	  loadRouteNames(sites,bounds);
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
        var backgroundColor = "rgba(64,153,255,0.8)";
        
    } else if (dataType == "attractions") {
        var myIcon = {
        		url: 'img/attractions.svg',
        		scaledSize: new google.maps.Size(40,40),
        }
        var backgroundColor = "rgba(120,120,120, 0.8)";
    } else if (dataType == "routeStart") {
    	var myIcon = {
    			url: 'img/routeStart.png',
    			scaledSize: new google.maps.Size(20,20),
    			origin: new google.maps.Point(0,0),
    			anchor: new google.maps.Point(10,10)
    	}
    	var backgroundColor = "rgba(44,162,95,0.8)";
    } else if (dataType == "routeEnd") {
    	var myIcon = {
    			url: 'img/routeEnd.png',
    			scaledSize: new google.maps.Size(20,20),
    			origin: new google.maps.Point(0,0),
    			anchor: new google.maps.Point(10,10)
    	}
    	var backgroundColor = "rgba(44,162,95,0.8)";
    } else if (dataType == "open") {
    	var myIcon = {
    			url: 'img/open.svg',
    			scaledSize: new google.maps.Size(40,40),
    	}
    	var backgroundColor = "rgba(44,162,95,0.8)";
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
 
    marker.myname = name;
    
    google.maps.event.addListener(marker, 'click', function() {
    	var myOptions = setInfoBoxOptions(latlng.lat(),latlng.lng(),name,html,backgroundColor,dataType) //NOTE that we have to pass latln.lat(), latlng.lng(), not latlng (which is a google object and not workable) for the functions to access both lat lng in the directions
        infoBox.setOptions(myOptions)
        infoBox.open(map, this);
    });
    if (dataType == "open") { //IF the marker is user created, open it
    	google.maps.event.trigger(marker, 'click');
    };
    
    //push marker to the current array
    markers.push(marker);
}; // end createMarker


//set up infoBox to include directions button, capture lat/lng
function setInfoBoxOptions(lat,lng,name,html,backgroundColor,dataType) {
	//create a div to style
	var infoBoxDiv = document.createElement("div");
	//style the div
	infoBoxDiv.style.cssText = "margin: auto; background: " + backgroundColor + "; padding: 10px; border-radius: 5px; color: #fff; display: inline-block;";
    var fullContent = name 
    infoBoxDiv.innerHTML = html; 
    
    if (dataType != "routeStart"&&dataType!="routeEnd") {
	    //create the start/end buttons
	    //NOTE the onclick functions!
	    var endButton = "<button type='button' id='endbutton' class='btn btn-default' onclick='getEndCoords("+lat+","+lng+")'><img src = 'img/directionsEnd.png' class='directionsImg' alt='Ride to Here'></button>";
	    var startButton = "<br><button type='button' id='startbutton' class='btn btn-default' onclick='getStartCoords("+lat+","+lng+")'><img src = 'img/directionsStart.png' class='directionsImg' alt='Ride from Here'></button>";
	    var addNavButtons = startButton + endButton;
	    //add them to the infoBox html
	    infoBoxDiv.innerHTML += addNavButtons;
    };
    
    //configure options
    var infoBoxOptions = {
            content: infoBoxDiv,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-125, 30), //centers infobox on the marker
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
	  //only fires if sites have been specified (at least two responses will come from the server- street names and geojson)
	  if (sites.length>1){
		  //close the welcome panel
		  if ($('#sidePanelContent').css('height') > "0px") {
			  $("#panelButton").trigger("click");
		  };
		  
		  //store route coordinates in an array - initialize it
		  var routeCoord = [];
		  
		  //iterate through each site, and load
		  $.each(sites, function(i, e) {
			  //response will be in String format, so parse to JSON
			  if (e["json"]){
				  e = JSON.parse(e["json"]);
	
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
				  
				  //capture elevation from google maps
				  var elevator = new google.maps.ElevationService;
				  
				  //create elevation profile, with one entry for every routeCoord location
				  //limit samples so graph doesn't crash
				  var samples;
				  if (routeCoord.length <= 500) {
					  samples = routeCoord.length;
				  } else {samples = 500};
				  elevator.getElevationAlongPath({
					  path: routeCoord,
					  samples: samples}, function(results, status) {
						  showElevation(results, status, text, routeCoord);
					  });
			  }
		    
		  });
	  } else {
		  alert("That location is outside of Duluth.  Please select a location closer to the city.");
		  //update map bounds to recenter on Duluth
		  var latlng1 = new google.maps.LatLng(46.815529, -91.978803);
		  bounds.extend(latlng1); //adjust extent
		  var latlng2 = new google.maps.LatLng(46.686330, -92.282236);
		  bounds.extend(latlng2); //adjust extent
		  
		  $("#toggleAttractions").trigger("click"); //show attractions on the map
	  };
}

//Takes an array of ElevationResult objects and plots the elevation profile on a Visualization API Column Chart
function showElevation(results, status, text, routeCoord){
	var chartDiv = document.getElementById('elevation_chart');
    if (status !== 'OK') {
      // Show the error code inside the chartDiv.
      chartDiv.innerHTML = 'Cannot show elevation: request failed because ' +
          status;
      return;
    }
    
	// Create a new chart in the elevation_chart DIV.
    var chart = new google.visualization.AreaChart(chartDiv);

    //isolate elevation data
    var elevations = results;
    
    var elevationPath = [];
    for (var i=0; i < results.length; i++) {
    	elevationPath.push(elevations[i].location); //push elevation data with location data to the array
    }
    
    //store elevation in array for gain/loss
    var elevationChange = [];
    
    var data= new google.visualization.DataTable();
    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');
    for (var i = 0; i < results.length; i++) {
    	var elev = Math.round((elevations[i].elevation)*3.28);
        data.addRow(['', elev]);
        elevationChange.push(elev);
    };
    
    var chartOptions = {
    		height: 150, //height of chart onScreen
		    legend: 'none',
		    vAxis: {
		    	title: 'Feet', 
		    	titleTextStyle: {fontSize: 10}, 
		    	minValue: 500, 
		    	maxValue: 1200
		    },
		    hAxis: {
		    	title: text, 
		    	titleTextStyle: {
		    		fontSize: 14,
		    		italic: false
	    		}
		    }
    };
    
    // Draw the chart using the data within its DIV.
    chart.draw(data, chartOptions);
    
    var elevIcon = {
    		url: 'img/routeStart.png',
    		scaledSize: new google.maps.Size(10,10),
    		origin: new google.maps.Point(0,0),
    		anchor: new google.maps.Point(5,5)
    };
    
    var elevationMarker = new google.maps.Marker({
    	position: {lat:0,lng:0},
    	map:map,
    	icon: elevIcon
    });
    
    openMarkers.push(elevationMarker);

    //add event handler to mouseOver chart
    google.visualization.events.addListener(chart, 'onmouseover', function(e) {
    	var index = e["row"]-1; //find out how far along the route you  are, adjusted to count from 0
    	var latlng = routeCoord[index];
    	elevationMarker.setPosition(latlng);
    });
    
    //Populate the Route Details div
    //calculate elevation gain and drop based on elevationChange, populated during the chart construction
    var gain = 0;
    var drop = 0;
    var elevationText = '';
    for (var i = 0; i < elevationChange.length-1; i++) {
    	var next = i+1;
    	var change = elevationChange[i]-elevationChange[next];
    	if (change>0) {
    		drop += change;
    	} else {
    		gain += change*-1;
    	};
    elevationText = "Elevation gain : "+gain+" feet<br>Elevation drop: "+drop+" feet"
    }
    routePanel(text,elevationText);
   
}

function loadRouteNames(sites,bounds) {
	var streets = [];
	var count = 0;
	//only fires if sites have been specified
	if (sites.length>0){
		$.each(sites, function(i, e) {
			if (e["street"]){
				var street = e["street"];
				streets.push(" "+count+". Follow "+ street);
				count++;
			}
		});
	};
	
	var html = '<p>';
	for (var i = 1; i<streets.length; i++){
		html += streets[i] + "<br>";
	};
	html += "</p>";
	var stepByStep = $("#stepByStep");
	stepByStep.html(html); //populate the HTML
	stepByStep.css("display","block"); //show stepByStep
}

function routePanel(lengthText,elevationText) {
	var panelContent = $("#routePanelContent");
	var html = "<h3>Route Details</h3><p>"+lengthText+"<br>"+elevationText+"</p>";
	panelContent.html(html);
}



//Assign sourceCoord and targetCoord when start/destination are selected
function getStartCoords(lat,lng) {
	sourceCoord = [lng,lat];
	reverseGeocode(lat,lng,'#startbox',sourceCoord);
}

function getEndCoords(lat,lng) {
	targetCoord = [lng,lat];
	reverseGeocode(lat,lng,'#endbox',targetCoord);
}

//reverse geocode code
function reverseGeocode(lat,lng,targetString,targetVal){
	var latlng = {lat: lat, lng: lng};
	//reverse geocode location to address to display
	geocoder.geocode({'location': latlng}, function(results, status){
		if (status === 'OK') { //if the geocode works
			if (results[0]) { //if street address results exist
				$(targetString).val(results[0].formatted_address);//set start input field to show the reversed-geocoded street address based on coords
			} else if (results[1]) {
				$(targetString).val(results[1].formatted_address);//set start input field to show the reversed-geocoded neighborhood based on coords
			} else {
				$(targetString).val(targetVal);//geocoder found no results: set start input field to show the coordinates
			};
		} else {
			$(targetString).val(targetVal); //geocoder failed: set start input field to show the coordinates
		};
	});
}


//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);