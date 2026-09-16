// =====================================================
// GOOGLE MAPS / PLACES
// =====================================================

// Put your NEW restricted browser API key here.
const GOOGLE_MAPS_API_KEY = "AIzaSyD1tFdxoch8ihGkoLA7OYoEuG2k93CGi80"E";

let googleMapsPromise = null;


// =====================================================
// LOAD GOOGLE MAPS
// =====================================================

function loadGoogleMaps() {

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise(
    (resolve, reject) => {

      // Already loaded
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.importLibrary
      ) {
        resolve(window.google.maps);
        return;
      }

      // Google's current bootstrap loader
      (g => {
        var h, a, k,
          p = "The Google Maps JavaScript API",
          c = "google",
          l = "importLibrary",
          q = "__ib__",
          m = document,
          b = window;

        b = b[c] || (b[c] = {});

        var d = b.maps || (b.maps = {}),
          r = new Set(),
          e = new URLSearchParams(),
          u = () =>
            h ||
            (h = new Promise(async (f, n) => {

              await (
                a = m.createElement("script")
              );

              e.set(
                "libraries",
                [...r] + ""
              );

              for (k in g) {

                e.set(
                  k.replace(
                    /[A-Z]/g,
                    t =>
                      "_" +
                      t[0].toLowerCase()
                  ),
                  g[k]
                );

              }

              e.set(
                "callback",
                c + ".maps." + q
              );

              a.src =
                `https://maps.${c}apis.com/maps/api/js?`
                + e;

              d[q] = f;

              a.onerror =
                () =>
                  h = n(
                    Error(
                      p +
                      " could not load."
                    )
                  );

              m.head.append(a);

            }));

        d[l]
          ? console.warn(
              p +
              " only loads once. Ignoring:",
              g
            )
          : d[l] =
              (f, ...n) =>
                r.add(f) &&
                u().then(
                  () =>
                    d[l](f, ...n)
                );

      })({
        key: GOOGLE_MAPS_API_KEY,
        v: "weekly"
      });


      // Actually request Places.
      google.maps
        .importLibrary("places")
        .then(() => {
          resolve(
            google.maps
          );
        })
        .catch(error => {

          googleMapsPromise = null;
          reject(error);

        });

    }
  );

  return googleMapsPromise;
}

// Make Google Maps loader available to other pages
window.loadGoogleMaps = loadGoogleMaps;
