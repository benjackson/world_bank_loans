var the_map;
var the_info_window = new google.maps.InfoWindow({ disableAutoPan: true });

function countryClick(event) {
  window.location.href = escape("/countries/" + this.title); 
}

function countryHover(event) {
  the_info_window.close();
  the_info_window.setContent(this.info_text);
  the_info_window.open(the_map, this);
}

function countryEndHover(event) {
  the_info_window.close();
}

function zoomDependentMarkerImage(image_url) {
  
}

function zoomDependentMarker() {
  return new google.maps.MarkerImage(
    "/images/world-bank-marker.png",
    new google.maps.Size(32, 32),
    new google.maps.Point(0, 0),
    new google.maps.Point(16, 16),
    new google.maps.Size(32, 32)
    );
}

function zoomDependentMarkerShadow() {
  return new google.maps.MarkerImage(
    "/images/world-bank-marker-shadow.png",
    new google.maps.Size(93/2+10, 32),
    new google.maps.Point(-10, 0),
    new google.maps.Point((93/2)/2, 16),
    new google.maps.Size(93/2, 32)
    );
}

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
  
  $.get("/countries.js", null, null, "script");
});
