$.WorldBank.CountryOverlay = (function() {
    return function(new_country) {
      var country = new_country;
      var div;
      
      this.onAdd = function() {
        var pane = this.getPanes().floatPane;
        div = $(country.getOverlayHtml());
        $(div).click(function() { country.clicked(); });
        $(pane).append(div);
      }
      
      this.onRemove = function() {
        $(div).remove();
      }
      
      this.draw = function() {
        div.removeClass("zoom-0 zoom-1 zoom-2 zoom-3 zoom-4 zoom-5 zoom-6");
        div.addClass("zoom-" + country.marker.getMap().getZoom());
        
        div.removeClass("size-0 size-1 size-2 size-3");
        div.addClass("size-" + Math.round(country.getMarkerSizeFactor() * 3)); 
        
        var projection = this.getProjection();
        var position = projection.fromLatLngToDivPixel(country.getLatLng());
        div.css('left', position.x - div.width() / 2);
        div.css('top', position.y - div.height() / 2);
      }
      
      this.setMap($.WorldBank.the_map);
    }
}) ();
$.WorldBank.CountryOverlay.prototype = new google.maps.OverlayView;

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
        new google.maps.Size(16, 16),
        new google.maps.Point(0, 0),
        new google.maps.Point(8, 8),
        new google.maps.Size(16, 16)
        ),
      4: new google.maps.MarkerImage(
        "/images/world-bank-marker.png",
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(16, 16),
        new google.maps.Size(32, 32)
        ),
      5: new google.maps.MarkerImage("/images/world-bank-marker.png",
        new google.maps.Size(64, 64),
        new google.maps.Point(0, 0),
        new google.maps.Point(32, 32),
        new google.maps.Size(64, 64)
        ),
      6: new google.maps.MarkerImage("/images/world-bank-marker.png",
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
        new google.maps.Size(23, 16),
        new google.maps.Point(0, 0),
        new google.maps.Point(8, 8),
        new google.maps.Size(23, 16)
        ),
      4: new google.maps.MarkerImage(
        "/images/world-bank-marker-shadow.png",
        new google.maps.Size(46, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(16, 16),
        new google.maps.Size(46, 32)
        ),
      5: new google.maps.MarkerImage("/images/world-bank-marker-shadow.png",
        new google.maps.Size(93, 64),
        new google.maps.Point(0, 0),
        new google.maps.Point(32, 32),
        new google.maps.Size(93, 64)
        ),
      6: new google.maps.MarkerImage("/images/world-bank-marker-shadow.png",
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
    3: { type: "circle", coords: [ 8, 8, 16 ] },
    4: { type: "circle", coords: [ 16, 16, 32 ] },
    5: { type: "circle", coords: [ 32, 32, 64 ] },
    6: { type: "circle", coords: [ 32, 32, 64 ] }
  };
  
  var data_property = "Undisbursed %";
  
  return function(data) {
    var marker;       // the Google marker object
    var data;         // the data that makes it up
    var bounds;
    var self = this;  // handle closure scope
    var overlay;
    
    /*
    var changeMarkerForCurrentZoomLevel = function() {
      var zoom = $.WorldBank.the_map.getZoom();
      self.marker.setIcon(marker_images[zoom]);
      self.marker.setShadow(marker_image_shadows[zoom]);
      self.marker.setShape(marker_shapes[zoom]);
    };
    */
    
    var changeMarkerForCurrentZoomLevel = function() {
      var zoom = $.WorldBank.the_map.getZoom();
      var size_factor = self.getMarkerSizeFactor();
      
      // Work out a nice marker size for display at whatever zoom we're looking at
      var marker_size = size_factor * (Math.log(((zoom + 1) / 7)) + 1) * 128;
      
      // The center of the circle
      var center = marker_size / 2;
 
      // Set the icon size
      self.marker.setIcon(new google.maps.MarkerImage(
        "/images/marker.png",
        new google.maps.Size(marker_size, marker_size),
        new google.maps.Point(0, 0),
        new google.maps.Point(center, center),
        new google.maps.Size(marker_size, marker_size)
        ));
      
      // Set the clickable shape
      self.marker.setShape({ type: "circle", coords: [center, center, center * 0.6] });
      
      // Set the z-index so that smaller circles appear over larger ones
      self.marker.setZIndex(Math.round(1 - self.getMarkerSizeFactor() * 100));
    };
    
    this.clicked = function(event) {
      window.iui.showPageByHref(self.getLink());
      //$.WorldBank.CountryInfos.stop();
      //$.WorldBank.CountryInfos.displayInfoFor(self);
    };
  
    this.getSummaryHtml = function() {
      return data["info_summary"];
    };
       
    this.getLatitude = function() {
      return data["latitude"];
    };
    
    this.getLongitude = function() {
      return data["longitude"];
    };
    
    this.getLatLng = function() {
      return new google.maps.LatLng(this.getLatitude(), this.getLongitude());
    };
    
    // Update this country's marker and overlay text
    this.update = function() {
      changeMarkerForCurrentZoomLevel();
    };
    
    this.getBounds = function() {
      bounds = bounds || new google.maps.LatLngBounds(
        new google.maps.LatLng(this.getLatitude() - 1, this.getLongitude() - 1),
        new google.maps.LatLng(this.getLatitude() + 1, this.getLongitude() + 1)
        );
      return bounds;
    };
    
    this.getMarkerSizeFactor = function() {
      return data[$.WorldBank.Country.data_property];
    };
    
    this.getLink = function() {
      return data["link"];
    };
    
    this.getOverlayHtml = function() {
      return "<div class=\"country-overlay\">" + Math.round(data["disbursement_remaining_percentage"] * 100) + "%</div>";
    };
    
    // returns true if this country's marker can be seen on the map
    this.isVisible = function() {
      if (this.marker.getMap().getBounds().contains(this.getLatLng()))
        return true;
      else
        return false;
    };
    
    // add this country to the list
    $.WorldBank.Country.countries[data["name"]] = this;
    
    // save the data
    this.data = data;
    
    // create a google marker to represent this country on the map
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.getLatitude(), this.getLongitude()),
      title: data["name"],
      flat: true
    });
    
    // draw markers at the appropriate size
    changeMarkerForCurrentZoomLevel();
    
    overlay = new $.WorldBank.CountryOverlay(this);
    
    // watch for a change of zoom
    google.maps.event.addListener($.WorldBank.the_map, 'zoom_changed', function(event) {
        changeMarkerForCurrentZoomLevel();
    });
    
    // add a reference back to this object
    this.marker.country = this;   
    
    // add a click event for this marker
    google.maps.event.addListener(this.marker, 'click', this.clicked);
    
    // show it on the map
    this.marker.setMap($.WorldBank.the_map);
  }
  
}) ();

// All the Countrys created, by name
$.WorldBank.Country.countries = []; 
// The property used for displaying data on the map
$.WorldBank.Country.data_property = "disbursement_remaining_percentage";

$.WorldBank.Country.load = function(data) {
  if (!data || data.length == 0) return;  
  var country_url = data.shift();
  $.getJSON(country_url, function(country_data) {
    // load the next country while creating this one
    $.WorldBank.Country.load(data);
    $.WorldBank.Country.create(country_data);
  }); 
}

// Returns all the countries currently visible on the map
$.WorldBank.Country.getVisibleCountries = function() {
  var visible_countries = [];
  for (var country_name in this.countries) {
    var country = this.countries[country_name];
    if (country.isVisible())
      visible_countries.push(country);
  }
  return visible_countries;
}

// create a country from data returned by the server
$.WorldBank.Country.create = function(data) {
  if (data == null || data["error"] || !data["latitude"] || !data["longitude"] || this.countries[data["name"]]) {
    return null;
  }
  var country = new $.WorldBank.Country(data);
  return country;
};

// Map the property name used in the Html to the data property
$.WorldBank.Country.mapData = function(data_description) {
  switch(data_description) {
    case "Undisbursed %":
      return "disbursement_remaining_percentage";
    case "Undisbursed $":
      return "disbursement_remaining";
  };
};

$.WorldBank.Country.setDataProperty = function(data_property_or_description) {
  var new_data_property = this.mapData(data_property_or_description);
  if (new_data_property != this.data_property) {
    this.data_property = new_data_property;
    this.updateCountries();
  }
}

$.WorldBank.Country.updateCountries = function() {
  for (var country_name in this.countries) {
    var country = this.countries[country_name];
    country.update();
  }
}
