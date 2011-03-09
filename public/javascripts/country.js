// A Class representing the text that goes over a data blob
$.WorldBank.CountryOverlay = (function() {
    return function(new_country) {
      var country = new_country;
      var div;
      var projection;
      
      this.onAdd = function() {
        var pane = this.getPanes().floatPane;
        div = $("<div class=\"country-overlay\">" + country.getOverlayText() + "</div>");
        projection = this.getProjection();
        $(div).click(function() { country.clicked(); });
        $(pane).append(div);
      }
      
      this.onRemove = function() {
        $(div).unbind("click");
        $(div).remove();
      }
      
      this.draw = function() {
        var position = projection.fromLatLngToDivPixel(country.getLatLng());
        div.css('left', position.x - div.width() / 2);
        div.css('top', position.y - div.height() / 2);
      }
      
      // Update the overlay
      this.update = function() {
        div.html(country.getOverlayText());
        this.draw();
      }
      
      // The map's zoom has changed!
      this.zoomChangedTo = function(new_zoom) {
        // Set the CSS for this label's zoom and size
        div.removeClass("zoom-0 zoom-1 zoom-2 zoom-3 zoom-4 zoom-5 zoom-6");
        div.addClass("zoom-" + new_zoom);
        
        div.removeClass("size-0 size-1 size-2 size-3");
        div.addClass("size-" + Math.round(country.getMarkerSizeFactor() * 3));
        
        this.draw();
      }
      
      this.setMap(country.getMarker().getMap());
    }
}) ();

// class representing a Country, including the markers necessary to display it on the map
$.WorldBank.Country = (function() {
  
  var marker_scale = [ 1, 10, 30, 40, 60, 90, 100 ];
  var marker_min = [ 10, 10, 14, 20, 28, 34, 40 ];
    
  return function(data) {
    var map = $.WorldBank.TheMap.getMap();
    var marker;       // the Google marker object
    var overlay;      // text to overlay over the marker
    var data;         // the data that makes it up
    var last_zoom;    // the last zoom we were at
    var self = this;  // handle closure scope
    
    var changeMarkerForZoom = function(zoom) {
      var size_factor = self.getMarkerSizeFactor();
      if (size_factor < 0) size_factor = 0;
      
      // Find a good size for the marker, depending on the zoom level
      var marker_size = Math.round(marker_scale[zoom] * size_factor + marker_min[zoom]);
      
      // The center of the circle
      var center = Math.round(marker_size / 2);
 
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
      marker.setZIndex(Math.round(1 - size_factor * 100));
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
      
      // set the overlay text, since that might have changed also
      overlay.update();
      
      var map = marker.getMap();
      marker.setMap(null);
      
      // Trigger a zoom change whether we have or not, to redraw the markers
      this.zoomChangedTo(map.getZoom());
      
      marker.setMap(map);
    };
    
    // The map's zoom level has changed!
    this.zoomChangedTo = function(new_zoom) {
      // Update the overlay
      overlay.zoomChangedTo(new_zoom);
      changeMarkerForZoom(new_zoom);
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
    
    //****** Constructor ******
    // save the data
    this.data = data;
    
    // create a google marker to represent this country on the map
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.getLatitude(), this.getLongitude()),
      title: data.name,
      flat: true,    // no shadow
      clickable: false,
      icon: null
    });
    
    changeMarkerForZoom(map.getZoom());
    
    // show it on the map
    marker.setMap(map);
    
    // add a reference back to this object
    marker.country = this;   
    
    // add the text overlay
    overlay = new $.WorldBank.CountryOverlay(this);
    
    // add this country to the list
    $.WorldBank.Country.countries[data.name] = this;
  }
}) ();

// All the Countries created, by name
$.WorldBank.Country.countries = []; 

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
  this.countries.push(country);
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

// Update all the markers and their labels
$.WorldBank.Country.zoomChangedTo = function(new_zoom) {
  for (var i = 0; i < this.countries.length; i++) {
    var country = this.countries[i];
    country.zoomChangedTo(new_zoom);
  }
}

// Change what data we're looking at on the map
$.WorldBank.Country.changeData = function(data) {
  $.WorldBank.Country.create_or_update(data);
  
  // Put the events back in place
  $("#Navigation div.option").not("#Navigation .option[selected]").click(function() {
      $.WorldBank.Country.loadNewData(this);
  });
};

// Change what data we're looking at on the map
$.WorldBank.Country.loadNewData = function(button_div) {
  // Stop the click event, as this might take some time
  $("#Navigation div.option").unbind("click");
  
  // Unhighlight all options
  $("#Navigation .option").removeAttr("selected");
  
  // Highlight this option
  $(button_div).attr("selected", "progress");
  
  var data_url = "/country_data/" + button_div.id;
  if (localStorage[data_url]) {
    // Use the cached data
    this.changeData($.parseJSON(localStorage[data_url]));
    $(button_div).attr("selected", true);
  } else {
    $.get(data_url + ".json", function(data) {
        localStorage[data_url] = data;
        $.WorldBank.Country.changeData($.parseJSON(data));
        $(button_div).attr("selected", true);
    }, "text");
  }
}
