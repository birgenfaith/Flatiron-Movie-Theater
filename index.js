document.addEventListener("DOMContentLoaded", () => {
    fetchAllMovies();
    fetchMovieDetails(1); // Fetch details for the first movie on page load

    document.getElementById('buy-ticket-button').addEventListener('click', () => {
        const availableTickets = parseInt(document.getElementById('available-tickets').innerText);
        if (availableTickets > 0) {
            updateAvailableTickets();
        } else {
            alert("This movie is sold out!");
        }
    });
});

// Fetch all movies and populate the list
async function fetchAllMovies() {
    const response = await fetch('http://localhost:3000/films');
    const movies = await response.json();
    populateMovieList(movies);
}

// Fetch details of a specific movie
async function fetchMovieDetails(movieId) {
    const response = await fetch(`http://localhost:3000/films/${movieId}`);
    const movie = await response.json();
    displayMovieDetails(movie);
}

// Display movie details
function displayMovieDetails(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('movie-runtime').innerText = `Runtime: ${movie.runtime} minutes`;
    document.getElementById('movie-showtime').innerText = `Showtime: ${movie.showtime}`;
    document.getElementById('available-tickets').innerText = availableTickets;
    document.getElementById('movie-poster').src = movie.poster;

    // Update button text if sold out
    const buyButton = document.getElementById('buy-ticket-button');
    if (availableTickets === 0) {
        buyButton.innerText = "Sold Out";
        buyButton.disabled = true; // Disable button if sold out
    } else {
        buyButton.innerText = "Buy Ticket";
        buyButton.disabled = false; // Enable button if tickets are available
    }
}

// Populate the movie list
function populateMovieList(movies) {
    const filmList = document.getElementById('films');
    filmList.innerHTML = ''; // Clear existing list
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.className = 'film item';
        li.innerText = movie.title;
        li.addEventListener('click', () => {
            fetchMovieDetails(movie.id); // Fetch details for the selected movie
        });
        filmList.appendChild(li); // Added missing closing parenthesis
    });
}

// Update available tickets and reflect it on the server
function updateAvailableTickets() {
    const movieId = 1; // Assume this is the selected movie's ID for simplicity
    const availableTickets = parseInt(document.getElementById('available-tickets').innerText);
    
    if (availableTickets > 0) {
        // Update the movie's tickets_sold on the server
        fetch(`http://localhost:3000/films/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickets_sold: availableTickets + 1,
            }),
        })
        .then(response => response.json())
        .then(updatedMovie => {
            // After updating, re-fetch and display the updated movie details
            displayMovieDetails(updatedMovie);
        })
        .catch(error => console.error('Error updating ticket count:', error));
    }
}
