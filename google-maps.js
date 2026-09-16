// =====================================================
// GOOGLE MAPS / PLACES CONFIG
// =====================================================

// Replace this with your NEW restricted Google Maps API key.
// Do not use the key you showed in the screenshot earlier;
// rotate that one first because it was exposed.

const GOOGLE_MAPS_API_KEY = "AIzaSyD1tFdxoch8ihGkoLA7OYoEuG2k93CGi80";


// =====================================================
// LOAD GOOGLE MAPS JAVASCRIPT API
// =====================================================

function loadGoogleMaps() {

  return new Promise((resolve, reject) => {

    // Don't load Google Maps twice
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://maps.googleapis.com/maps/api/js" +
      "?key=" + encodeURIComponent(GOOGLE_MAPS_API_KEY) +
      "&libraries=places" +
      "&loading=async";

    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve(window.google.maps);
    };

    script.onerror = () => {
      reject(
        new Error("Google Maps could not be loaded.")
      );
    };

    document.head.appendChild(script);

  });

}
