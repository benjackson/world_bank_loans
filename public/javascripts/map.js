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
