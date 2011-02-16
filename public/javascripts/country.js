// class representing a Country, including the markers necessary to display it on the map
$.WorldBank.Country = (function() {
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
    var marker;       // the Google marker object
    var data;         // the data that makes it up
    var bounds;
    var self = this;  // handle closure scope
    
    var clicked = function(event) {
      if ($.WorldBank.the_map.getZoom() == $.WorldBank.the_map.maxZoom)
        $.WorldBank.the_map.fitBounds(self.getBounds());
      $.WorldBank.CountryInfos.stop();
      $.WorldBank.CountryInfos.displayInfoFor(self);
    }
    
    var changeMarkersForCurrentZoomLevel = function() {
      var zoom = $.WorldBank.the_map.getZoom();
      self.marker.setIcon(marker_images[zoom]);
      self.marker.setShadow(marker_image_shadows[zoom]);
      self.marker.setShape(marker_shapes[zoom]);
    }
  
    this.getSummaryHtml = function() {
      return data["info_summary"];
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
    
    // returns true if this country's marker can be seen on the map
    this.isVisible = function() {
      if (this.marker.getMap().getBounds().contains(this.getLatLng()))
        return true;
      else
        return false;
    }
    
    // add this country to the list
    $.WorldBank.Country.countries[data["name"]] = this;
    
    // save the data
    this.data = data;
    
    // create a google marker to represent this country on the map
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data["latitude"], data["longitude"]),
      title: data["name"]
    });
    changeMarkersForCurrentZoomLevel();
    // add a reference back to this object
    this.marker.country = this;   
    
    // watch for a change of zoom
    google.maps.event.addListener($.WorldBank.the_map, 'zoom_changed', function(event) {
        changeMarkersForCurrentZoomLevel();
    });
    
    google.maps.event.addListener(this.marker, 'click', function() { clicked() });
    this.marker.setMap($.WorldBank.the_map);
    if (this.isVisible())
      $.WorldBank.Country.visible_countries.push(this);
  }
  
}) ();

// All the Countrys created, by name
$.WorldBank.Country.countries = []; 

// All the countries currently visible on the map
$.WorldBank.Country.visible_countries = [];

// recalculate the visible markers
$.WorldBank.Country.boundsChanged = function() {
  this.visible_countries = [];
    for (var country_name in this.countries) {
      var country = this.countries[country_name];
      if (country.isVisible())
        this.visible_countries.push(country);
    }
};

// create a country from data returned by the server
$.WorldBank.Country.create = function(data) {
  if (data == null || data["error"] || this.countries[data["name"]]) {
    return null;
  }
  var country = new $.WorldBank.Country(data);
  return country;
};
