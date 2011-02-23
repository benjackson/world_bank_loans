$.WorldBank.CountryOverlay = (function() {
    return function(new_country) {
      var country = new_country;
      var div;
      
      this.onAdd = function() {
        var pane = this.getPanes().floatPane;
        div = $("<div class=\"country-overlay\">" + country.getOverlayText() + "</div>");
        $(div).click(function() { country.clicked(); });
        $(pane).append(div);
      }
      
      this.onRemove = function() {
        $(div).remove();
      }
      
      this.draw = function() {
        div.removeClass("zoom-0 zoom-1 zoom-2 zoom-3 zoom-4 zoom-5 zoom-6");
        div.addClass("zoom-" + country.getMarker().getMap().getZoom());
        
        div.removeClass("size-0 size-1 size-2 size-3");
        div.addClass("size-" + Math.round(country.getMarkerSizeFactor() * 3)); 
        
        var projection = this.getProjection();
        var position = projection.fromLatLngToDivPixel(country.getLatLng());
        div.css('left', position.x - div.width() / 2);
        div.css('top', position.y - div.height() / 2);
      }
      
      // Update the overlay
      this.update = function() {
        div.html(country.getOverlayText());
        this.draw();
      }
      
      this.setMap($.WorldBank.the_map);
    }
}) ();
$.WorldBank.CountryOverlay.prototype = new google.maps.OverlayView;

// class representing a Country, including the markers necessary to display it on the map
$.WorldBank.Country = (function() {
  
  return function(data) {
    var marker;       // the Google marker object
    var overlay;      // text to overlay over the marker
    var data;         // the data that makes it up
    var bounds;
    var self = this;  // handle closure scope
    
    var changeMarkerForCurrentZoomLevel = function() {
      var zoom = $.WorldBank.the_map.getZoom();
      var size_factor = self.getMarkerSizeFactor();
      
      // Work out a nice marker size for display at whatever zoom we're looking at
      var marker_size = size_factor * (Math.log(((zoom + 1) / 7)) + 1) * 100 + 28;
      
      // The center of the circle
      var center = marker_size / 2;
 
      // Set the icon size
      marker.setIcon(new google.maps.MarkerImage(
        self.getMarkerImageUrl(),
        new google.maps.Size(marker_size, marker_size),
        new google.maps.Point(0, 0),
        new google.maps.Point(center, center),
        new google.maps.Size(marker_size, marker_size)
        ));
      
      // Set the clickable shape
      marker.setShape({ type: "circle", coords: [center, center, center * 0.6] });
      
      // Set the z-index so that smaller circles appear over larger ones
      marker.setZIndex(Math.round(1 - self.getMarkerSizeFactor() * 100));
    };
    
    this.getMarkerImageUrl = function() {
      return data["marker_image_url"];
    }
    
    this.clicked = function(event) {
      window.iui.showPageByHref(self.getLink());
    };
    
    this.getMarker = function() {
      return marker;
    }
       
    this.getLatitude = function() {
      return data.latitude;
    };
    
    this.getLongitude = function() {
      return data.longitude;
    };
    
    this.getLatLng = function() {
      return new google.maps.LatLng(this.getLatitude(), this.getLongitude());
    };
    
    // Update this country from the new data provided
    this.update = function(new_data) {
      data = new_data;
      
      // re-draw the marker, since the data might have changed
      changeMarkerForCurrentZoomLevel();
      
      // set the overlay text, since that might have changed also
      overlay.update();
      
      google.maps.event.trigger($.WorldBank.the_map, 'resize');
    };
    
    this.getBounds = function() {
      bounds = bounds || new google.maps.LatLngBounds(
        new google.maps.LatLng(this.getLatitude() - 1, this.getLongitude() - 1),
        new google.maps.LatLng(this.getLatitude() + 1, this.getLongitude() + 1)
        );
      return bounds;
    };
    
    this.getMarkerSizeFactor = function() {
      return data.size_factor;
    };
    
    this.getLink = function() {
      return data.link;
    };
    
    this.getOverlayText = function() {
      return data.overlay_text;
    };
    
    // returns true if this country's marker can be seen on the map
    this.isVisible = function() {
      if (marker.getMap().getBounds().contains(this.getLatLng()))
        return true;
      else
        return false;
    };
    
    // add this country to the list
    $.WorldBank.Country.countries[data.name] = this;
    
    // save the data
    this.data = data;
    
    // create a google marker to represent this country on the map
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.getLatitude(), this.getLongitude()),
      title: data.name,
      flat: true    // no shadow
    });
    
    // draw markers at the appropriate size
    changeMarkerForCurrentZoomLevel();
    
    overlay = new $.WorldBank.CountryOverlay(this);
    
    // watch for a change of zoom
    google.maps.event.addListener($.WorldBank.the_map, 'zoom_changed', function(event) {
        changeMarkerForCurrentZoomLevel();
    });
    
    // add a reference back to this object
    marker.country = this;   
    
    // add a click event for this marker
    google.maps.event.addListener(marker, 'click', this.clicked);
    
    // show it on the map
    marker.setMap($.WorldBank.the_map);
  }
  
}) ();

// All the Countrys created, by name
$.WorldBank.Country.countries = []; 
// The property used for displaying data on the map
$.WorldBank.Country.data_property;

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

// Create or update a country or a bunch of countries from some JSON data
$.WorldBank.Country.create_or_update = function(data) {
  if (data == null || data["error"]) {
    return null;
  }
  
  if (data instanceof Array) {
    for (var i in data) {
      $.WorldBank.Country.create_or_update(data[i]);
    }
  } else {
    if (this.exists(data))
      this.update(data);
    else
      this.create(data);
  }
};

// create a country from data returned by the server
$.WorldBank.Country.create = function(data) {
  var country = new $.WorldBank.Country(data);
  return country;
};

// update a country from data returned by the server
$.WorldBank.Country.update = function(data) {
  var country = this.countries[data.name];
  country.update(data);
};

// Check if a country already exists that has this data
$.WorldBank.Country.exists = function(data) {
  if (this.countries[data.name])
    return true;
  else
    return false;
}

// Change what data we're looking at on the map
$.WorldBank.Country.changeData = function(to) {
  if (to != this.data_property) {
    this.data_property = to;
    $.getJSON("/country_data/" + this.data_property, this.create_or_update);
  }
}
