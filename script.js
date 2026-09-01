document.addEventListener("DOMContentLoaded", async () => {

  const headerTarget = document.getElementById("site-header");

  if (!headerTarget) {
    console.warn('No element with id="site-header" was found.');
    return;
  }

  try {

    const response = await fetch("header.html");

    if (!response.ok) {
      throw new Error(`Could not load header.html (${response.status})`);
    }

    const headerHTML = await response.text();

    headerTarget.innerHTML = headerHTML;

    highlightCurrentPage();

  } catch (error) {

    console.error("Header failed to load:", error);

    headerTarget.innerHTML = `
      <div style="
        padding: 20px;
        border: 1px solid #29323b;
        border-radius: 16px;
        background: #10161c;
        color: #ffffff;
      ">
        Header could not be loaded.
      </div>
    `;

  }

});


function highlightCurrentPage() {

  const currentFile =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase() || "index.html";


  const pageMap = {

    "index.html": "home",

    "kyoto.html": "kyoto",

    "roadtrip.html": "roadtrip",

    "osaka.html": "osaka",

    "narai.html": "narai",

    "notes.html": "notes"

  };


  const currentPage = pageMap[currentFile];


  document
    .querySelectorAll(".trip-nav a")
    .forEach(link => {

      link.classList.remove("active");

      if (link.dataset.page === currentPage) {
        link.classList.add("active");
      }

    });

}
