$.WorldBank = {}   // namespace

// A wrapper around a google map
$.WorldBank.TheMap = function() {
  var map;
  var map_center;
  var last_zoom;
  
  // Show this by default
  var data_to_view = "undisbursed_percent";
  
  // Use browser geolocation to find the map center
  function findCenter() {
    map_center = new google.maps.LatLng(40, 14);
    if (navigator && navigator.geolocation)
      navigator.geolocation.getCurrentPosition(locationFound, locationNotFound);
  }
  
  function locationFound(position) {
    map_center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    if (map) map.panTo(map_center);
  }
  
  function locationNotFound() {
    // do nothing. Use the default
  }
  
  // Has the zoom changed since the last time we checked?
  function zoomHasChanged() {
    if (last_zoom == null || last_zoom != map.getZoom()) {
        last_zoom = map.getZoom();
        return true;
      } else {
        return false;
      }
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
    // resize the map when the window is resized
    $("#MapContainer").bind("selected", resize);
    $(window).resize(resize);
    
    // watch for a change of zoom
    google.maps.event.addListener(map, 'idle', function(event) {
        // don't let the user get to zoom 0
        if (map.getZoom() == 0)
          map.setZoom(1);
        
        if (zoomHasChanged()) {
          $.WorldBank.Country.zoomChangedTo(map.getZoom());
        }
    });
    
    // handle the welcome page clicks
    $("#view_undisbursed_loans").click(function() {
        $.WorldBank.Country.loadNewData($("#undisbursed_percent")[0]);
    });
    
    $("#view_disbursed_loans").click(function() {
        $.WorldBank.Country.loadNewData($("#disbursed_percent")[0]);
    });
  }
  
  // Resize the map (usually because the window resized)
  function resize() {
    google.maps.event.trigger(map, 'resize');
  }
  
  // Begin when ready
  $(document).ready(function () {
    $("#view_disbursed_loans").one("click", function() { data_to_view = "disbursed_percent"; });
    $("#MapContainer").one("selected", $.WorldBank.TheMap.initialize);
  });

  var self = {
    initialize: function() {
      // Load the google maps API asynchronously
      $("body").append("<script src=\"http://maps.google.com/maps/api/js?sensor=true&callback=$.WorldBank.TheMap.googleLoaded\" type=\"text/javascript\"></script>");
    },
    
    googleLoaded: function() {
      // The google API is now loaded, so we can do this:
      $.WorldBank.CountryOverlay.prototype = new google.maps.OverlayView;
      
      findCenter();
      initializeMap();
      
      // Show some data to begin with
      $.WorldBank.Country.loadNewData($("#" + data_to_view)[0]);
      
      initializeEvents();
    },
    
    getMap: function() { return map; }
  };
  
  return self;
} ();


