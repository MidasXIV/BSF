var map;
var marker;
var geocoder;
var pathPoints = [];
var dronePath = [];
var DP;

function initialize() {
    
    var config = {
        apiKey: "AIzaSyCuA2qR6PRrlVev8UkYeSuh19PhOrwHcXs",
        authDomain: "hivemind-mxiv.firebaseapp.com",
        databaseURL: "https://hivemind-mxiv.firebaseio.com",
        projectId: "hivemind-mxiv",
        storageBucket: "hivemind-mxiv.appspot.com",
        messagingSenderId: "468470961309"
    };
    firebase.initializeApp(config);
    
    map = new google.maps.Map(document.getElementById('geomap'), {
        zoom: 17,
        //center: {lat: 62.323907, lng: -150.109291},
        center: {
            lat: 25.334031,
            lng: 55.389080000000035
        },
        mapTypeId: 'satellite'
    });
    geocoder = new google.maps.Geocoder();
    var icon = {
        url: "../Icons/reddot.png", // url
        scaledSize: new google.maps.Size(20, 20), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(10, 10) // anchor
    };
    var icon2 = {   
        //url: "../Icons/Vid.gif", // url
        url: "../Icons/dot.png", // url
        scaledSize: new google.maps.Size(20, 20), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(10, 10) // anchor
    };
    
    
    marker = new google.maps.Marker({
        map: map,
        draggable: false,
        icon: icon,
        position: new google.maps.LatLng(25.334031,55.389080000000035)
    });
    
    var droneIcon =  new google.maps.MarkerImage("../Icons/dot.png",new google.maps.Size(30,30),new google.maps.Point(0, 0),
                                                new google.maps.Point(15,15));
    
    google.maps.event.addListener(map,'dblclick',function(event) 
    {	
        var marker = new google.maps.Marker
        ({	
            position: event.latLng, 
            map: map, 
            title: ind+', '+event.latLng.lat()+', '+event.latLng.lng(),
            icon: icon2
        });

        var MarkerLat = event.latLng.lat();
        var MarkerLng = event.latLng.lng();
        console.log(MarkerLat);
        console.log(MarkerLng);
        $('#dbLat').val(MarkerLat);
        $('#dbLng').val(MarkerLng);
    });
    
    DP = new google.maps.Polyline({
          path: dronePath,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.3,
          geodesic: true,
          strokeWeight: 1
    });
    console.log("Initialize done");
    
}



$(document).ready(function () {
    //load google map
    initialize();
    var PostCodeid = '#search_location';
    $(function () {
        $(PostCodeid).autocomplete({
            source: function (request, response) {
                geocoder.geocode({
                    'address': request.term
                }, function (results, status) {
                    response($.map(results, function (item) {
                        return {
                            label: item.formatted_address,
                            value: item.formatted_address,
                            lat: item.geometry.location.lat(),
                            lon: item.geometry.location.lng()
                        };
                    }));
                });
            },
            select: function (event, ui) {

                var latlng = new google.maps.LatLng(ui.item.lat, ui.item.lon);
                marker.setPosition(latlng);
            }
        });
    });

    /*
     * Point location on google map
     */
    $('.get_map').click(function (e) {
        var address = $(PostCodeid).val();
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
                console.log("SEARCHED LOCATION : " + marker.getPosition().lat() + " " + marker.getPosition().lng());
                //$('.search_addr').val(results[0].formatted_address);
                //$('.search_latitude').val(marker.getPosition().lat());
                //$('.search_longitude').val(marker.getPosition().lng());
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
        e.preventDefault();
    });
});

function findUserLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        console.log('Latitude is ' + latitude + '\nLongitude is ' + longitude);
        var latlng = new google.maps.LatLng(latitude, longitude);
        marker.setPosition(latlng);
        map.setCenter(latlng);
    }

    function error() {
        console.log("Unable to retrieve your location");
        alert("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);
}
var ind = 1;
function addDatatoTable(){
    console.log($('#dbLat').val()+" - "+$('#dbLng').val()+" - "+$('#dbAlt').val());
    
    pathPoints.push($('#dbLat').val()+" - "+$('#dbLng').val()+" - "+$('#dbAlt').val());
    
    var tempData = '';
    tempData += '<tr class="small v-a-m"><td>'+(ind++)+'</td>                                        <td class="text-left v-a-m text-white">                                        <section><ol contenteditable="true">'+$('#dbLat').val()+'</ol></section></td><td class="text-left v-a-m text-white">                                        <section><ol contenteditable="true">'+$('#dbLng').val()+'</ol></section></td>  <td class="text-left v-a-m text-white"><section><ol contenteditable="true">'+$('#dbAlt').val()+'</ol></section></td></tr>';
    
    dronePath.push(new google.maps.LatLng($('#dbLat').val() ,$('#dbLng').val()));
    DP.setMap(null);
    DP = new google.maps.Polyline({
          path: dronePath,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.3,
          geodesic: true,
          strokeWeight: 1
    });
    DP.setMap(map);
    
    $('#dbTable').append(tempData);
}

function cancel_path(){
    pathPoints = [];
    dronePath = [];
    document.getElementById('dbTable').innerHTML = '';
    console.log('path cancelled');
}

function register_path() {
    var currentdate = new Date();
	var locale = "en-us";
	var month  = currentdate.toLocaleString(locale, {month: "long"});
	var day    = currentdate.getDate(); 
    var year   = currentdate.getFullYear(); 
    var time   = currentdate.toLocaleTimeString();
    
    var P = {};
    P.path_id = Math.floor(Math.random() * 1086923746);
    P.time    = time;
    P.day     = day;
    P.month   = month;
    P.year    = year;
    P.day     = day;
    P.path    = pathPoints;
    
    var database = firebase.database();
    var ref = database.ref('PathDesign');
    //ref.push(pathPoints);
    ref.push(P);
    console.log(P);
    pathPoints = [];
    dronePath = [];
    document.getElementById('dbTable').innerHTML = '';
    console.log('path registered');
    
}

function delete_all() {
    var database = firebase.database();
    
    var ref = database.ref('PathDesign');
    console.log('all paths deleted');
    ref.remove();
}