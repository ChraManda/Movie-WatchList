
// Selecting DOM elements
const moviesEl = document.getElementById("movies")
const searchMovies = []
const searchBtn = document.getElementById("search-button")
const watchlistFromLocalStorage =JSON.parse(localStorage.getItem("watchlist"))
let watchlist = []

// Function to fetch movies based on search input
const fetchMovies = async movie => {
    try {  
        const res = await fetch(`https://www.omdbapi.com/?apikey=45445705&s=${movie}`)
        const data = await res.json()
        
        if (data.Response === "True") {
            for (let item of data.Search) {
                const detailSearch = await fetch(`https://www.omdbapi.com/?apikey=45445705&i=${item.imdbID}`)
                const detailData = await detailSearch.json()
                searchMovies.push(detailData)
            }
        } else {
            throw new Error("Unable to find what you are looking for. Please try another search.");
        }
    } catch (error) {
        throw error
    }
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
    searchMovies.length = 0
    const searchInput = document.getElementById("search-input").value
    const renderMovies = async () => {
         moviesEl.innerHTML = `
         <div class="loading"></div>
         <p class="loading-text">Loading...</p>`;

    try {
        if (searchInput.trim()) {
            await fetchMovies(searchInput)
    
            const movies = searchMovies.map(movie => 
                `<div id="movies-container" class="movies-container">
                                <img class="movie-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : 'images/filmposters.jpg'}" alt="A movie poster of ${movie.Title}">
                                <div class="movie-desc">
                                    <div class="movie-header">
                                        <h3 class="movie-title">${movie.Title}</h3>
                                        <p class="movie-ratings">⭐ ${movie.imdbRating}/10</p>
                                    </div>
                                    <div class="movie-info">
                                        <p>${movie.Runtime}</p>
                                        <p>${movie.Genre}</p>
                                        <button class="watchlist-button" >
                                            <i class="fa-solid fa-plus" data-watchlistBtn="${movie.imdbID}"></i> Watchlist
                                        </button>
                                    </div>
                                        <p class="movie-summary">${movie.Plot}</p>
                                </div>
                            </div>
                            `
            ).join('')
            
            moviesEl.innerHTML = movies


        } else {
            throw new Error("Please enter a movie title to search.");
        }

    } catch (error) {
        moviesEl.innerHTML = `
                <div class="start-exploring">
                    <p class="start-exploring-text">
                        ${error.message}
                    </p>
                </div>`
        }
    }

    renderMovies()
})


moviesEl.addEventListener('click', e => {
    if (e.target.closest('.watchlist-button')) {
        console.log("Added to watchlist", e.target.dataset.watchlistbtn)
    }
   
})
