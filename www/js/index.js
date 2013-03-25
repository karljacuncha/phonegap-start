
var myLocation = [0,0],
	stationsUrl = "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML",
	statioData = "http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?NumMins=1440&StationCode=",
	stations = []
	dTable = null
	max = 20;


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

function LoadStations(){
	$('#screen_title').html('Station List');
	$.getJSON(yqlJSON(stationsUrl), function(data){
		stations = data.query.results.ArrayOfObjStation.objStation;
		for(i = 0; i < stations.length; i++){
			var row = $('#stationRow').html();
			row = row.replace('%%STATION_NAME%%', stations[i].StationDesc);
			row = row.replace('%%STATION_DISTANCE%%', getDistance(stations[i].StationLatitude, stations[i].StationLongitude));
			row = row.replace('%%STATION_LINK%%', stations[i].StationCode);
						
			$('#stationList tbody').append(row);
		}
	    $('#stationList').dataTable({
	        "aaSorting": [[ 1, "asc" ]],
	        "fnDrawCallback": function( oSettings ) {
	        	$(".details").off('click');
	    	    $(".details").on('click', function(){
	    	    	LoadTimes($(this).data('code'));
	    	    })
	        }
	    });
	});		
}

function LoadTimes(code){
	try{
		$('#stationDetail tbody').empty();
		dTable.fnDestroy();
	}catch(e){}

	$('#stationList_wrapper').hide();
	$('#wait').show();
	
	$.getJSON(yqlJSON(statioData + code), function(data){
		$('#wait').hide();
		$('#stationDetail_wrapper').show();
		$('#stationDetail').show();
		
		$('.back').on('click', function(){			
			$('#stationDetail_wrapper').hide();
			$('#stationList_wrapper').show();
			$('#screen_title').html("Station List");
		});

		details = data.query.results.ArrayOfObjStationData.objStationData;
		if(typeof details == "undefined"){
			$('#stationDetail tbody').append($('#trainRowError').html());
		}else if(details.length == 0){
			$('#stationDetail tbody').append($('#trainRowError').html());
		}else{			
			$('#screen_title').html(details[0].Stationfullname);
			
			if(details.length < max){
				max = details.length;
			}		
			for(i = 0; i < max; i++){
				var row = $('#trainRow').html();
				row = row.replace('%%DIRECTION%%', details[i].Direction);
				row = row.replace('%%ORIGIN%%', details[i].Origin);
				row = row.replace('%%DESTINATION%%', details[i].Destination);
				row = row.replace('%%DUE%%', details[i].Duein);
				row = row.replace('%%DUE_TIME%%', details[i].Exparrival);
				row = row.replace('%%STATUS%%', details[i].Status);
				$('#stationDetail tbody').append(row);
			}
			dTable = $('#stationDetail').dataTable({
		        "aaSorting": [[ 3, "asc" ]]
		    });
		}
	});
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
        app.report('device','complete');
        app.report('data','pending');        
        
        function onSuccess(position) {
        	myLocation[0] = parseFloat(position.coords.latitude);
        	myLocation[1] = parseFloat(position.coords.longitude);
    	}
    	function onError(error) { 
    	  // noop
    	}
    	navigator.geolocation.getCurrentPosition(onSuccess, onError);
        LoadStations();
        
        app.report('data','complete');        
    }    
};
