<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Cycle Routes</title>

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
    
      <div class="sidebar col-xs-3">
        <button type="button" class="btn btn-default" id="toggleAttractions">Attractions</button>
        <button type="button" class="btn btn-default" id="toggleTweets">Tweets</button>
        <button type="button" class="btn btn-default" id="getDirections">Directions</button>
      </div>
      
      <div id="map-canvas" class="col-xs-9"></div>
      
    </div>
  </div>
  
<!--  jQuery -->
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<!-- Bootstrap -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<!-- Google Maps API -->
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyDHXqtgqGCj7RMkh3ual_upusbnbFUq4Ko&libraries=places,visualization"></script>
<script src="js/loadmap.js"></script>
</body>
</html>