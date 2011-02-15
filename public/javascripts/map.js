$.WorldBank = {}   // namespace

// the google map
$.WorldBank.the_map = null;
$.WorldBank.map_center = new google.maps.LatLng(20, 0);

$.WorldBank.boundsChanged = function() {
  // recalculate the visible markers
  $.WorldBank.Country.boundsChanged();
}

$(document).ready(function() {
  $.WorldBank.the_map = new google.maps.Map(document.getElementById("map"), {
    center: $.WorldBank.map_center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 1,
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    maxZoom: 4
  });
  
  // Show the map for the first time
  $("#MapContainer").one("show", function() {
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
      $.WorldBank.the_map.setCenter($.WorldBank.map_center);
      $.WorldBank.CountryInfos.start();
  });
  
  google.maps.event.addListenerOnce($.WorldBank.the_map, 'bounds_changed', function() {
      google.maps.event.addListener($.WorldBank.the_map, 'bounds_changed', $.WorldBank.boundsChanged);
      $.get("/countries.js", null, null, "script");
  });
});
