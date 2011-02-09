var the_map;

$(document).ready(function() {
  the_map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(20, 0),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 1,
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    maxZoom: 4
  });
  
  $.get("/countries", null, null, "script");
  //the_map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(-41, -102), new google.maps.LatLng(65, 175)));
});
