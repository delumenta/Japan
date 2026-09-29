/* Japan Trip — offline trip pack
 * Saves the current trip and app shell into IndexedDB/cache so the trip can
 * be opened again when the connection is unavailable.
 */
(function(){
  const DB_NAME = "japan-trip-offline";
  const DB_VERSION = 1;
  const CACHE_NAME = "japan-trip-offline-shell-v1";
  const TABLES = ["trips", "schedule", "bookings", "trip_expenses", "places", "restaurants"];
  const PAGES = [
    "index.html", "schedule.html", "food.html", "bookings.html",
    "expenses.html", "places.html", "maps.html", "profile.html", "trips.html",
    "footer.html", "footer.js", "countries.js", "google-maps.js", "supabase.js",
    "pwa.js", "style.css", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"
  ];

  function openDb(){
    return new Promise((resolve,reject)=>{
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        ["meta", ...TABLES].forEach(name => {
          if(!db.objectStoreNames.contains(name)) db.createObjectStore(name, {keyPath:"_offlineKey"});
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function writeRows(db, storeName, rows){
    return new Promise((resolve,reject)=>{
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.clear();
      (rows || []).forEach((row, index) => store.put({...row, _offlineKey:String(row.id ?? index)}));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function tripId(){
    const params = new URLSearchParams(location.search);
    const fromUrl = Number(params.get("trip"));
    const fromStorage = Number(localStorage.getItem("current_trip_id"));
    if(fromUrl || fromStorage) return fromUrl || fromStorage;

    if(typeof db !== "undefined"){
      const auth = await db.auth.getUser().catch(() => ({data:{user:null}}));
      const user = auth.data?.user;
      if(user){
        const result = await db.from("trips").select("*").eq("owner_id",user.id).order("start_date",{ascending:true}).limit(1);
        if(result.data?.[0]?.id) return Number(result.data[0].id);
      }
    }
    return null;
  }

  async function download(){
    const id = await tripId();
    if(!id) throw new Error("Open a trip first, then try Offline Usage again.");
    if(typeof db === "undefined") throw new Error("Supabase is not ready yet.");

    const dbLocal = await openDb();
    const status = message => window.dispatchEvent(new CustomEvent("travel:offline-progress",{detail:message}));
    status("Downloading trip…");

    const queries = {
      trips: db.from("trips").select("*").eq("id",id).limit(1),
      schedule: db.from("schedule").select("*").eq("trip_id",id).order("schedule_date",{ascending:true}).order("sort_order",{ascending:true}),
      bookings: db.from("bookings").select("*").eq("trip_id",id),
      trip_expenses: db.from("trip_expenses").select("*").eq("trip_id",id),
      places: db.from("places").select("*").limit(5000),
      restaurants: db.from("restaurants").select("*").limit(5000)
    };

    for(const table of TABLES){
      const result = await queries[table];
      if(result.error) throw result.error;
      await writeRows(dbLocal, table, result.data || []);
      status(`Saved ${table.replace("trip_expenses","expenses")}…`);
    }

    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(PAGES.map(path => cache.add(new URL(path, location.href).href)));

    await writeRows(dbLocal, "meta", [{
      _offlineKey:"current",
      id:"current",
      trip_id:id,
      synced_at:new Date().toISOString(),
      ready:true
    }]);
    localStorage.setItem("offline_trip_id",String(id));
    localStorage.setItem("offline_ready","1");
    status("Offline trip ready");
    return id;
  }

  function status(){
    return localStorage.getItem("offline_ready") === "1";
  }

  window.travelOffline = {download, status};

  function mount(){
    const button = document.getElementById("offlineUsageButton");
    const label = document.getElementById("offlineUsageLabel");
    if(!button) return;
    if(status() && label) label.textContent = "OFFLINE READY";
    button.addEventListener("click", async ()=>{
      button.disabled = true;
      if(label) label.textContent = "DOWNLOADING…";
      try{
        await download();
        if(label) label.textContent = "OFFLINE READY";
      }catch(error){
        console.error("Offline download failed",error);
        if(label) label.textContent = "TRY AGAIN";
        alert(error.message || "Could not prepare offline usage.");
      }finally{
        button.disabled = false;
      }
    });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",mount);
  else mount();
})();
