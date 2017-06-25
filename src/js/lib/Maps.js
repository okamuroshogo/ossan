import $ from "jquery";


  const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCHgLfO5xw1XPNrSnscz_UkRsFI5d8lcsk';
  const $target = $('body > script:last');
  const callbackName = 'initMap' + Date.now();
  $target.eq(0).after(`<script src="${url}&callback=${callbackName}"></script>`);

  window[callbackName] = () => {
    // Create a map object and specify the DOM element for display.
    const latlng = { lat: 35.660013, lng: 139.729054 };
    const mapOption = {
      center: latlng,
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
  };
