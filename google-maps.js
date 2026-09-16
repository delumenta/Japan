// =====================================================
// GOOGLE MAPS / PLACES CONFIG
// =====================================================

// IMPORTANT:
// Put your NEW restricted Google Maps API key below.
// Do not use an old/revoked key.

const GOOGLE_MAPS_API_KEY = "AIzaSyD1tFdxoch8ihGkoLA7OYoEuG2k93CGi80";


// =====================================================
// GOOGLE MAPS LOADER
// =====================================================

let googleMapsPromise = null;

function loadGoogleMaps() {

  // If Google Maps is already loaded, return it immediately.
  if (
    window.google &&
    window.google.maps &&
    typeof window.google.maps.importLibrary === "function"
  ) {
    return Promise.resolve(window.google.maps);
  }


  // If we're already loading Google Maps, don't load it twice.
  if (googleMapsPromise) {
    return googleMapsPromise;
  }


  googleMapsPromise = new Promise((resolve, reject) => {

    const callbackName = "__googleMapsReady";


    // =================================================
    // GOOGLE CALLBACK
    // =================================================

    window[callbackName] = function () {

      try {

        if (
          window.google &&
          window.google.maps &&
          typeof window.google.maps.importLibrary === "function"
        ) {

          resolve(window.google.maps);

        } else {

          googleMapsPromise = null;

          reject(
            new Error(
              "Google Maps loaded, but importLibrary() is unavailable."
            )
          );

        }

      } catch (error) {

        googleMapsPromise = null;
        reject(error);

      }

    };


    // =================================================
    // CREATE GOOGLE MAPS SCRIPT
    // =================================================

    const script = document.createElement("script");


    script.src =
      "https://maps.googleapis.com/maps/api/js" +
      "?key=" + encodeURIComponent(GOOGLE_MAPS_API_KEY) +
      "&v=weekly" +
      "&loading=async" +
      "&callback=" + callbackName;


    script.async = true;


    // =================================================
    // SCRIPT LOAD ERROR
    // =================================================

    script.onerror = function () {

      googleMapsPromise = null;

      reject(
        new Error(
          "Google Maps JavaScript API could not be loaded. " +
          "Check your API key, website restrictions, API restrictions, and billing."
        )
      );

    };


    // =================================================
    // ADD GOOGLE SCRIPT TO PAGE
    // =================================================

    document.head.appendChild(script);

  });


  return googleMapsPromise;
}


// =====================================================
// MAKE FUNCTION AVAILABLE TO OTHER HTML PAGES
// =====================================================

window.loadGoogleMaps = loadGoogleMaps;
