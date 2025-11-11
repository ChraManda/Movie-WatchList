
// fetch ("https://www.omdbapi.com/?apikey=45445705&t=superman")
//     .then(res => res.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err));

const moviesEl = document.getElementById("movies")

const searchMovies = []


const fetchMovies = async movie => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=45445705&s=${movie}`)
        const data = await res.json()
        
        if (data.Response === "True") {
            for (let item of data.Search) {
                const detailSearch = await fetch(`https://www.omdbapi.com/?apikey=45445705&i=${item.imdbID}`)
                const detailData = await detailSearch.json()
                searchMovies.push(detailData)
            }
        } else {
            console.log("Movie not found")
        }
}

const renderMovies = async () => {

    await fetchMovies('batman')

    const movies = searchMovies.map(movie => 
        `<div id="movies-container" class="movies-container">
                        <img class="movie-poster" src="${movie.Poster}" alt="">
                        <div class="movie-desc">
                            <div class="movie-header">
                                <h3 class="movie-title">${movie.Title}</h3>
                                <p class="movie-ratings">⭐ ${movie.imdbRating}/10</p>
                            </div>
                            <div class="movie-info">
                                <p>${movie.Runtime}</p>
                                <p>${movie.Genre}</p>
                                <button id='${movie.imdbID}' class="watchlist-button">
                                    <i class="fa-solid fa-plus"></i> Watchlist
                                </button>
                            </div>
                                <p class="movie-summary">${movie.Plot}</p>
                        </div>
                    </div>
                    `
    ).join('')

    moviesEl.innerHTML = movies
}
    
renderMovies()