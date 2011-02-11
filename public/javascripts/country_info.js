// CountryInfo class, defining how to draw the information for a specific country
$.WorldBank.CountryInfoOverlay = (function() {
    
    return function() {
      var self = this;
      var country;
      var div;
      var drawn_for_zoom;
      
      var getStrokeWeight = function() {
        switch (country.marker.map.getZoom()) {
          case 0:
            return 1;
          case 1:
            return 2;
          case 2:
            return 2;
          case 3:
            return 3;
          case 4:
            return 4;
        }
        
        return 1;
      }
      
      // the line from a country marker to its label
      var info_line;
      
      var positiveLng = function() {
        var center = country.marker.getMap().getCenter();
        var delta_lng = country.getLongitude() - center.lng();
        
        return delta_lng > 0;
      }
      
      var positiveLat = function() {
        var center = country.marker.getMap().getCenter();
        var delta_lat = country.getLatitude() - center.lat();
        
        return delta_lat > 0;
      }
      
      // Work out the best place to put the info panel depending on where this
      // country's marker is.
      var getLatLng = function() {
        // establish the quadrant to place it in
        var projection = country.marker.getMap().getProjection();
        var bounds = country.marker.getMap().getBounds();
        var sw = projection.fromLatLngToPoint(bounds.getSouthWest());
        var ne = projection.fromLatLngToPoint(bounds.getNorthEast());
        var width = ne.x - sw.x;
        var height = sw.y - ne.y;
        var x, y;
        
        if (positiveLng())
          x = sw.x + (width * 0.2);
        else
          x = sw.x + (width * 0.6);
        
        if (positiveLat())
          y = ne.y + (height * 0.6);
        else
          y = ne.y + (height * 0.2);
            
        return projection.fromPointToLatLng(new google.maps.Point(x, y));
      }
      
      // Shorten the line depending on its position and the zoom level
      var getLineEndLatLng = function() {
        projection = country.marker.getMap().getProjection();
        var end_point = projection.fromLatLngToPoint(country.getLatLng()); 
        if (positiveLng())
          end_point.x -= 1.3;
        else
          end_point.x += 1.3;
        
        if (positiveLat())
          end_point.y += 1.3;
        else
          end_point.y -= 1.3;
        
        return projection.fromPointToLatLng(end_point);
      }
      
      this.show = function(new_country) {
        country = new_country;
        this.setMap(country.marker.getMap());
        
        // draw the line
        info_line = new google.maps.Polyline({
            clickable: false,
            strokeColor: "#fe8626",
            strokeOpacity: 1,
            strokeWeight: getStrokeWeight(),
            map: country.marker.getMap(),
            path: [ getLatLng(), getLineEndLatLng() ]
        });
      }
      
      this.hide = function() {
        $(div).hide();
        this.setMap(null);
        info_line.setMap(null);
      }
      
      this.onAdd = function() {
        var pane = this.getPanes().overlayMouseTarget;
        div = $(country.getSummaryHtml());
        drawn_for_zoom = country.marker.map.getZoom();
        $(pane).append(div);
        var projection = this.getProjection();
        var position = projection.fromLatLngToDivPixel(getLatLng());
        div.css('left', position.x);
        div.css('top', position.y);
        div.show();
      }
      
      this.onRemove = function() {
        $(div).remove();
      }
      
      this.draw = function() {
        if (country.marker.map.getZoom() != drawn_for_zoom)
          this.hide();
      }

    }
}) ();

$.WorldBank.CountryInfoOverlay.prototype = new google.maps.OverlayView;

// Handles display of the country information on the map by showing one
// country at a time
$.WorldBank.CountryInfos = function() {
  var INITIAL_DELAY = 3000;
  var DISPLAY_DELAY = 2000;
  var NEXT_DELAY = 1500;
  var NO_COUNTRIES_DELAY = 1000;
  var DONE_ALL_COUNTRIES_DELAY = 5000;
  
  var timeout;    // the timeout variable for showing/hiding the info on random visible countries
  var currently_displayed_country;
  var displayed_country_id = -1;
  
  var country_info_overlay = new $.WorldBank.CountryInfoOverlay();
  
  function getNextVisibleCountry() {
    var visible_countries = $.WorldBank.Country.visible_countries;
    if (visible_countries.length == 0)
      return null;
    else
      if (++displayed_country_id + 1 > visible_countries.length) {
        // shown them all so wait a bit until we show the next one
        displayed_country_id = -1;
        return null;
      } else
        return visible_countries[displayed_country_id];
  }
  
  function displayInfoFor(country) {
    country_info_overlay.show(country);
    clearTimeout(timeout);
    timeout = setTimeout(function() { removeInfoFor(country); }, DISPLAY_DELAY);
  }
  
  function removeInfoFor(country) {
    country_info_overlay.hide();
    clearTimeout(timeout);
    timeout = setTimeout(function () { showNextCountryInfo(); }, NEXT_DELAY);
  }
  
  function showNextCountryInfo() {
    // pick a country
    // display it
    var country = getNextVisibleCountry();
    if (country)
      displayInfoFor(country);
    else {
      // wait a bit more for countries to show up
      clearTimeout(timeout);
      if ($.WorldBank.Country.visible_countries.length == 0)
        timeout = setTimeout(function () { showNextCountryInfo(); }, NO_COUNTRIES_DELAY);
      else
        timeout = setTimeout(function () { showNextCountryInfo(); }, DONE_ALL_COUNTRIES_DELAY);
    }
  }
  
  return {
    start: function() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () { showNextCountryInfo(); }, INITIAL_DELAY);
    }
  }
} ();
