$.WorldBank = {}   // namespace

// the google map
$.WorldBank.the_map = null;

$.WorldBank.boundsChanged = function() {
  // recalculate the visible markers
  $.WorldBank.Country.boundsChanged();
}

$(document).ready(function() {
  /*$.WorldBank.the_map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(20, 0),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 1,
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    maxZoom: 4
  });
  */
  
  
  //google.maps.event.addListener($.WorldBank.the_map, 'bounds_changed', $.WorldBank.boundsChanged);
  
  //$.get("/countries.js", null, null, "script");
  
  //$.WorldBank.CountryInfos.start();
});
