
const movieList=document.getElementById('moviesList');
const movieMenu=document.getElementById('films');
function getMovies(){
    fetch('http://localhost:3000/films',{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",}
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(movie => {
            //retrieve data from server
            const poster=movie.poster;
            const title=movie.title;
            const description=movie.description;
            const runtime=movie.runtime;
            const showtime=movie.showtime;
            let availableTickets=movie.capacity-movie.tickets_sold

            //create elements to store the retrieved data
            const li= document.createElement("li");

            const moviePoster=document.createElement('img')
            moviePoster.src=poster

            const movieTitle=document.createElement('p')
            movieTitle.textContent=`Title: ${title}`;

            const movieDescription=document.createElement('h3')
            movieDescription.textContent=`Description: ${description}`;

            const movieRuntime=document.createElement('p')
            movieRuntime.textContent=`Runtime: ${runtime}`

            const movieShowtime=document.createElement('p')
            movieShowtime.textContent=`Showtime: ${showtime}`
            //
            const availableMovieTickets=document.createElement('p')
            availableMovieTickets.textContent=`Available Tickets: ${availableTickets}`

            const movieTitles=document.createElement('li')
            movieTitles.textContent=title;

            const br=document.createElement('br')

            const ticketButton=document.createElement('button')
            ticketButton.innerText=`Buy Ticket`
            ticketButton.addEventListener('click', () => {
                if (availableTickets > 0) {
                    fetch(`http://localhost:3000/films/${movie.id}`, {
                        method: 'PATCH',
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify({
                            tickets_sold: movie.tickets_sold + 1,
                        }),
                    })
                        .then(response => response.json())
                        .then(updatedMovie => {
                            // Update availableTickets dynamically
                            availableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
                            availableMovieTickets.textContent = `Available Tickets: ${availableTickets}`;

                            if (availableTickets === 0) {
                                ticketButton.disabled = true;
                                ticketButton.textContent = 'Sold Out';
                            }

                        })
                        .catch(error => console.log('Error updating tickets:', error));
                }
            });




            li.appendChild(moviePoster)
            li.appendChild(movieTitle)
            li.appendChild(movieDescription)
            li.appendChild(movieRuntime)
            li.appendChild(movieShowtime)
            li.appendChild(availableMovieTickets)
            li.appendChild(ticketButton)
            li.appendChild(br)

            movieList.appendChild(li)

            movieMenu.appendChild(movieTitles)
            movieMenu.appendChild(br)

    })
})
.catch((error) => console.log(error))
}
getMovies();