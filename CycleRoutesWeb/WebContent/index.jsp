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

<!-- Bootstrap -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">


</head>
<body>
<nav class="navbar navbar-inverse navbar-fixed-top">
	<a class="navbar-brand">Cycle Routes Duluth, MN</a>
</nav>
  
<div class="container-fluid">
	<div class="row">
	
		<button type="button" class="layerToggle btn btn-default" id="toggleAttractions"><img src="img/attractions.svg" height="20vh" width ="20vw">Attractions</button>
		<button type="button" class="layerToggle btn btn-default" id="toggleTweets"><img src="img/tweets.svg" height="20vh" width ="20vw">Tweets</button>    
		
		<form>
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
       			
			
				<div><input type="text" id="startbox" placeholder="Start"></div>
				<div><input type="text" id="endbox" placeholder="Destination"></div>
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
						<div id="help"></div>
						<div id="locateMe"></div>
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
<script src="js/loadmap.js"></script>
</body>
</html>