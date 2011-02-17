$.WorldBank = {}   // namespace

// the google map
$.WorldBank.the_map = null;
$.WorldBank.map_center = new google.maps.LatLng(20, 0);

$.WorldBank.mapClicked = function() {
  $.WorldBank.CountryInfos.removeInfo();
}

$(document).ready(function() {
  $.WorldBank.the_map = new google.maps.Map(document.getElementById("map"), {
    center: $.WorldBank.map_center,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    zoom: 2,
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    disableDefaultUI: true,
    maxZoom: 6
  });
  
  // Trigger a resize when the map is shown for the first time (mobiles only)
  $("#MapContainer").one("show", function() {
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
      $.WorldBank.the_map.setCenter($.WorldBank.map_center);
  });
  
  // Only for mobiles
  $("#body").bind("orientation_change", function() {
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
  });
  
  google.maps.event.addListenerOnce($.WorldBank.the_map, 'tilesloaded', function() {
      // Get all the countries once the initial tiles have loaded
      $.getJSON("/countries.json", function(data) {
          $.WorldBank.CountryInfos.start();   // start showing the country tooltips
          
          // Make sure we can clear the tooltip with a click on the map
          google.maps.event.addListener($.WorldBank.the_map, 'click', $.WorldBank.mapClicked);
          
          // Load all the countries onto the map
          $.WorldBank.Country.load(data);
      });
  });
});
