
var map;

function initialization() {
  showAllReports();
}

function showAllReports() {
  $.ajax({
    url: 'HttpServlet',
    type: 'POST',
    success: function(reports) { 
      mapInitialization(reports);
    },
    error: function(xhr, status, error) {
      alert("An AJAX error occured: " + status + "\nError: " + error);
    }
  });
}

function mapInitialization(reports) {
  var mapOptions = {
    mapTypeId : google.maps.MapTypeId.ROADMAP, // Set the type of Map
    center: {lat: 46.78796, lng: -92.09985}

  };
  
  // Render the map within the empty div
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  var bounds = new google.maps.LatLngBounds ();
  
  $.each(reports, function(i, e) {
    var start_point = Number(e['start_point']);
    var end_point = Number(e['end_point']);
    var road_segment = new google.maps.LatLng(start_point, end_point); 
    
    bounds.extend(latlng);

    // Create the polylines
    var road = new google.maps.Polyline({ // Set the marker
    	path: road_segment, 
    	geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    road.setMap(map);
  });
  
  map.fitBounds (bounds);

}


//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
