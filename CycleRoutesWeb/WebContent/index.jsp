<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Cycle Routes</title>

<!-- load google JS API digital libraries -->
<script src="https://www.google.com/jsapi"></script>

<!-- Custom Styles -->
<link rel="stylesheet" href="css/styles.css">

<!-- Intro.js css for instructions -->
<link href="css/introjs.css" rel="stylesheet">

<!-- Bootstrap -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">


</head>
<body>
<div class="container-fluid">
	<div class="row">
	
		<nav class='menu-ui'>
		  <a href='#' class='active' id="toggleAttractions"><img src="img/attractions.svg" height="20vh" width ="20vw" data-step="3" data-intro="Click to toggle on/off and check out some awesome Duluth attractions." data-position="left">Attractions</a>
		  <a href='#' id="toggleTweets"><img src="img/tweets.svg" height="20vh" width ="20vw" data-step="4" data-intro="Click to toggle on/off Tweets around Duluth to see what social media is saying." data-position="left">Tweets</a>
		</nav> 
		
		<form data-step="1" data-intro="Click here to start mapping your route." data-position="right">
			<div id="sidePanelContainer">
				<div id = "introContent">
					<button type="button" id="panelButton" class="btn btn-default" data-toggle="collapse" data-target="#sidePanelContent"></button>
				</div>
				<div id="sidePanelContent"></div>
				<div id="routePanelContent"></div>
			 	<div id="elevation_chart">
   					<script>
   					 	// Load the Visualization API and the columnchart package.
   						google.load('visualization', '1', {packages: ['columnchart']});
   					 </script>
				</div>
				<div id="stepByStep"></div>
       			
			
				<div class='inputContainer'><img src="img/directionsStart.png" class="dirIcon"><input type="text" id="startbox" placeholder="Start"></div>
				<div class='inputContainer'><img src="img/directionsEnd.png" class="dirIcon"><input type="text" id="endbox" placeholder="Destination"></div>
				<!-- script to avoid crashes on reload of page by user -->
				<script>
                window.onload = function(){
                     document.getElementById("startbox").value = "";
                     document.getElementById('endbox').value="";
                    };
                </script>
		
				<button type="button" class="layerToggle btn btn-default" id="getDirections">Map My Route</button>
				<div class="widgets-wrapper">
					<div class="widgets">
						<div id="locateMe" data-step="2" data-intro="Locate yourself on the map." data-position="right"></div>
						<div id="help" href="javascript:void(0);" onclick="javascript:introJs().start();"></div>
					</div>
				</div>
			</div>
		</form>
		

		
		<div id="map-canvas" class="col-xs-12"></div>
	  
	</div>
</div>
  
<!--  jQuery -->
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<!-- Bootstrap -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<!-- Google Maps API -->
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyDHXqtgqGCj7RMkh3ual_upusbnbFUq4Ko&libraries=places,visualization,geometry"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript" src="lib/infobox/src/infobox.js"></script>
<script type="text/javascript" src="lib/intro.js"></script>    
<script src="js/loadmap.js"></script>
</body>
</html>