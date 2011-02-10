var the_map;
var the_info_window = new google.maps.InfoWindow({ disableAutoPan: true });
var markers = [];

var Country = (function() {
  var marker_images = {
      0: new google.maps.MarkerImage(
        "/images/world-bank-marker.png",
        new google.maps.Size(8, 8),
        new google.maps.Point(0, 0),
        new google.maps.Point(4, 4),
        new google.maps.Size(8, 8)
        ),
      1: new google.maps.MarkerImage(
        "/images/world-bank-marker.png",
        new google.maps.Size(8, 8),
        new google.maps.Point(0, 0),
        new google.maps.Point(4, 4),
        new google.maps.Size(8, 8)
        ),
      2: new google.maps.MarkerImage(
        "/images/world-bank-marker.png",
        new google.maps.Size(16, 16),
        new google.maps.Point(0, 0),
        new google.maps.Point(8, 8),
        new google.maps.Size(16, 16)
        ),
      3: new google.maps.MarkerImage(
        "/images/world-bank-marker.png",
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(16, 16),
        new google.maps.Size(32, 32)
        ),
      4: new google.maps.MarkerImage("/images/world-bank-marker.png",
        new google.maps.Size(64, 64),
        new google.maps.Point(0, 0),
        new google.maps.Point(32, 32),
        new google.maps.Size(64, 64)
        )
  };
  
  var marker_image_shadows = {
      0: new google.maps.MarkerImage(
        "/images/world-bank-marker-shadow.png",
        new google.maps.Size(12, 8),
        new google.maps.Point(0, 0),
        new google.maps.Point(4, 4),
        new google.maps.Size(12, 8)
        ),
      1: new google.maps.MarkerImage(
        "/images/world-bank-marker-shadow.png",
        new google.maps.Size(12, 8),
        new google.maps.Point(0, 0),
        new google.maps.Point(4, 4),
        new google.maps.Size(12, 8)
        ),
      2: new google.maps.MarkerImage(
        "/images/world-bank-marker-shadow.png",
        new google.maps.Size(23, 16),
        new google.maps.Point(0, 0),
        new google.maps.Point(8, 8),
        new google.maps.Size(23, 16)
        ),
      3: new google.maps.MarkerImage(
        "/images/world-bank-marker-shadow.png",
        new google.maps.Size(46, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(16, 16),
        new google.maps.Size(46, 32)
        ),
      4: new google.maps.MarkerImage("/images/world-bank-marker-shadow.png",
        new google.maps.Size(93, 64),
        new google.maps.Point(0, 0),
        new google.maps.Point(32, 32),
        new google.maps.Size(93, 64)
        )
  };
  
  var marker_shapes = {
    0: { type: "circle", coords: [ 4, 4, 8 ] },
    1: { type: "circle", coords: [ 4, 4, 8 ] },
    2: { type: "circle", coords: [ 8, 8, 16 ] },
    3: { type: "circle", coords: [ 16, 16, 32 ] },
    4: { type: "circle", coords: [ 32, 32, 64 ] }
  };
  
  return function(data) {
    var marker;   // the Google marker object
    var data;     // the data that makes it up
    var bounds;
    
    function clicked(event) {
      if (the_map.getZoom() == the_map.maxZoom) {
        window.location.href = escape("/countries/" + this.title);
      } else {
        the_map.fitBounds(this.country.getBounds());
      }
    }
    
    this.changeOfZoom = function(zoom) {
      this.marker.setIcon(marker_images[zoom]);
      this.marker.setShadow(marker_image_shadows[zoom]);
      this.marker.setShape(marker_shapes[zoom]);
    }
    
    this.getLatitude = function() {
      return data["latitude"];
    }
    
    this.getLongitude = function() {
      return data["longitude"];
    }
    
    this.getLatLng = function() {
      return new google.maps.LatLng(this.getLatitude(), this.getLongitude());
    }
    
    this.getBounds = function() {
      bounds = bounds || new google.maps.LatLngBounds(
        new google.maps.LatLng(this.getLatitude() - 1, this.getLongitude() - 1),
        new google.maps.LatLng(this.getLatitude() + 1, this.getLongitude() + 1)
        );
      return bounds;
    }
    
    // add this country to the list
    Country.countries[data["name"]] = this;
    
    this.data = data;
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data["latitude"], data["longitude"]),
      title: data["name"]
    });
    this.marker.country = this;   // add a reference back to this object
    this.changeOfZoom(the_map.getZoom());
    google.maps.event.addListener(this.marker, 'click', clicked);
    this.marker.setMap(the_map);
  }
  
}) ();

Country.countries = [];    // all the Countrys created, by name

Country.changeOfZoom = function(to_zoom) {
  for (var country_name in this.countries) {
    if (to_zoom != the_map.getZoom()) { break; } // handle quick double-clicks
    this.countries[country_name].changeOfZoom(to_zoom);
  }
};

Country.create = function(data) {
  if (data == null || data["error"] || this.countries[data["name"]]) {
    return null;
  }
  return new Country(data);
};

function countryHover(event) {
  the_info_window.close();
  the_info_window.setContent(this.info_text);
  the_info_window.open(the_map, this);
}

function countryEndHover(event) {
  the_info_window.close();
}

// change the country marker depending on the zoom level
function mapZoom() {
  Country.changeOfZoom(this.zoom);
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
  
  google.maps.event.addListener(the_map, 'zoom_changed', mapZoom);
  $.get("/countries.js", null, null, "script");
});
