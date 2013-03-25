/**
 * reclaim $ for jquery
 */
var $ = jQuery.noConflict();

/**
 * safe console logging
 * 
 * @param msg
 */
function console_log(msg) {
	if (window.console && window.console.log) {
		window.console.log(msg);
	}
}

/**
 * helper functions: DOM element exists
 */
$.fn.exists = function() {
	return this.length > 0;
};


function yqlJSON(url){
	return "http://query.yahooapis.com/v1/public/yql?format=json&q=" + encodeURIComponent('select * from xml where url="' + url + '"');	
}

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}

function roundish(num){
	return Math.round(num*100)/100;
}

$.extend({
	/**
	 * hasValue - boolean check for usable values
	 * 
	 * @param item:
	 *            the var to check
	 * @returns {Boolean}: true if valid usable value
	 */
	hasValue : function(item) {
		return (typeof item != "undefined") && item != null && item != '';
	},

	/**
	 * parseQueryString - turn query params into usable array vals
	 * 
	 * @returns key=>value pair array
	 */
	parseQueryString : function() {
		var nvpair = {};
		var qs = window.location.search.replace('?', '');
		var pairs = qs.split('&');
		$.each(pairs, function(i, v) {
			var pair = v.split('=');
			nvpair[pair[0]] = pair[1];
		});
		return nvpair;
	},

	/**
	 * parseHashString - turn hash params into usable array vals
	 * 
	 * @returns key=>value pair array
	 */
	parseHashString : function() {
		var nvpair = {};
		var qs = window.location.hash.replace('#', '');
		var pairs = qs.split('&');
		$.each(pairs, function(i, v) {
			var pair = v.split('=');
			nvpair[pair[0]] = pair[1];
		});
		return nvpair;
	}

});