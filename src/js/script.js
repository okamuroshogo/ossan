import $ from "jquery";
import _ from "lodash";
import Firebase from "./lib/Firebase";
import imgStore from "./lib/imgStore";

const DEAFAULT_LAT_LNG = {
  lat: 35.6311093,
  lng: 139.7137463,
};

function insertScript() {
  const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCHgLfO5xw1XPNrSnscz_UkRsFI5d8lcsk';
  const $target = $('body > script:last');
  const callbackName = 'initMap' + Date.now();

  $target.eq(0).after(`<script src="${url}&callback=${callbackName}"></script>`);
  window[callbackName] = () => initApp();
}


function initApp() {

  /**
   * setupMap
   */
  const mapOption = {
    center: DEAFAULT_LAT_LNG,
    // scrollwheel: false,
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


  /**
   * setup position by Geolocation API
   */
  let _latLng = DEAFAULT_LAT_LNG;

  navigator.geolocation.getCurrentPosition(
    (pos) => successCallback(pos),
    () => errorCallback(),
    {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 600000,
    }
  );
  function successCallback(pos) {
    console.log(pos);
    _latLng = {
      lat: pos.coords.latitude || DEAFAULT_LAT_LNG.LAT,
      lng: pos.coords.longitude || DEAFAULT_LAT_LNG.LNG,
    };
    map.panTo(_latLng);
  }
  function errorCallback() {
    _latLng = {
      lat: DEAFAULT_LAT_LNG.LAT,
      lng: DEAFAULT_LAT_LNG.LNG,
    };
    map.panTo(_latLng);
  }

  const fb =new Firebase();
  let ossan_id = "1";

  google.maps.event.addListener(map, "click", (evt) => {
    // firebaseにpush
    // 更新されたらマーカー置く
    // TODO: マーカーの種類変えれるように
    fb.emit(Firebase.EVENT.PUSH, {
      ossan_id: ossan_id,
      lat: evt.latLng.lat(),
      lng: evt.latLng.lng(),
    });
  });

  fb.on(Firebase.EVENT.ADDED, (data) => {
    const frameId = Math.random() * imgStore[data.ossan_id] + 1 | 0;
    const ossan_frame_id = `${data.ossan_id}-${frameId}`;
    const marker = new google.maps.Marker({
      icon: {
        url: `../img/ossan${ossan_frame_id}.gif`,
        scaledSize: {
          width: 80,
          height: 80,
        },
      },
      scale: 1,
      optimized: false,
      animation: google.maps.Animation.DROP,
    });
    marker.setPosition({
      lat: data.lat,
      lng: data.lng,
    });
    marker.setMap(map);
  });

  $(".js-ossan-select").on("click", (evt) => {
    ossan_id = evt.target.value;
  });
}


(function init() {
  if($(".js-map").length <= 0) return;
  insertScript();
})();
