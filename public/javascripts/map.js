$.WorldBank = {}   // namespace

// A wrapper around a google map
$.WorldBank.TheMap = function() {
  var map;
  var map_center = new google.maps.LatLng(40, 14);
  
  function initialize() {
    initializeMap();
    initializeEvents();
  }
  
  // Use browser geolocation to find the map center
  function findCenter() {
    if (navigator && navigator.geolocation)
      navigator.geolocation.getCurrentPosition(locationFound, locationNotFound);
  }
  
  function locationFound(position) {
    map_center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    if (map) map.setCenter(map_center);
  }
  
  function locationNotFound() {
    // do nothing. Use the default
  }
  
  function initializeMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: map_center,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: 4,
      streetViewControl: false,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      disableDefaultUI: true,
      maxZoom: 6
    });
  }
  
  function initializeEvents() {
    // The map is hidden to begin with, so we need to do some stuff when it is
    // seen for the first time
    $("#MapContainer").one("selected", firstView);
    
    // resize the map when the window is resized
    $(window).resize(function() {
      google.maps.event.trigger(map, 'resize');
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
  }
  
  // The map is hidden to begin with, so we need to do some stuff when it is
  // seen for the first time
  function firstView() {
    google.maps.event.trigger(map, 'resize');
    map.setCenter(map_center);
  }
  
  var self = {
    getMap: function() { return map; }
  };
  
  // Might as well start this off at any time?
  findCenter();
  
  // Begin when ready
  $(document).ready(initialize);
      
  return self;
} ();
