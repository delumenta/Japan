/* =========================================================
   SHARED RADIAL NAVIGATION
   Requires:
   - supabase-js
   - supabase.js
   - <div id="footer"></div>
========================================================= */

(function(){

  const FOOTER_FILE = "footer.html";

  let footerTripId =
    Number(
      new URLSearchParams(
        location.search
      ).get("trip")
    )
    ||
    Number(
      localStorage.getItem(
        "current_trip_id"
      )
    )
    ||
    null;

  let footerUser = null;


  /* =======================================================
     HELPERS
  ======================================================= */

  const txt = value =>
    String(value ?? "");


  const esc = value =>
    txt(value)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");


  const norm = value =>
    txt(value)
      .trim()
      .toLowerCase();


  function prettyDate(value){

    if(!value){
      return "";
    }

    return new Date(
      value + "T12:00:00"
    ).toLocaleDateString(
      "en-SG",
      {
        day:"numeric",
        month:"short",
        year:"numeric"
      }
    );

  }


  function tripIcon(country){

    const value =
      norm(country);

    if(value.includes("japan")){
      return "🇯🇵";
    }

    if(value.includes("taiwan")){
      return "🇹🇼";
    }

    if(value.includes("singapore")){
      return "🇸🇬";
    }

    if(value.includes("korea")){
      return "🇰🇷";
    }

    if(value.includes("china")){
      return "🇨🇳";
    }

    if(value.includes("thailand")){
      return "🇹🇭";
    }

    if(value.includes("malaysia")){
      return "🇲🇾";
    }

    if(value.includes("indonesia")){
      return "🇮🇩";
    }

    return "✈️";

  }


  function currentPage(){

    return (
      location.pathname
        .split("/")
        .pop()
        .toLowerCase()
      ||
      "index.html"
    );

  }


  function withTrip(page){

    return footerTripId

      ? `${page}?trip=${encodeURIComponent(
          footerTripId
        )}`

      : page;

  }


  /* =======================================================
     LOAD FOOTER.HTML
  ======================================================= */

  async function loadHTML(){

    const host =
      document.getElementById(
        "footer"
      );


    if(!host){

      console.warn(
        'Shared navigation: <div id="footer"></div> not found.'
      );

      return false;

    }


    const response =
      await fetch(
        FOOTER_FILE,
        {
          cache:"no-cache"
        }
      );


    if(!response.ok){

      throw new Error(
        `Could not load ${FOOTER_FILE} (${response.status}).`
      );

    }


    host.innerHTML =
      await response.text();


    return true;

  }


  /* =======================================================
     SET LINKS
  ======================================================= */

  function setupLinks(){

    const links = {

      /* RADIAL MENU */

      sharedNavHome:
        "index.html",

      sharedNavPlan:
        "schedule.html",

      sharedNavFood:
        "food.html",

      sharedNavExpenses:
        "expenses.html",

      sharedNavHub:
        "bookings.html",

      sharedNavMap:
        "maps.html",


      /* SECONDARY MORE MENU */

      sharedProfileLink:
        "profile.html",

      sharedTripsLink:
        "trips.html",

      sharedPlacesLink:
        "places.html"

    };


    Object.entries(
      links
    ).forEach(
      ([id,page]) => {

        const element =
          document.getElementById(id);


        if(element){

          element.href =
            withTrip(page);

        }

      }
    );


    /* =====================================================
       ACTIVE PAGE
    ===================================================== */

    const activeMap = {

      "index.html":
        "sharedNavHome",

      "schedule.html":
        "sharedNavPlan",

      "food.html":
        "sharedNavFood",

      "expenses.html":
        "sharedNavExpenses",

      "bookings.html":
        "sharedNavHub",

      "maps.html":
        "sharedNavMap"

    };


    const active =
      document.getElementById(
        activeMap[
          currentPage()
        ]
      );


    if(active){

      active.classList.add(
        "active"
      );

      active.setAttribute(
        "aria-current",
        "page"
      );

    }

  }


  /* =======================================================
     OPEN / CLOSE RADIAL MENU
  ======================================================= */

  function setRadial(open){

    const menu =
      document.getElementById(
        "radialMenu"
      );

    const dim =
      document.getElementById(
        "radialDim"
      );

    const button =
      document.getElementById(
        "sharedNavMore"
      );


    menu?.classList.toggle(
      "open",
      open
    );


    dim?.classList.toggle(
      "open",
      open
    );


    button?.setAttribute(
      "aria-expanded",
      String(open)
    );


    button?.setAttribute(
      "aria-label",

      open
        ? "Close navigation"
        : "Open navigation"
    );

  }


  /* =======================================================
     SET UP RADIAL + SHEETS
  ======================================================= */

  function setupUI(){

    const mainButton =
      document.getElementById(
        "sharedNavMore"
      );

    const dim =
      document.getElementById(
        "radialDim"
      );

    const secondaryMore =
      document.getElementById(
        "sharedSecondaryMore"
      );


    /* MORE SHEET */

    const more =
      document.getElementById(
        "sharedMoreBackdrop"
      );

    const closeMore =
      document.getElementById(
        "sharedCloseMore"
      );


    /* SWITCH TRIP SHEET */

    const trips =
      document.getElementById(
        "sharedTripBackdrop"
      );

    const switchTrip =
      document.getElementById(
        "sharedSwitchTrip"
      );

    const closeTrips =
      document.getElementById(
        "sharedCloseTrips"
      );


    /* LOGOUT */

    const logout =
      document.getElementById(
        "sharedLogout"
      );


    /* =====================================================
       MAIN FLOATING BUTTON
    ===================================================== */

    mainButton?.addEventListener(
      "click",
      () => {

        const menu =
          document.getElementById(
            "radialMenu"
          );


        const isOpen =
          menu?.classList.contains(
            "open"
          );


        setRadial(
          !isOpen
        );

      }
    );


    /* =====================================================
       CLICK BACKGROUND TO CLOSE
    ===================================================== */

    dim?.addEventListener(
      "click",
      () => {

        setRadial(false);

      }
    );


    /* =====================================================
       CLOSE WHEN NAVIGATION ITEM CLICKED
    ===================================================== */

    document
      .querySelectorAll(
        ".radial-item[href]"
      )
      .forEach(
        item => {

          item.addEventListener(
            "click",
            () => {

              setRadial(false);

            }
          );

        }
      );


    /* =====================================================
       SECONDARY "MORE"
    ===================================================== */

    secondaryMore?.addEventListener(
      "click",
      () => {

        setRadial(false);

        more?.classList.add(
          "open"
        );

      }
    );


    /* =====================================================
       CLOSE MORE SHEET
    ===================================================== */

    closeMore?.addEventListener(
      "click",
      () => {

        more?.classList.remove(
          "open"
        );

      }
    );


    more?.addEventListener(
      "click",
      event => {

        if(
          event.target === more
        ){

          more.classList.remove(
            "open"
          );

        }

      }
    );


    /* =====================================================
       SWITCH TRIP
    ===================================================== */

    switchTrip?.addEventListener(
      "click",
      async () => {

        more?.classList.remove(
          "open"
        );

        trips?.classList.add(
          "open"
        );

        await loadTrips();

      }
    );


    closeTrips?.addEventListener(
      "click",
      () => {

        trips?.classList.remove(
          "open"
        );

      }
    );


    trips?.addEventListener(
      "click",
      event => {

        if(
          event.target === trips
        ){

          trips.classList.remove(
            "open"
          );

        }

      }
    );


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
      "keydown",
      event => {

        if(
          event.key !== "Escape"
        ){
          return;
        }


        setRadial(false);


        more?.classList.remove(
          "open"
        );


        trips?.classList.remove(
          "open"
        );

      }
    );


    /* =====================================================
       LOG OUT
    ===================================================== */

    if(logout){

      logout.addEventListener(
        "click",
        async () => {

          logout.disabled =
            true;


          const title =
            logout.querySelector(
              ".radial-more-title"
            );


          if(title){

            title.textContent =
              "Logging Out…";

          }


          try{

            const {
              error
            } =
              await db.auth.signOut();


            if(error){
              throw error;
            }


            localStorage.removeItem(
              "current_trip_id"
            );


            location.replace(
              "login.html"
            );

          }

          catch(error){

            console.error(
              "Logout:",
              error
            );


            logout.disabled =
              false;


            if(title){

              title.textContent =
                "Log Out";

            }


            alert(
              error.message ||
              "Could not log out."
            );

          }

        }
      );

    }

  }


  /* =======================================================
     GET CURRENT USER
  ======================================================= */

  async function getUser(){

    if(
      typeof db === "undefined"
    ){

      throw new Error(
        "Supabase is not ready. Load supabase.js before footer.js."
      );

    }


    const {
      data,
      error
    } =
      await db.auth.getUser();


    if(error){
      throw error;
    }


    footerUser =
      data?.user ||
      null;


    return footerUser;

  }


  /* =======================================================
     ACCESSIBLE TRIPS
  ======================================================= */

  async function accessibleTrips(){

    const user =
      footerUser ||
      await getUser();


    if(!user){

      throw new Error(
        "You are not signed in."
      );

    }


    const [
      owned,
      members
    ] =
      await Promise.all([

        db
          .from("trips")
          .select("*")
          .eq(
            "owner_id",
            user.id
          ),

        db
          .from("trip_members")
          .select("trip_id")
          .eq(
            "user_id",
            user.id
          )

      ]);


    if(owned.error){
      throw owned.error;
    }


    if(members.error){
      throw members.error;
    }


    const ids =
      [
        ...new Set(
          (members.data || [])
            .map(
              row =>
                Number(
                  row.trip_id
                )
            )
            .filter(
              Number.isFinite
            )
        )
      ];


    let shared =
      [];


    if(ids.length){

      const result =
        await db
          .from("trips")
          .select("*")
          .in(
            "id",
            ids
          );


      if(result.error){
        throw result.error;
      }


      shared =
        result.data ||
        [];

    }


    const tripMap =
      new Map();


    (owned.data || [])
      .forEach(
        trip => {

          tripMap.set(
            Number(
              trip.id
            ),
            {
              ...trip,
              __role:"owner"
            }
          );

        }
      );


    shared.forEach(
      trip => {

        const id =
          Number(
            trip.id
          );


        if(
          !tripMap.has(id)
        ){

          tripMap.set(
            id,
            {
              ...trip,
              __role:"member"
            }
          );

        }

      }
    );


    return [
      ...tripMap.values()
    ].sort(
      (a,b) =>

        txt(
          a.start_date
        ).localeCompare(
          txt(
            b.start_date
          )
        )
    );

  }


  /* =======================================================
     RESOLVE CURRENT TRIP
  ======================================================= */

  async function resolveTrip(){

    if(footerTripId){
      return;
    }


    try{

      const trips =
        await accessibleTrips();


      if(
        trips.length
      ){

        footerTripId =
          Number(
            trips[0].id
          );

      }

    }

    catch(error){

      console.warn(
        "Radial navigation could not resolve trip:",
        error
      );

    }

  }


  /* =======================================================
     LOAD SWITCH TRIP LIST
  ======================================================= */

  async function loadTrips(){

    const box =
      document.getElementById(
        "sharedTripList"
      );


    if(!box){
      return;
    }


    box.innerHTML = `
      <div class="footer-trip-message">
        Loading your trips…
      </div>
    `;


    try{

      const trips =
        await accessibleTrips();


      if(
        !trips.length
      ){

        box.innerHTML = `
          <div class="footer-trip-message">
            No trips available yet.
          </div>
        `;

        return;

      }


      const page =
        currentPage();


      /* Pages where switching trip
         keeps you on the same page */

      const allowed = [

        "index.html",
        "schedule.html",
        "food.html",
        "bookings.html",
        "expenses.html",
        "maps.html",
        "profile.html",
        "places.html"

      ];


      const target =
        allowed.includes(page)

          ? page

          : "index.html";


      box.innerHTML =
        trips.map(
          trip => {

            const id =
              Number(
                trip.id
              );


            const current =
              id ===
              Number(
                footerTripId
              );


            const dates =

              trip.start_date &&
              trip.end_date

                ?

              `${
                prettyDate(
                  trip.start_date
                )
              } – ${
                prettyDate(
                  trip.end_date
                )
              }`

                :

              "";


            const meta =
              [
                trip.country,
                dates
              ]
              .filter(Boolean)
              .join(" · ");


            return `

              <a
                class="
                  footer-trip-card
                  ${
                    current
                      ? "current"
                      : ""
                  }
                "
                href="${target}?trip=${id}"
              >

                <div class="footer-trip-icon">

                  ${
                    tripIcon(
                      trip.country
                    )
                  }

                </div>


                <div>

                  <div class="footer-trip-name">

                    ${
                      esc(
                        trip.name ||
                        "Unnamed Trip"
                      )
                    }

                  </div>


                  <div class="footer-trip-meta">

                    ${
                      esc(meta)
                    }

                  </div>


                  <span class="footer-trip-role">

                    ${
                      current
                        ? "CURRENT · "
                        : ""
                    }

                    ${
                      trip.__role ===
                      "owner"

                        ? "YOUR TRIP"

                        : "SHARED WITH YOU"
                    }

                  </span>

                </div>


                <div class="footer-trip-arrow">
                  →
                </div>

              </a>

            `;

          }
        )
        .join("");

    }

    catch(error){

      console.error(
        "Switch trip:",
        error
      );


      box.innerHTML = `

        <div class="
          footer-trip-message
          error
        ">

          Could not load your trips.

          <br><br>

          ${
            esc(
              error.message ||
              "Supabase error"
            )
          }

        </div>

      `;

    }

  }


  /* =======================================================
     START
  ======================================================= */

  async function start(){

    try{

      const loaded =
        await loadHTML();


      if(!loaded){
        return;
      }


      await resolveTrip();


      setupLinks();

      setupUI();

    }

    catch(error){

      console.error(
        "Shared radial navigation:",
        error
      );


      const host =
        document.getElementById(
          "footer"
        );


      if(host){

        host.innerHTML = `

          <div
            style="
              position:fixed;
              right:12px;
              bottom:12px;
              z-index:9999;
              padding:8px 10px;
              border:1px solid #5a3434;
              border-radius:10px;
              background:#1a1010;
              color:#ffc5c1;
              font:11px system-ui;
            "
          >
            Menu could not load.
          </div>

        `;

      }

    }

  }


  /* =======================================================
     INITIALIZE
  ======================================================= */

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      start
    );

  }

  else{

    start();

  }

})();
