<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Cycle Routes</title>

<!-- load google JS API digital libraries -->
<script src="https://www.google.com/jsapi"></script>

<!-- Intro.js css for instructions -->
<link href="css/introjs.css" rel="stylesheet">

<!-- Bootstrap -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

<!-- Custom Styles -->
<link rel="stylesheet" href="css/styles.css">

</head>
<body>
<div class="container-fluid">
	<div class="row">
	
		<nav class='menu-ui'>
		  <a href='#' class='active' id="toggleAttractions" data-step="6" data-intro="Click to toggle on/off and check out some awesome Duluth attractions." data-position="left"><img src="img/attractions.svg" height="20vh" width ="20vw">Attractions</a>
		  <a href='#' id="toggleTweets" data-step="7" data-intro="Click to toggle on/off Tweets around Duluth to see what social media is saying." data-position="left"><img src="img/tweets.svg" height="20vh" width ="20vw">Tweets</a>
		</nav> 
		
		<form>
			<div id="sidePanelContainer">
				<div id = "introContent">
					<button type="button" id="panelButton" class="btn btn-default" data-toggle="collapse" data-target="#sidePanelContent"></button>
				</div>
				<div id="sidePanelContent" data-step="2" data-intro="Map markers can be selected as your start or destination.  Double click anywhere to make your own marker." data-position="right"></div>
				<div id="routePanelContent"></div>
			 	<div id="elevation_chart">
   					<script>
   					 	// Load the Visualization API and the columnchart package.
   						google.load('visualization', '1', {packages: ['columnchart']});
   					 </script>
				</div>
				<div id="stepByStep"></div>
       			
				<div data-step="1" data-intro="Select start and destination here or directly from the map" data-position="right">
					<div class='inputContainer'><img src="img/directionsStart.png" class="dirIcon"><input type="text" id="startbox" placeholder="Start"></div>
					<div class='inputContainer'><img src="img/directionsEnd.png" class="dirIcon"><input type="text" id="endbox" placeholder="Destination"></div>
				</div>
				<!-- script to avoid crashes on reload of page by user -->
				<script>
                window.onload = function(){
                     document.getElementById("startbox").value = "";
                     document.getElementById('endbox').value="";
                    };
                </script>
				<div data-step="3" data-intro="Click here to start mapping your route." data-position="right">
					<button type="button" class="layerToggle btn btn-default" id="getDirections">Map My Route</button>
				</div>
				<div class="widgets-wrapper">
					<div class="widgets">
						<div id="locateMe" data-step="4" data-intro="Locate yourself on the map." data-position="right"></div>
						<div id="resetView" data-step="5" data-intro="Reset the map view." data-position="right"></div>
						<button id="aboutbutton" type="button" class="btn btn-default" >About</button>
						<div id="help" href="javascript:void(0);" onclick="javascript:introJs().start();"></div>
					</div>
				</div>
			</div>
		</form>
		
        <div id="aboutuspanel"> 
             <div class="panel-group" id="accordion">
               <div class="panel"> 
                 <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">
	                 <div class="panel-heading">
	                   <h3 class="panel-title">
 	                     About the Bike Routes
 	                   </h3>
                     </div>
                   </a>
                 <div id="collapse1" class="panel-collapse collapse">
                   <div class="panel-body">
                       <p>Everyone wants to find the most interesting, safest, and rideable bike route around town, right? We worked with local Duluth bicyclists to determine what a "rideable" bike route would be. It turns out that riders already know the best routes, so we turned to Strava.com for ridership maps. </p>
                       <p>What's <i>ridership</i> you say? Well, we define <i>ridership</i> as the density of riders, or the number of riders per road throughout the Duluth, MN area. Strava's fantastic app produces an annual <a href="http://labs.strava.com/heatmap/#9/-92.27005/46.77749/blue/bike" target="_blank">Global Heatmap</a> of cycling for all the roads worldwide.</p>
                       <p>To digest Strava's data into a biking app for you, we downloaded a copy of the Global Heatmap and analyzed each road within the St. Louis County, assessed its ridership and other factors like road surface, and gave it a "rideability" score. We then use the opensource <a href="http://pgrouting.org/" target="_blank">pgRouting</a> tool for our backend PostGIS/Postgresql database to process your start and end point and create a "rideable" bike route for you!</p>
                   </div>
                 </div>
               </div>
               <div class="panel">
                 <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">
                   <div class="panel-heading">
                     <h3 class="panel-title">
                       About Us
                     </h3>
                   </div>
                 </a>
                 <div id="collapse2" class="panel-collapse collapse">
                   <div class="panel-body">
                       <h5>We're a bunch of GIS junkies and coding gurus having fun while in school for a master's in GIS/Cartgraphy (Web Map Programming) at the University of Wisconsin-Madison.</h5> 
                       <ul><strong>Brian Robinson</strong>: <i><small>bdrobinson2[at]wisc.edu ~ <code>Ninja Warrier Developer</code></small></i></ul>
                       <ul><strong>JohnMark Fisher </strong>: <i><small>jjfisher2[at]wisc.edu ~ <code>Stealthy Sys Admin</code></small></i></ul>
                       <ul><strong>Kim Sundeen</strong>: <i><small>kim.h.sundeen[at]gmail.com ~ <code>Kung fu Coder</code></small></i></ul>
                       <ul><strong>Ian Bachman-Sanders </strong>: <i><small>bachmansande[at]wisc.edu ~ <code>Coding Bug Assasin</code></small></i></ul>      
                       <h5>Feel free to send us feedback on the project! Or, see the<a id="githublink" style="color:blue;" href="https://github.com/ibachmansanders/GISWMP_FinalProject/" target="_blank"> github repo.</a></h5>              
                   </div>
                 </div>
               </div>
             </div> 
           </div>    <!-- end aboutpanel--> 
		
		<div id="map-canvas" class="col-xs-12"></div>
	  
	</div>
</div>
  
<!--  jQuery -->
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<!-- Bootstrap -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<!-- Google Maps API -->
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=########&libraries=places,visualization,geometry"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript" src="lib/infobox/src/infobox.js"></script>
<script type="text/javascript" src="lib/intro.js"></script>
<script src="js/loadmap.js"></script>
</body>
</html>