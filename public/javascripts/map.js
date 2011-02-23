$.WorldBank = {}   // namespace

// the google map
$.WorldBank.the_map = null;
$.WorldBank.map_center = new google.maps.LatLng(36, 8);

$(document).ready(function() {
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
  
  $("#MapContainer").one("selected", function() {
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
      $.WorldBank.the_map.setCenter($.WorldBank.map_center);
      
      $("#MapContainer").bind("selected", function() {
          google.maps.event.trigger($.WorldBank.the_map, 'resize');
      });
  });
  
  // resize the map when the window is resized
  $(window).resize(function() {
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
  });
  
  // handle an option click
  $("#Navigation div.option").click(function() {
      $.WorldBank.Country.changeData(this);
  });
  
  // handle the welcome page clicks
  $("#view_undisbursed_loans").click(function() {
      $("#undisbursed_percent").trigger("click");
  });
  
  $("#view_disbursed_loans").click(function() {
      $("#disbursed_percent").trigger("click");
  });
});
