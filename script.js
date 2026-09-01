document.addEventListener("DOMContentLoaded", function () {

    const headerTarget = document.getElementById("site-header");

    fetch("header.html")
        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load header.html");
            }

            return response.text();

        })
        .then(html => {

            headerTarget.innerHTML = html;

            highlightCurrentPage();

        })
        .catch(error => {

            console.error("Header loading error:", error);

        });

});


function highlightCurrentPage() {

    let currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (currentPage === "") {
        currentPage = "index.html";
    }


    const pageMap = {
        "index.html": "home",
        "kyoto.html": "kyoto",
        "roadtrip.html": "roadtrip",
        "osaka.html": "osaka",
        "narai.html": "narai",
        "notes.html": "notes"
    };


    const activePage = pageMap[currentPage];


    document.querySelectorAll(".trip-nav a").forEach(link => {

        if (link.dataset.page === activePage) {
            link.classList.add("active");
        }

    });

}
