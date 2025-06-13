// movie2.js

const apiKey = '5cb01e0aec0887e6394bbb4b3cbd5a00'; // Your TMDb API Key
const apiUrl = 'https://api.themoviedb.org/3';

const input = document.getElementById('input');
const searchButton = document.getElementById('search');
const container = document.getElementById('movie-results');
const spinner = document.getElementById('spinner');
const rate = document.getElementById('rate');
const rel = document.getElementById('rel');
const all = document.getElementById('all');
const pop=document.getElementById('pop');
let currentResults = [];
let originalResults = [];
const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

// Event listener for search button
searchButton.addEventListener('click', () => {
    spinner.classList.remove('hidden')
    const query = input.value.trim();
    if (query === '') {
        alert('Please Enter A Movie Name');
    } else {
        searchMovies(query);
    }
});

// Event listener for Enter key in input
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

rate.addEventListener('click', () => displayMovies(currentResults, 'rating'));
rel.addEventListener('click', () => displayMovies(currentResults, 'releaseDate'));
pop.addEventListener('click', () => displayMovies(currentResults, 'popularity'));
all.addEventListener('click', () => displayMovies(originalResults));
// document.querySelector.getElementById('pop').addEventListener('click', () => displayMovies(currentResults, 'popularity'));
container.addEventListener('click', (e) => {
    // if (e.target && e.target.classList.contains('movie-image')) {
        const movieCard = e.target.closest('.movie-card');
        const detailsDiv = movieCard.querySelector('.movie-details');

        if (detailsDiv.classList.contains('hidden')) {
            // Show the details
            detailsDiv.classList.remove('hidden'); // Show the details
            detailsDiv.classList.add('animate-expand'); // Add expand animation

            setTimeout(() => {
                detailsDiv.classList.remove('animate-expand'); // Clean up after animation
            }, 500); // Match this duration to your CSS transition
        } else {
            // Hide the details
            detailsDiv.classList.add('animate-collapse'); // Add collapse animation

            setTimeout(() => {
                detailsDiv.classList.add('hidden'); // Hide it after collapsing
                detailsDiv.classList.remove('animate-collapse');
                movieCard.blur();
            }, 500); // Match this duration to your CSS transition
        }
    // }
});

// Function to search movies
function searchMovies(query) { 
    // Optionally, show a loading spinner or message here
    fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            currentResults = data.results;
            originalResults = [...currentResults];
            displayMovies(currentResults);
        })
        .catch(err => console.error('Error fetching movies:', err))
        .finally(() => {
            // Hide the spinner once the data is loaded
            spinner.classList.add('hidden');
        });
}

// Function to get genre names from genre IDs
function getGenre(genIds) {
    return genIds.map(id => genreMap[id] || 'Unknown').join(', ');
}

// Function to display movies
function displayMovies(results, sortBy) {
    
    container.innerHTML = ''; // Clear previous results
    if (sortBy === 'rating') {
        results.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'releaseDate') {
        results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === 'popularity') {
        results.sort((a, b) => b.popularity - a.popularity); // Correct sorting for popularity
    }
    // Filter out items without a poster image
    const filteredResults = results.filter(result => result.poster_path);

    if (filteredResults.length === 0) {
        container.innerHTML = '<p class="text-center text-red-600">No movies found.</p>';
        return;
    }

    filteredResults.forEach((result) => {
        // Create movie/TV card
        const media = document.createElement('div');
        media.className = "movie-card flex flex-col h-auto border-4 cursor-pointer border-yellow-600 mx-auto space-y-4 overflow-hidden bg-yellow-300 rounded-xl max-w-xs pb-4 hover:shadow-[0_0_10px_3px_rgba(253,224,71,1)] duration-300 focus:border-red-600 focus:shadow-[0_0_10px_3px_rgba(255,0,0,1)] focus:bg-red-300";
        media.setAttribute('tabindex', '0');

        // Movie or TV content
        media.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" 
                alt="${result.title || result.name}" 
                class="movie-image rounded-lg w-full max-h-48 duration-300 ">
            <h2 class="font-bold text-base text-center">${result.title || result.name}</h2>
            <div class="movie-details hidden duration-300">
                <p class="text-gray-700 text-center">Release Date: ${result.release_date || result.first_air_date || 'N/A'}</p>
                <p class="text-gray-700 text-center">Rating: ${result.vote_average ? result.vote_average.toFixed(1) : 'N/A'}</p>
                <p class="text-gray-700 text-center">Genre: ${getGenre(result.genre_ids)}</p>
                <p class="text-gray-700 text-center">Original Language: ${result.original_language ? result.original_language.toUpperCase() : 'N/A'}</p>

            </div>
        `;
        container.appendChild(media);
    });
}
function getCountry(movie) {
    const countryList = movie.production_countries || [];
    return countryList.length > 0 ? countryList.map(country => country.name).join(', ') : 'N/A';
}

// Event delegation for handling clicks on movie images
