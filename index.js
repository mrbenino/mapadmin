var _key = 'AIzaSyAf1f66mtl8WMc61npxSgWQTR1aId-J0Ss';
var map;
var locations;
var users;
var search = document.getElementById("search");
var street;
var house;
var rest =  {
    north: 79.99,
    south: -79.99,
    west: -179.99,
    east: 179.99,
};
function findPoint(index){
    $('#tb > tbody').children().removeClass('active');
    let scTop = $('.'+index).offset().top;
    console.log(scTop);
    $('.'+index).addClass('active');
    let clheight = document.getElementById('table').clientHeight;
    table.scrollTop += scTop-(clheight/2);
}
axios.get('https://map.teplo-mrpl.com.ua/inc/rout.php?markers=all')
    .then(function (response) {

        locations = response.data;
        for (let i = 0; i < locations.length; i++) {
            locations[i].lat = Number(locations[i].lat);
            locations[i].lng = Number(locations[i].lng);
        }
  
        $('body').append('<script async defer src="https://maps.googleapis.com/maps/api/js?key='+_key+'&callback=initMap"></script>');
        initMap = function(){
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 47.127253, lng: 37.510827},
                zoom: 6,
                disableDefaultUI: true,
                restriction: {
                    latLngBounds: rest,
                    strictBounds: false,
                }
            });

            markers = locations.map(function(location, i) {
                // console.log('init mark');
                return new google.maps.Marker({
                  id: location.id,
                  position: location,
                  label: location.lab,
                  title: 'locations.info',
                  info: locations.info,
                });
            });
            
            var infowindow = null;
            
            infowindow = new google.maps.InfoWindow({
                content: "holding..."
            });
        
            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];
                google.maps.event.addListener(marker, 'click', function () {      
                    console.log(this.id);
                    index = this.id;
                    infowindow.setContent(locations[index].info);
                    infowindow.open(map, this);
                    findPoint(index);
                });
            }

            var markerCluster = new MarkerClusterer(map, markers,{
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
            google.maps.event.addListener(map, "rightclick", function(event) {
                let lat = event.latLng.lat();
                let lng = event.latLng.lng();
                lat = lat.toString().substr(0, 9);
                lng = lng.toString().substr(0, 9);
                document.getElementById('lat').value = lat;
                document.getElementById('lng').value = lng;

                return new google.maps.Marker({
                    position: {lat: Number(lat), lng: Number(lng)},
                    map: map,
                    animation: google.maps.Animation.DROP,
                    draggable:true
                });
            });
                        
        };

        $(document).ready(function(){    
            $('#add-point-form').submit(function(e){ 
                e.preventDefault();
                data = {};
                data['data'] = 'marker';
                data['lat'] = $('[name=lat]').val();
                data['lng'] = $('[name=lng]').val();
                data['lab'] = $('[name=lab]').val();
                data['info'] = $('[name=info]').val();
                console.log(data);
                $('#res').load('inc/rout.php',{data});
            });
            $('#add-user').submit(function(e){ 
                e.preventDefault();
                data = {};
                data['data'] =  'user';
                data['username'] = $('[name=username]').val();
                data['password'] = $('[name=password]').val();
                console.log(data);
                $('#res').load('inc/rout.php',{data});
            });
        
            for (let i = 0; i < locations.length; i++) {
                $('#tb > tbody:last-child').append('<tr class="'+locations[i].id+'">'+'<td>' + locations[i].id + '</td>' + '<td contenteditable="true">' + locations[i].lat + '</td>' + '<td contenteditable="true">' + locations[i].lng + '</td>' + '<td contenteditable="true">' + locations[i].lab + '</td>' + '<td contenteditable="true">' + locations[i].info + '</td>' + '</tr>');
            };
            $('.table').on('click', function(e) {
                if ($('#table').css('left') == '60px') {
                    $('#table').css('left', '-700px');
                }else{
                    $('#table').css('left', '60px');
                    $('#add-point-form').css('left', '-300px');
                    $('#users').css('left', '-300px');
                }
            });
            $('.add').on('click', function(e) {
                if ($('#add-point-form').css('left') == '60px') {
                    $('#add-point-form').css('left', '-300px');
                }else{
                    $('#add-point-form').css('left', '60px');
                    $('#table').css('left', '-700px');
                    $('#users').css('left', '-300px');
                }
            });
            $('.users').on('click', function(e) {
                if ($('#users').css('left') == '60px') {
                    $('#users').css('left', '-300px');
                }else{
                    $('#users').css('left', '60px');
                    $('#table').css('left', '-700px');
                    $('#add-point-form').css('left', '-300px');
                }
            });
        });
    })
    .catch(function (error) {
        console.log(error);
    });

search.oninput = function name(){
    SearchValue = search.value;
    house = SearchValue.replace(/\D+/g,"");
    street = SearchValue.replace(/\s\d+$/g,"");
    console.log('init street: ' + street + ' ||  init house: ' + house);
    
    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
            address: house+'+'+street+'+мариуполь,+донецк+View,+UA',
            key: _key
        }
    })
    .then(function (response) {
        // console.log(response);
        let location_response = response.data.results[0].geometry.location;
        // console.log(location_response);
        map.setCenter({
            lat : location_response.lat,
            lng : location_response.lng
        });
        SearchValue.match(/район/) ? map.setZoom(15) : map.setZoom(18);

    })
    .catch(function (error) {
        console.log(error);
    });
};

axios.get('https://map.teplo-mrpl.com.ua/inc/rout.php?users=admin')
.then(function (response) {
    console.log(response);
    users = response.data;
    for (let i = 0; i < users.length; i++) {
        $('#tb-users > tbody:last-child').append('<tr>' + '<td>' + users[i].id + '</td>' + '<td>' + users[i].username + '</td>' + '<td>' + users[i].root + '</td>' + '<td contenteditable="true" placeholder="новый пароль"></td>' + '<td class="save">save</td>' + '</tr>');
    };
})
.catch(function (error) {
    console.log(error);
});

$('#tb').on('click','td', function() {
    console.log(this);
    console.log('edit start');
    let row = $(this).parents();
    let id_row = Number(row.find('td:first').text());
    let arrEl = row.children('td');

    $(this).blur(function(){

        console.log('edit final');
        data = {};
        data['data'] = 'update';
        data['id'] = arrEl[0].innerHTML;
        data['lat'] = arrEl[1].innerHTML;
        data['lng'] = arrEl[2].innerHTML;
        data['lab'] = arrEl[3].innerHTML;
        data['info'] = arrEl[4].innerHTML;
        $('#res').load('inc/rout.php',{data});
    });
});
    
$('#tb-users').on('click','td', function() {
    console.log(this);
    console.log('edit start');
    let row = $(this).parents();
    let id_row = Number(row.find('td:first').text());
    let arrEl = row.children('td');

    $('.save').on('click', function(){
        console.log('edit final');
        data = {};
        data['data'] = 'update_password';
        data['id'] = arrEl[0].innerHTML;
        data['username'] = arrEl[1].innerHTML;
        data['password'] = arrEl[3].innerHTML;
        $('#res').load('inc/rout.php',{data});
        console.log(data);
    });
});
