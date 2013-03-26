
var myLocation = [0,0],
	stationsUrl = "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML",
	statioData = "http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?NumMins=1440&StationCode=";


function getDistance(lat, long){
	lat = parseFloat(lat);
	long = parseFloat(long);	
    var R = 6371; // km
    var dLat = (lat - myLocation[0]).toRad();
    var dLon = (long - myLocation[1]).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat.toRad()) * Math.cos(myLocation[0].toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return roundish(R * c);
}

function showWait(){
	$('#wait').show();
	$('.dataTables_wrapper').hide();
}

function showStations(){
	$('#wait').hide();
	$('.dataTables_wrapper').hide();
	$('#stationList_wrapper').show();	
	$('#screen_title').html("Station List");
}
function showDetail(code){
	$('#wait').hide();
	$('.dataTables_wrapper').hide();
	$('#stationDetail_'+code+'_wrapper').show();	
	$('#screen_title').html(code);
}

function LoadStations(){	
	showWait();		
	var tmpl = $('#stationList_tmpl').html();
	
	$.getJSON(yqlJSON(stationsUrl), function(data){
		stations = data.query.results.ArrayOfObjStation;
		// get distance offset for each station:
		for(i = 0; i < stations.objStation.length; i++){
			stations.objStation[i]['distance'] = getDistance(stations.objStation[i].StationLatitude, stations.objStation[i].StationLongitude);
		}
		// render template:
		$('#workarea').append(Mustache.to_html(tmpl, stations));
		
		// apply datatable:
	    $('#stationList').dataTable({
	        "aaSorting": [[ 1, "asc" ]],
	        "fnDrawCallback": function( oSettings ) {
	        	$(".details").off('click');	// prevent callbacks stacking up
	    	    $(".details").on('click', function(){
	    	    	LoadTimes($(this).data('code'));
	    	    })
	        }
	    });
	    showStations();
	});		
}

function LoadTimes(code){
	showWait();		
	code = code.trim()
	
	if($("#stationDetail_"+code).exists()){
		showDetail(code);
	}else{	
		
		var tmpl = $('#stationDetail_tmpl').html();
		tmpl = tmpl.replace('id="stationDetail_', 'id="stationDetail_'+code);
		
		$.getJSON(yqlJSON(statioData + code), function(data){
			$('#wait').hide();

			details = data.query.results.ArrayOfObjStationData;
			$('#workarea').append(Mustache.to_html(tmpl, details));

			showDetail(code);
			$('.back').on('click', function(){			
				showStations();
			});
			
			dTable = $('#stationDetail_'+code).dataTable({
				"aaSorting": [[ 3, "asc" ]]
			});			
		});
	}
}


/**
 * phone gap:
 */
var app = {		
    initialize: function() {
        app.report('device','pending');
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    report: function(id, state) {
        // Report the event in the console
        console_log("Report: " + id + " : " + state);
        $('.status').hide();
        $('.status.' + id + '.' + state).show();
    },
    deviceready: function() {
		showWait();		
        app.report('device','complete');
        app.report('data','pending');        
        
        function onSuccess(position) {
			// if position available, save & continue...
        	myLocation[0] = parseFloat(position.coords.latitude);
        	myLocation[1] = parseFloat(position.coords.longitude);				
	        app.report('data','complete');
	        LoadStations();
	   	}
  	  	function onError(error) { 
			// on error, report and continue anyway...
	        app.report('data','position');        
    	    LoadStations();
	  	}
    	navigator.geolocation.getCurrentPosition(onSuccess, onError);        
    }    
};
