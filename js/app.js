const main = document.querySelector("main");
const searchInput = document.querySelector(".search input");

const baseURL = "https://api.themoviedb.org/3/discover/movie?api_key=5675dd8d16ff492ebb93e7765a4d1a3e&language=en-US&sort_by=popularity.desc";
const searchURL = "https://api.themoviedb.org/3/search/movie?api_key=5675dd8d16ff492ebb93e7765a4d1a3e&language=en-US&query=";
const imageURL = "http://image.tmdb.org/t/p/w500/";
let moviesArray = null;

async function Movies() {

    let response = await fetch(baseURL)
    let movies = await response.json();
    moviesArray = movies.results;
    movies.results.map(movie => renderSingleMovie(movie));
}


async function Search() {
    main.innerHTML = "";
    let value = searchInput.value
    if(value == "") Movies();
    let res = await fetch(searchURL + value.trim());
    let movies = await res.json();
    movies.results.map(movie => renderSingleMovie(movie))
}

function renderSingleMovie(movie) {
    main.innerHTML += `
     <div class="movie">
        <img src="${imageURL + movie.poster_path}" alt="${movie.title}">
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

const classRate = (val) => {
    if(val >= 8) return "green";
    if(val >= 5) return "orange";
    if(val <= 5) return "red";
}

Movies()

// search Movies 

searchInput.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) Search()
})