const main = document.querySelector("main")
const nav = document.querySelector("header")
const form = document.querySelector("form")
const searchInput = document.querySelector(".search input")
const autoCompleteDisplay = document.querySelector(".auto-com")

const baseURL = "https://api.themoviedb.org/3/discover/movie?api_key=5675dd8d16ff492ebb93e7765a4d1a3e&language=en-US&sort_by=popularity.desc";
const searchURL = "https://api.themoviedb.org/3/search/movie?api_key=5675dd8d16ff492ebb93e7765a4d1a3e&language=en-US&query=";
const imageURL = "http://image.tmdb.org/t/p/w500/";

// loading image 
let movieLoading = new Image();
movieLoading.src = "loading.png";

async function Movies(URL) {

    main.innerHTML = "";
    autoCompleteDisplay.innerHTML = "";
    let response = await fetch(URL)
    let movies = await response.json();
    // notFound(movies.results)
    movies.results.map(movie => renderSingleMovie(movie));
    // lazyLoad
    document.querySelectorAll(".movie").forEach(movie => {
        lazyLoad.observe(movie);
    })
}

function renderSingleMovie(movie) {
    main.innerHTML += `
     <div class="movie">
        <img src="loading.png" alt="${movie.title}" data-img="${imageURL+movie.poster_path}">
            <div class="movie_info">
            <div class="name">${movie.title}</div>
            <div class="rate ${classRate(movie.vote_average)}">${movie.vote_average}</div>
            </div>
        <div class="overview">
            <div class="title">Overview</div>
            ${movie.overview}
        </div>
     </div>
    `
}

async function autoComplete() {
    let value = searchInput.value.toLowerCase();
    let searchReg = /^[value]+\s?/;
    let b = "";

    let res = await fetch(searchURL + searchInput.value);
    let data = await res.json()

    autoCompleteDisplay.innerHTML = ""
    if (!data.results) return;
    data.results.forEach(item => {
        let title = item.title.toLowerCase()
        if (searchReg.test(title)) {
            b = searchInput.value;
        }

        if (value == title.slice(0,value.length)) {
            let span = document.createElement("span");
            span.addEventListener("click", () => {
                 searchInput.value = span.textContent
                Movies(searchURL + searchInput.value);
            })
            span.innerHTML += `<strong>${title.slice(0,value.length)}</strong>${title.slice(value.length)}`
            autoCompleteDisplay.appendChild(span)
        }

    });




}

const notFound = (movies) => {
    if (movies.length === 0) {
        const notFound = document.createElement("div")
        notFound.classList = "notFound";
        notFound.textContent = `Opps !! ${searchInput.value} not found `;
    
    }
}

const lazyLoad = new IntersectionObserver(entries => {
    entries.forEach(entre => {
        let targetImg = entre.target.querySelector("img")
        if (entre.isIntersecting) targetImg.src = targetImg.getAttribute("data-img");
    })
});

const stickyNavbar = new IntersectionObserver(entries => {
    const entre = entries[0];
    nav.classList.toggle("sticky", !entre.isIntersecting);
}, {
    threshold: 0.5,
    rootMargin: "0px",
});

const classRate = (val) => {
    if (val >= 8) return "green";
    if (val >= 5) return "orange";
    if (val <= 5) return "red";
}

Movies(baseURL);

// search Movies 
form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (searchInput.value == "") return;
    Movies(searchURL + searchInput.value);
});

// AutoCom
searchInput.addEventListener("input", autoComplete);

// sticky 
stickyNavbar.observe(document.querySelector("h5"));