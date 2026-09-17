/* =========================================================
   SHARED SIDE-RADIAL NAVIGATION
   No footer bar
   No More popup
   One floating sakura button
========================================================= */

(function(){

  const FOOTER_FILE = "footer.html";


  /* =====================================================
     ICONS
  ===================================================== */

  const ICONS = {

    home:
      "https://zngncasvdrrxyrkjqutj.supabase.co/storage/v1/object/sign/Photos/Homefooter.png?token=eyJraWQiOiIzOTgxNDUwNy1mM2QwLTQ5ZGItODA4My0xODg1MWZkNGYxMmEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJQaG90b3MvSG9tZWZvb3Rlci5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NjMyMTI3LCJleHAiOjMzMzI1NjMyMTI3fQ.9BTopbR22KJCzKMMoLItwlXMPKMgkWFTB85CvDXmkxDrTGCwWtxIQfPpde2qSjrpCFojB5ijYTArNqJf0G5hPQ",

    plan:
      "https://zngncasvdrrxyrkjqutj.supabase.co/storage/v1/object/sign/Photos/planfooter.png?token=eyJraWQiOiIzOTgxNDUwNy1mM2QwLTQ5ZGItODA4My0xODg1MWZkNGYxMmEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJQaG90b3MvcGxhbmZvb3Rlci5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NjMyMjAzLCJleHAiOjMzMzI1NjMyMjAzfQ.AzUGiKb-G7XtS_cERRiRhEqdIKs7MhJKW4vU-uWwMMS-CiArHmZnalWRfAxxFMj_DkEdD98fE01CTBNa6Cporg",

    food:
      "https://zngncasvdrrxyrkjqutj.supabase.co/storage/v1/object/sign/Photos/foodfooter.png?token=eyJraWQiOiIzOTgxNDUwNy1mM2QwLTQ5ZGItODA4My0xODg1MWZkNGYxMmEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJQaG90b3MvZm9vZGZvb3Rlci5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NjMyMTA1LCJleHAiOjMzMzI1NjMyMTA1fQ.BGrE11IoO2jl4Cf6xjkaaM5VbOTDtKfUW1xUoDnWlHa_3xJoOnOCmhuZXfLsMZ9gJFY8xSgg67C94PKYmYR1RA",

    booking:
      "https://zngncasvdrrxyrkjqutj.supabase.co/storage/v1/object/sign/Photos/bookingfooter.png?token=eyJraWQiOiIzOTgxNDUwNy1mM2QwLTQ5ZGItODA4My0xODg1MWZkNGYxMmEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJQaG90b3MvYm9va2luZ2Zvb3Rlci5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NjMyMDc4LCJleHAiOjQ5NDMyMzIwNzh9.AnZhB83lYYXO-5q5ADhzDQ_SzLNjtJHlwyOyPac-XdZ7zG4INt4wTp_S9VhoVoxz6KbtIrCZaUY1MxRm6G3BVA",

    expenses:
      "https://zngncasvdrrxyrkjqutj.supabase.co/storage/v1/object/sign/Photos/expensesfooter.png?token=eyJraWQiOiIzOTgxNDUwNy1mM2QwLTQ5ZGItODA4My0xODg1MWZkNGYxMmEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJQaG90b3MvZXhwZW5zZXNmb290ZXIucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTY0MjQwMCwiZXhwIjozMzMyNTY0MjQwMH0.2N_yNGsFpk3jtyT5yNEeMxf6T6iW38taHMwkcalrL6erpYf81ELyq_ah1kIcerGMKL6BQmIOVWuMRsCRuVDb4A",

    more:
      "https://zngncasvdrrxyrkjqutj.supabase.co/storage/v1/object/sign/Photos/morefooter.png?token=eyJraWQiOiIzOTgxNDUwNy1mM2QwLTQ5ZGItODA4My0xODg1MWZkNGYxMmEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJQaG90b3MvbW9yZWZvb3Rlci5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NjMyMTc1LCJleHAiOjQ5NDMyMzIxNzV9.O6Lx5IOJjw8nXT5tGcTXIhHlWLfWDMzx8bKePRYd-uPgHlsiaeOWPw6QR6VgkghuSHMMrDiJxEZjEnUpNNsarQ"

  };


  /* =====================================================
     CURRENT TRIP
  ===================================================== */

  let tripId =
    Number(
      new URLSearchParams(location.search).get("trip")
    )
    ||
    Number(
      localStorage.getItem("current_trip_id")
    )
    ||
    null;


  let user = null;


  /* =====================================================
     HELPERS
  ===================================================== */

  const text = value =>
    String(value ?? "");


  const esc = value =>
    text(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");


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

    if(!tripId){
      return page;
    }

    return (
      page +
      "?trip=" +
      encodeURIComponent(tripId)
    );

  }


  /* =====================================================
     LOAD FOOTER.HTML
  ===================================================== */

  async function loadHTML(){

    const host =
      document.getElementById("footer");


    if(!host){

      console.warn(
        "Radial navigation: #footer not found."
      );

      return false;

    }


    const response =
      await fetch(
        FOOTER_FILE,
        {
          cache: "no-cache"
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


  /* =====================================================
     ICONS
  ===================================================== */

  function setupIcons(){

    document
      .querySelectorAll(
        "img[data-icon]"
      )
      .forEach(img => {

        const key =
          img.dataset.icon;


        if(ICONS[key]){

          img.src =
            ICONS[key];

        }

      });

  }


  /* =====================================================
     NAVIGATION LINKS
  ===================================================== */

  function setupLinks(){

    const links = {

      sharedNavHome:
        "index.html",

      sharedNavPlan:
        "schedule.html",

      sharedNavFood:
        "food.html",

      sharedNavBooking:
        "bookings.html",

      sharedNavExpenses:
        "expenses.html",

      sharedNavMap:
        "maps.html",

      sharedNavProfile:
        "profile.html",

      sharedNavTrips:
        "trips.html",

      sharedNavPlaces:
        "places.html"

    };


    Object.entries(
      links
    ).forEach(
      ([id, page]) => {

        const element =
          document.getElementById(id);


        if(element){

          element.href =
            withTrip(page);

        }

      }
    );


    /* -----------------------------------------------
       ACTIVE PAGE
    ----------------------------------------------- */

    const activePages = {

      "index.html":
        "sharedNavHome",

      "schedule.html":
        "sharedNavPlan",

      "food.html":
        "sharedNavFood",

      "bookings.html":
        "sharedNavBooking",

      "expenses.html":
        "sharedNavExpenses",

      "maps.html":
        "sharedNavMap",

      "profile.html":
        "sharedNavProfile",

      "trips.html":
        "sharedNavTrips",

      "places.html":
        "sharedNavPlaces"

    };


    const activeId =
      activePages[
        currentPage()
      ];


    if(activeId){

      const active =
        document.getElementById(
          activeId
        );


      active?.classList.add(
        "active"
      );


      active?.setAttribute(
        "aria-current",
        "page"
      );

    }

  }


  /* =====================================================
     OPEN / CLOSE RADIAL MENU
  ===================================================== */

  function setMenu(open){

    const menu =
      document.getElementById(
        "radialMenu"
      );


    const backdrop =
      document.getElementById(
        "radialBackdrop"
      );


    const button =
      document.getElementById(
        "radialToggle"
      );


    menu?.classList.toggle(
      "open",
      open
    );


    backdrop?.classList.toggle(
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
        ? "Close menu"
        : "Open menu"
    );

  }


  /* =====================================================
     UI EVENTS
  ===================================================== */

  function setupUI(){

    const menu =
      document.getElementById(
        "radialMenu"
      );


    const toggle =
      document.getElementById(
        "radialToggle"
      );


    const backdrop =
      document.getElementById(
        "radialBackdrop"
      );


    const tripBackdrop =
      document.getElementById(
        "tripBackdrop"
      );


    /* -----------------------------------------------
       SAKURA BUTTON
    ----------------------------------------------- */

    toggle?.addEventListener(
      "click",
      () => {

        const open =
          menu?.classList.contains(
            "open"
          );


        setMenu(
          !open
        );

      }
    );


    /* -----------------------------------------------
       BACKDROP
    ----------------------------------------------- */

    backdrop?.addEventListener(
      "click",
      () => {

        setMenu(false);

      }
    );


    /* -----------------------------------------------
       NAVIGATION ITEM
    ----------------------------------------------- */

    document
      .querySelectorAll(
        ".radial-item[href]"
      )
      .forEach(
        item => {

          item.addEventListener(
            "click",
            () => {

              setMenu(false);

            }
          );

        }
      );


    /* -----------------------------------------------
       SWITCH TRIP
    ----------------------------------------------- */

    document
      .getElementById(
        "sharedSwitchTrip"
      )
      ?.addEventListener(
        "click",
        async () => {

          setMenu(false);


          tripBackdrop
            ?.classList
            .add("open");


          await loadTrips();

        }
      );


    /* -----------------------------------------------
       CLOSE SWITCH TRIP
    ----------------------------------------------- */

    document
      .getElementById(
        "tripClose"
      )
      ?.addEventListener(
        "click",
        () => {

          tripBackdrop
            ?.classList
            .remove("open");

        }
      );


    tripBackdrop?.addEventListener(
      "click",
      event => {

        if(
          event.target ===
          tripBackdrop
        ){

          tripBackdrop
            .classList
            .remove("open");

        }

      }
    );


    /* -----------------------------------------------
       LOGOUT
    ----------------------------------------------- */

    document
      .getElementById(
        "sharedLogout"
      )
      ?.addEventListener(
        "click",
        async () => {

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


            alert(
              error.message ||
              "Could not log out."
            );

          }

        }
      );


    /* -----------------------------------------------
       ESCAPE
    ----------------------------------------------- */

    document.addEventListener(
      "keydown",
      event => {

        if(
          event.key !== "Escape"
        ){
          return;
        }


        setMenu(false);


        tripBackdrop
          ?.classList
          .remove("open");

      }
    );

  }


  /* =====================================================
     CURRENT USER
  ===================================================== */

  async function getUser(){

    if(
      typeof db ===
      "undefined"
    ){

      throw new Error(
        "Load supabase.js before footer.js."
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


    user =
      data?.user ||
      null;


    return user;

  }


  /* =====================================================
     ACCESSIBLE TRIPS
  ===================================================== */

  async function accessibleTrips(){

    const currentUser =
      user ||
      await getUser();


    if(!currentUser){

      throw new Error(
        "You are not signed in."
      );

    }


    const [
      owned,
      memberships
    ] =
      await Promise.all([

        db
          .from("trips")
          .select("*")
          .eq(
            "owner_id",
            currentUser.id
          ),

        db
          .from("trip_members")
          .select("trip_id")
          .eq(
            "user_id",
            currentUser.id
          )

      ]);


    if(owned.error){
      throw owned.error;
    }


    if(memberships.error){
      throw memberships.error;
    }


    const sharedIds =
      [
        ...new Set(
          (memberships.data || [])
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


    let sharedTrips =
      [];


    if(sharedIds.length){

      const result =
        await db
          .from("trips")
          .select("*")
          .in(
            "id",
            sharedIds
          );


      if(result.error){
        throw result.error;
      }


      sharedTrips =
        result.data ||
        [];

    }


    const map =
      new Map();


    /* -----------------------------------------------
       OWNED
    ----------------------------------------------- */

    (owned.data || [])
      .forEach(
        trip => {

          map.set(
            Number(trip.id),
            {
              ...trip,
              __role: "owner"
            }
          );

        }
      );


    /* -----------------------------------------------
       SHARED
    ----------------------------------------------- */

    sharedTrips.forEach(
      trip => {

        const id =
          Number(trip.id);


        if(
          !map.has(id)
        ){

          map.set(
            id,
            {
              ...trip,
              __role: "member"
            }
          );

        }

      }
    );


    return [
      ...map.values()
    ].sort(
      (a, b) =>

        text(
          a.start_date
        )
        .localeCompare(
          text(
            b.start_date
          )
        )
    );

  }


  /* =====================================================
     RESOLVE TRIP
  ===================================================== */

  async function resolveTrip(){

    if(tripId){
      return;
    }


    try{

      const trips =
        await accessibleTrips();


      if(
        trips.length
      ){

        tripId =
          Number(
            trips[0].id
          );


        localStorage.setItem(
          "current_trip_id",
          String(tripId)
        );

      }

    }

    catch(error){

      console.warn(
        "Could not resolve trip:",
        error
      );

    }

  }


  /* =====================================================
     COUNTRY FLAG
  ===================================================== */

  function flag(country){

    const value =
      text(country)
        .toLowerCase();


    if(value.includes("japan")){
      return "🇯🇵";
    }


    if(value.includes("singapore")){
      return "🇸🇬";
    }


    if(value.includes("taiwan")){
      return "🇹🇼";
    }


    if(value.includes("korea")){
      return "🇰🇷";
    }


    if(value.includes("china")){
      return "🇨🇳";
    }


    if(value.includes("malaysia")){
      return "🇲🇾";
    }


    if(value.includes("indonesia")){
      return "🇮🇩";
    }


    if(value.includes("thailand")){
      return "🇹🇭";
    }


    return "✈️";

  }


  /* =====================================================
     LOAD TRIPS
  ===================================================== */

  async function loadTrips(){

    const box =
      document.getElementById(
        "tripList"
      );


    if(!box){
      return;
    }


    box.innerHTML = `
      <div class="trip-msg">
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
          <div class="trip-msg">
            No trips available.
          </div>
        `;

        return;

      }


      /* ---------------------------------------------
         KEEP SAME PAGE WHEN SWITCHING TRIP
      --------------------------------------------- */

      const keepSamePage = [

        "index.html",
        "schedule.html",
        "food.html",
        "bookings.html",
        "expenses.html",
        "maps.html",
        "profile.html",
        "places.html"

      ];


      const targetPage =
        keepSamePage.includes(
          currentPage()
        )

          ? currentPage()

          : "index.html";


      /* ---------------------------------------------
         BUILD TRIP CARDS
      --------------------------------------------- */

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
                tripId
              );


            const dateText =

              trip.start_date &&
              trip.end_date

                ?

              `${trip.start_date} – ${trip.end_date}`

                :

              "";


            const meta =
              [
                trip.country,
                dateText
              ]
              .filter(Boolean)
              .join(" · ");


            return `

              <a
                class="
                  trip-card
                  ${
                    current
                      ? "current"
                      : ""
                  }
                "
                href="${targetPage}?trip=${id}"
              >

                <div class="trip-flag">

                  ${
                    flag(
                      trip.country
                    )
                  }

                </div>


                <div>

                  <div class="trip-name">

                    ${
                      esc(
                        trip.name ||
                        "Unnamed Trip"
                      )
                    }

                  </div>


                  <div class="trip-meta">

                    ${
                      esc(meta)
                    }

                  </div>


                  <span class="trip-role">

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


                <div class="trip-arrow">
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
        "Load trips:",
        error
      );


      box.innerHTML = `

        <div class="trip-msg">

          ${
            esc(
              error.message ||
              "Could not load trips."
            )
          }

        </div>

      `;

    }

  }


  /* =====================================================
     START
  ===================================================== */

  async function start(){

    try{

      const loaded =
        await loadHTML();


      if(!loaded){
        return;
      }


      await resolveTrip();


      setupIcons();

      setupLinks();

      setupUI();

    }

    catch(error){

      console.error(
        "Radial navigation:",
        error
      );

    }

  }


  /* =====================================================
     INITIALIZE
  ===================================================== */

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
