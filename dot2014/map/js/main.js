(function(globals) {
  'use strict';

  var maps = globals.google.maps,
      map, options, info,
      loadParticipants, drawParticipants;

  // map configuration
  options = {
    center: new maps.LatLng(48.8588589, 2.3470599),
    disableDefaultUI: true,
    mapTypeId: 'toner',
    zoom: 13,
    zoomControl: true
  };

  // map
  map = new maps.Map(document.querySelector('.map'));
  map.mapTypes.set(options.mapTypeId, new maps.StamenMapType(options.mapTypeId));
  map.setOptions(options);

  // info
  info = new maps.InfoWindow({
    content: 'TBA'
  });

  // participants
  loadParticipants = function(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == '200') {
        drawParticipants(JSON.parse(this.responseText));
      }
    }
    request.send();
  };

  drawParticipants = function(participants) {
    var bounds = new maps.LatLngBounds();

    participants.forEach(function(participant) {
      var marker, options;

      options = {
        map: map,
        position: new maps.LatLng(participant.location.latitude, participant.location.longitude),
        name: participant.name,
        fullName: participant.fullName,
        twitter: participant.twitter,
        location: {
          name: participant.location.name,
          address: participant.location.address
        }
      };

      marker = new maps.Marker(options);
      maps.event.addListener(marker, 'click', function() {
        var content = '' +
          '<section class="participant">' +
            '<h1 class="name">' +
              this.name + ' <span class="full-name">(' + this.fullName + ')</span>' +
            '</h1>' +
            (this.twitter ? '<p class="twitter"><a href="https://twitter.com/' + this.twitter + '">@' + this.twitter + '</a></p>' : '') +
            '<p class="location">' +
              '<span class="location-name">' + this.location.name + '</span> ' +
              '<span class="location-address">' + this.location.address + '</span>' +
            '</p>' +
          '</section>';

        info.setContent(content);
        info.open(map, this);
      });

      bounds.extend(marker.position);
    });

    map.fitBounds(bounds);
  };

  loadParticipants('data/participants.json');
})(this);
