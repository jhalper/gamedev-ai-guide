(function () {
  if (!window.firebase) {
    return;
  }

  var firebaseConfig = {
    apiKey: "AIzaSyA_VUS9XItMe0rQWVyrQRz3-UrUx__ZTV8",
    authDomain: "gamedev-ai-guide.firebaseapp.com",
    databaseURL: "https://gamedev-ai-guide-default-rtdb.firebaseio.com",
    projectId: "gamedev-ai-guide",
    storageBucket: "gamedev-ai-guide.firebasestorage.app",
    messagingSenderId: "256487705979",
    appId: "1:256487705979:web:6ff552e046926bd59141de",
    measurementId: "G-ZBGDRYKQXB"
  };

  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  function getAnalytics() {
    if (typeof firebase.analytics !== "function") {
      return null;
    }

    try {
      return firebase.analytics();
    } catch (e) {
      return null;
    }
  }

  function getDatabase() {
    if (typeof firebase.database !== "function") {
      return null;
    }

    try {
      return firebase.database();
    } catch (e) {
      return null;
    }
  }

  window.gdaiFirebase = {
    app: firebase.app(),
    analytics: getAnalytics,
    database: getDatabase
  };

  var analytics = getAnalytics();
  window.gaEvent = function (name, params) {
    if (!analytics) {
      return;
    }

    try {
      analytics.logEvent(name, params || {});
    } catch (e) {
      // Keep analytics failures from affecting page behavior.
    }
  };
})();