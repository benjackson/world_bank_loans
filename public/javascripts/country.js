// A Class representing all the country markers as an overlay, instead of as individual google markers
$.WorldBank.CountryMarkersOverlay = (function() {
    return function(the_map) {
      var map = the_map;
      var div = $("<div class=\"country-markers\"></div>");  
      var projection;
      
      this.onAdd = function() {
        projection = this.getProjection();
        var pane = $(this.getPanes().overlayImage);
        pane.append(div);
      };
      
      this.onRemove = function() {
        div.remove();
      };
      
      this.draw = function() {
        // Remove all markers
        div.empty();
        
        // Create a document fragment in memory for performance
        var fragment = document.createDocumentFragment();
        var countries = $.WorldBank.Country.all();
        
        for (var i = 0; i < countries.length; i++) {
          var country = countries[i];
          var position = projection.fromLatLngToDivPixel(country.getLatLng());
          var marker_element = country.getMarkerElement(position)
          fragment.appendChild(marker_element);
        }
        
        div.append(fragment);
      };
      
      this.setCountries = function(new_countries) {
        countries = new_countries;
      };
      
      this.setMap(map);
    };
}) ();

$(window).one("google_ready", function() {
    // The google API is now loaded, so we can do this:
    $.WorldBank.CountryMarkersOverlay.prototype = new google.maps.OverlayView;
});

// class representing a Country, including the markers necessary to display it on the map
$.WorldBank.Country = (function() {
  
  var marker_scale = [ 1, 10, 30, 40, 60, 90, 100 ];
  var marker_min = [ 10, 10, 14, 20, 28, 34, 40 ];
    
  return function(data) {
    var data;         // the data that makes it up
    var map = $.WorldBank.TheMap.getMap();
    var self = this;  // handle closure scope
    
    var markerImageHtml = function(marker_size) {
      return "<img src=\"" + self.getMarkerImageUrl() + "\" style=\"width: "
        + marker_size + "px; height: " + marker_size + "px;\"/>";
    };
    
    var markerOverlayHtml = function(marker_size) {
      return "<div class=\"marker-overlay " 
      + zoomClass() + " "
      + sizeClass() + "\" style=\"left: 0; top: 0; width: "
      + marker_size + "px; height: "
      + marker_size + "px; line-height: "
      + marker_size + "px;\">" + self.getOverlayText() + "</div>";
    };
    
    var markerSizeFactor = function() {
      return data.size_factor;
    };
    
    var zoomClass = function() {
      return "zoom-" + map.getZoom();
    };
    
    var sizeClass = function() {
      return "size-" + Math.round(markerSizeFactor() * 3);
    };
    
    // Constructs a DOM element representing this country,
    // showing a marker blob of the relevant size and some
    // text overlayed on top
    this.getMarkerElement = function(position) {
      var size_factor = markerSizeFactor();
      if (size_factor < 0) size_factor = 0;
      
      // Find a good size for the marker, depending on the zoom level
      var marker_size = Math.round(marker_scale[map.getZoom()] * size_factor + marker_min[map.getZoom()]);
      var half_marker = Math.round(marker_size / 2);
      
      var x = position.x - half_marker;
      var y = position.y - half_marker;
      
      // Set the z-index so that smaller circles appear over larger ones
      var z_index = Math.round(1 - size_factor * 100);
      
      return $("<div id=\"" + this.getId() + "\" class=\"country-marker\" style=\"left: "
        + x + "px; top: " + y + "px; width: "
        + marker_size + "px; height: " + marker_size + "px; z-index: "
        + z_index + "\">"
        + markerImageHtml(marker_size) 
        + markerOverlayHtml(marker_size)
        + "</div>").get(0);
    };
    
    this.getMarkerImageUrl = function() {
      return data["marker_image_url"];
    };
    
    this.clicked = function(event) {
      window.iui.showPageByHref(self.getLink());
    };
       
    this.getLatitude = function() {
      return data.latitude;
    };
    
    this.getLongitude = function() {
      return data.longitude;
    };
    
    this.getLatLng = function() {
      return new google.maps.LatLng(this.getLatitude(), this.getLongitude());
    };
    
    this.getId = function() {
      return data.id;
    };
    
    this.getName = function() {
      return data.name;
    };
    
    // Update this country from the new data provided
    this.update = function(new_data) {
      data = new_data;
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
    
    // add this country to the list
    $.WorldBank.Country.countries[data.name] = this;
  }
}) ();

// All the Countries created, by name
$.WorldBank.Country.countries = []; 

$.WorldBank.Country.all = function() {
  return this.countries;
};

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

// Change what data we're looking at on the map
$.WorldBank.Country.changeData = function(data) {
  $.WorldBank.Country.create_or_update(data);
  
  // Put the events back in place
  $("#Navigation div.option").not("#Navigation .option[selected]").click(function() {
      $.WorldBank.Country.load(this);
  });
};

// Change what data we're looking at on the map
$.WorldBank.Country.load = function(button_div) {
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
