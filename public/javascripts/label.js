// Define the overlay, derived from google.maps.OverlayView
function Label() {

 // Label specific
 var span = this.span_ = document.createElement('div');
 span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
                      'white-space: nowrap; border: 2px solid #fe8626; ' +
                      'padding: 2px; background-color: white';

 var div = this.div_ = document.createElement('div');
 div.appendChild(span);
 div.style.cssText = 'position: absolute; display: none';
};

Label.prototype = 

// Implement onAdd
Label.prototype.onAdd = function() {
 var pane = this.getPanes().overlayMouseTarget;
 pane.appendChild(this.div_);
};

// Implement onRemove
Label.prototype.onRemove = function() {
 this.div_.parentNode.removeChild(this.div_);

 // Label is removed from the map, stop updating its position/text.
 for (var i = 0, I = this.listeners_.length; i < I; ++i) {
   google.maps.event.removeListener(this.listeners_[i]);
 }
};

// Implement draw
Label.prototype.draw = function() {
 var projection = this.getProjection();
 var position = projection.fromLatLngToDivPixel(this.lat_lng);

 var div = this.div_;
 div.style.left = position.x + 'px';
 div.style.top = position.y + 'px';
 div.style.display = 'block';

 this.span_.innerHTML = this.text;
};

Label.prototype.setLatLng = function(lat_lng) {
  this.lat_lng = lat_lng;
};

Label.prototype.setText = function(string) {
  this.text = string;
}
