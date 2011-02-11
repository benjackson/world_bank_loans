// Handles display of the country information on the map by showing one
// country at a time
$.WorldBank.CountryInfos = function() {
  var INITIAL_DELAY = 1000;
  var DISPLAY_DELAY = 2000;
  var NEXT_DELAY = 1500;
  var NO_COUNTRIES_DELAY = 1000;
  var DONE_ALL_COUNTRIES_DELAY = 5000;
  
  var timeout;    // the timeout variable for showing/hiding the info on random visible countries
  var currently_displayed_country;
  var displayed_country_id = -1;
  
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
    country.displayInfo();
    clearTimeout(timeout);
    timeout = setTimeout(function() { removeInfoFor(country); }, DISPLAY_DELAY);
  }
  
  function removeInfoFor(country) {
    country.removeInfo();
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
