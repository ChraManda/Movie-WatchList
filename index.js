// ===============================
// Global Setup
// ===============================
const moviesEl = document.getElementById("movies")
const searchBtn = document.getElementById("search-button")
const watchlistMoviesEl = document.getElementById("watchlist-movies")
const searchInput = document.getElementById("search-input")

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
const searchMovies = []


// ===============================
// SEARCH PAGE (index.html) 
// ===============================
if (moviesEl && searchBtn && searchInput) {

    // ==============================
    //          Functions
    // ==============================


    // Fetch movies by search input
    const fetchMovies = async (movie) => {
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=45445705&s=${movie}`)
            const data = await res.json()

            if (data.Response === "True") {
                searchMovies.length = 0
                for (let item of data.Search) {
                    const detailRes = await fetch(`https://www.omdbapi.com/?apikey=45445705&i=${item.imdbID}`)
                    const detailData = await detailRes.json()
                    searchMovies.push(detailData)
                }
            } else {
                throw new Error("Unable to find what you are looking for. Please try another search.")
            }
        } catch (error) {
            throw error
        }
    }

    //====================
    // Handle Search
    //====================
    const handlesearch = () => {

        const searchInput = document.getElementById("search-input").value.trim()
    
        const renderMovies = async () => {
            moviesEl.innerHTML = `
                <div class="loading"></div>
                <p class="loading-text">Loading...</p>
            `
    
            try {
                if (!searchInput) throw new Error("Please enter a movie title to search.")
                await fetchMovies(searchInput)
    
                const moviesHTML = searchMovies.map(movie => {
                    const inWatchlist = watchlist.some(m => m.id === movie.imdbID)
                    return `
                        <div class="movies-container">
                            <img class="movie-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : 'images/filmposters.jpg'}" alt="A movie poster of ${movie.Title}">
                            <div class="movie-desc">
                                <div class="movie-header">
                                    <h3 class="movie-title">${movie.Title}</h3>
                                    <p class="movie-ratings">⭐ ${movie.imdbRating}/10</p>
                                </div>
                                <div class="movie-info">
                                    <p>${movie.Runtime}</p>
                                    <p>${movie.Genre}</p>
                                    <button class="watchlist-button" data-watchlistBtn="${movie.imdbID}">
                                        ${inWatchlist ? "✓ Added" : '<i class="fa-solid fa-plus"></i> Watchlist'}
                                    </button>
                                </div>
                                <p class="movie-summary">${movie.Plot}</p>
                            </div>
                        </div>
                    `
                }).join('')
    
                moviesEl.innerHTML = moviesHTML
            } catch (error) {
                moviesEl.innerHTML = `
                    <div class="start-exploring">
                        <p class="start-exploring-text">${error.message}</p>
                    </div>`
            }
        }

        renderMovies()
    }


    // ==============================
    //      Event Listeners
    // ==============================

    // Enter key handler
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handlesearch()
        }
    })


    // Search button handler
    searchBtn.addEventListener("click", handlesearch)

    // Add to Watchlist
    moviesEl.addEventListener('click', e => {
        const btn = e.target.closest('.watchlist-button')
        if (!btn) return

        const movieId = btn.dataset.watchlistbtn
        const selectedMovie = searchMovies.find(movie => movie.imdbID === movieId)

        if (!selectedMovie) return

        const movieObj = {
            id: selectedMovie.imdbID,
            title: selectedMovie.Title,
            plot: selectedMovie.Plot,
            rating: selectedMovie.imdbRating,
            genre: selectedMovie.Genre,
            runtime: selectedMovie.Runtime,
            poster: selectedMovie.Poster
        }

        if (!watchlist.some(m => m.id === movieObj.id)) {
            watchlist.unshift(movieObj)
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
            btn.textContent = "✓ Added"
            btn.disabled = true
            setTimeout(() => btn.textContent = "Added ✓", 500)
        }
    })
}


// ===============================
// WATCHLIST PAGE (watchlist.html)
// ===============================
if (watchlistMoviesEl) {

    const renderWatchlist = () => {
        if (watchlist.length === 0) {
            watchlistMoviesEl.innerHTML = `
                <div class="start-exploring">
                    <p class="start-exploring-text">Your watchlist is looking a little
                        too empty...
                    </p>
                </div>
                <div class="add-movies">
                    <a href="index.html" class="start-exploring-link">
                        <i class="fa-solid fa-plus plus">  </i>
                        Let's add some movies!  
                    </a>
                </div>
            `
            return
        }

        const watchlistArr = watchlist.map(movie => `
            <div class="movies-container">
                <img class="movie-poster" src="${movie.poster !== 'N/A' ? movie.poster : 'images/filmposters.jpg'}" alt="Poster of ${movie.title}">
                <div class="movie-desc">
                    <div class="movie-header">
                        <h3 class="movie-title">${movie.title}</h3>
                        <p class="movie-ratings">⭐ ${movie.rating}/10</p>
                    </div>
                    <div class="movie-info">
                        <p>${movie.runtime}</p>
                        <p>${movie.genre}</p>
                        <button class="remove-button" data-removeId="${movie.id}">
                            <i class="fa-solid fa-trash"></i> Remove
                        </button>
                    </div>
                    <p class="movie-summary">${movie.plot}</p>
                </div>
            </div>
        `).join('')

        watchlistMoviesEl.innerHTML = watchlistArr
    }

    // Remove from watchlist
    watchlistMoviesEl.addEventListener("click", e => {
        const removeBtn = e.target.closest('.remove-button')
        if (!removeBtn) return

        const movieId = removeBtn.dataset.removeid
        watchlist = watchlist.filter(movie => movie.id !== movieId)
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
        renderWatchlist()
    })

    renderWatchlist()
}
