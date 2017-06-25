import * as firebase from "firebase";

(() => {

  var config = {
    apiKey: "AIzaSyAlZTKRdSVdLCYMdQ4ESGR1k8JpPVALtNk",
    authDomain: "ossan-532d3.firebaseapp.com",
    databaseURL: "https://ossan-532d3.firebaseio.com",
    projectId: "ossan-532d3",
    storageBucket: "ossan-532d3.appspot.com",
    messagingSenderId: "69432145068"
  };
  const ossanApp = firebase.initializeApp(config);

  const ossanDB = firebase.database();

  window.addEventListener("click", () => {
    const postref = ossanDB.ref().push({
      ossan_id: 1,
      lng: 130,
      lat: 100,
    });
  });
})()
