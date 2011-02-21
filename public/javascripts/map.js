$.WorldBank = {}   // namespace

// the google map
$.WorldBank.the_map = null;
$.WorldBank.map_center = new google.maps.LatLng(36, 8);

$(document).ready(function() {
  // hide the map out of sight while we set it up
  //$("#MapContainer").css("left", "100%");
  //$("#MapContainer").show();
  
  $.WorldBank.the_map = new google.maps.Map(document.getElementById("map"), {
    center: $.WorldBank.map_center,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    zoom: 4,
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    disableDefaultUI: true,
    maxZoom: 6
  });
  
  $("#MapContainer").one("aftertransition", function() {
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
  });
  
  // Only for mobiles
  $(window).bind("orientationchange", function() {
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
  });
  
  $.WorldBank.drawCountries();
});
