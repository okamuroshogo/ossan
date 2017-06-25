import $ from "jquery";
import _ from "lodash";
import Firebase from "../lib/Firebase";

(() => {

  if($(".js-map").length <= 0) return;
  const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCHgLfO5xw1XPNrSnscz_UkRsFI5d8lcsk';
  const $target = $('body > script:last');
  const callbackName = 'initMap' + Date.now();
  $target.eq(0).after(`<script src="${url}&callback=${callbackName}"></script>`);

  const fb =new Firebase();

  window[callbackName] = () => {
    let _latLng = { lat: 35.660013, lng: 139.729054 };
    navigator.geolocation.getCurrentPosition(() => successCallback(), () => errorCallback(), {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 600000,
    });
    function successCallback(pos) {
      _latLng = {
        lat: pos.coords.latitude || 35.660013,
        lng: pos.coords.longitude || 139.729054,
      };
    }
    // Create a map object and specify the DOM element for display.
    const mapOption = {
      center: _latLng,
      scrollwheel: false,
      zoom: 16
    };
    const map = new google.maps.Map($('.js-map')[0], mapOption);
    const centerPosition = map.getCenter();
    const mapColorOption = [
      {
        'stylers': [
          {
            'saturation': -100
          }
        ]
      },
      {
        'featureType': 'poi',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
    ];
    const mapStyle = new google.maps.StyledMapType(mapColorOption);
    map.mapTypes.set('latlngStyle', mapStyle);
    map.setMapTypeId('latlngStyle');
    $(window).on('resize', () => {
      map.setCenter(centerPosition);
    });
    google.maps.event.addListener(map, "click", (evt) => {
      // TODO: マーカーの種類変えれるように
      const ossan_id = `1-${Math.random() * 4 + 1 | 0}`;
      const marker = new google.maps.Marker({
        icon: {
          url: `../img/ossan${ossan_id}.gif`,
          scaledSize: {
            width: 100,
            height: 100,
          },
        },
        scale: 1,
        optimized: false,
      });
      marker.setPosition(evt.latLng);
      marker.setMap(map);
      fb.emit(Firebase.EVENT.PUSH, {
        ossan_id: ossan_id,
        lat: evt.latLng.lat(),
        lng: evt.latLng.lng(),
      });
    });
  };

})()