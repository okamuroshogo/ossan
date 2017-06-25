import _ from "lodash";
import * as firebase from "firebase";
import EventEmitter from "eventemitter3";

export default class Firebase extends EventEmitter {
  constructor(opts = {}) {
    super();
    this._config = {
      apiKey: "AIzaSyAlZTKRdSVdLCYMdQ4ESGR1k8JpPVALtNk",
      authDomain: "ossan-532d3.firebaseapp.com",
      databaseURL: "https://ossan-532d3.firebaseio.com",
      projectId: "ossan-532d3",
      storageBucket: "ossan-532d3.appspot.com",
      messagingSenderId: "69432145068",
    };
    this.app = firebase.initializeApp(this._config);
    this._db = firebase.database();
    this._store = {};

    this._initListener();
  }

  static get EVENT() {
    return {
      PUSH: "push",
      ADDED: "added",
    };
  }

  _initListener() {
    this._ref = this._db.ref();
    this.on(Firebase.EVENT.PUSH, opts => {
      this._ref.push({
        ossan_id: opts.ossan_id,
        lat: opts.lat,
        lng: opts.lng,
      });
    });
    this._ref.on("child_added", (data) => {
      this.emit(Firebase.EVENT.ADDED, data.toJSON());
    });
  }
}
