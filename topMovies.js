let currentPage = 1;

let STATE = {
  selectedGenreId: "",
  selectedSort: "",
  searchInput: "",
};

// Fetching movies
function fetchMovies(page = 1) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  fetch(
    `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
    options
  )
    .then((response) => {
      return response.json();
    })
    .then((movies) => {
      const moviesResult = movies.results;
      controller(moviesResult);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Fetching genres
function fetchGenres(movies) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
    .then((response) => {
      return response.json();
    })

    .then((results) => {
      genres = results.genres;
      renderGenreList(genres);
      setEventListeners(movies, genres);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Controller for the movies
const controller = (movies) => {
  genreController(movies);
  renderMovieCards(movies);
  pagination(movies.total_pages);
};

// Controller for the genres
const genreController = (movies) => {
  fetchGenres(movies);
};

// Rendering of Movie Cards
function renderMovieCards(moviesResult) {
  const cardContainer = document.querySelector(".row");
  cardContainer.innerHTML = "";

  for (let i = 0; i < moviesResult.length; i++) {
    const card = document.createElement("div");
    card.setAttribute("class", "card col-4 col-sm-4 col-md-3 col-lg-2");
    card.setAttribute("style", "width: 18rem;");
    card.setAttribute("style", "margin: 0.5rem;");

    const posterLink = document.createElement("a");
    posterLink.setAttribute(
      "href",
      `/movie-page.html?movieId=${moviesResult[i].id}`
    );
    const moviePoster = document.createElement("img");
    const moviePosterUrl =
      "https://image.tmdb.org/t/p/w400" + moviesResult[i].poster_path;
    moviePoster.setAttribute("src", moviePosterUrl);
    moviePoster.setAttribute("alt", "Poster for " + moviesResult[i].title);
    moviePoster.setAttribute("class", "card-img-top");
    posterLink.appendChild(moviePoster);

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    const movieLink = document.createElement("a");
    movieLink.setAttribute(
      "href",
      `/movie-page.html?movieId=${moviesResult[i].id}`
    );
    movieLink.setAttribute("class", "card-title");
    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerText = moviesResult[i].title;
    movieLink.appendChild(cardTitle);

    const bottomContainer = document.createElement("div");
    bottomContainer.setAttribute("class", "bottom-container");

    const cardRank = document.createElement("p");
    cardRank.setAttribute("class", "rating-container expanded");
    const symbol = document.createElement("span");
    symbol.setAttribute("class", "material-symbols-outlined");
    symbol.textContent = "star";
    const voteAverage = document.createElement("text");
    voteAverage.setAttribute("class", "vote-average");
    voteAverage.innerText = moviesResult[i].vote_average.toFixed(1);

    const topDetails = document.createElement("div");
    topDetails.setAttribute("class", "top-details");
    cardBody.appendChild(topDetails);

    const releaseDate = document.createElement("p");
    releaseDate.setAttribute("class", "top-details");
    releaseDate.innerText = new Date(
      moviesResult[i].release_date
    ).toLocaleString("en-EN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    topDetails.appendChild(releaseDate);

    const popularity = Number(moviesResult[i].popularity);
    const popularityLevel = document.createElement("p");
    popularityLevel.setAttribute("class", "bold small-text top-details");
    if (popularity < 600) {
      popularityLevel.innerText = "Not Popular";
    } else if (popularity < 2000) {
      popularityLevel.innerText = "Popular";
    } else if (popularity >= 2000) {
      popularityLevel.innerText = "Very Popular";
    }
    topDetails.appendChild(popularityLevel);

    const overviewButton = document.createElement("a");
    overviewButton.setAttribute(
      "class",
      "btn btn-sm round-btn overview-button"
    );
    overviewButton.setAttribute("data-bs-custom-class", "custom-popover");
    overviewButton.setAttribute("data-bs-toggle", "popover");
    overviewButton.setAttribute("tabindex", "0");
    overviewButton.setAttribute("data-bs-title", "About");
    overviewButton.setAttribute("data-bs-placement", "top");
    overviewButton.setAttribute("data-bs-content", moviesResult[i].overview);
    overviewButton.innerText = "+";

    card.appendChild(posterLink);
    card.appendChild(cardBody);
    cardBody.appendChild(movieLink);
    cardRank.appendChild(symbol);
    cardRank.appendChild(voteAverage);
    bottomContainer.appendChild(cardRank);
    bottomContainer.appendChild(overviewButton);
    cardBody.appendChild(bottomContainer);
    cardContainer.appendChild(card);
  }
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );

  for (let i = 0; i < popoverTriggerList.length; i++) {
    new bootstrap.Popover(popoverTriggerList[i], {
      trigger: "focus",
    });
  }
}

// Sort the moviecards by popularity, release date or rating
const sortMovies = (moviesResult, sortCriterion) => {
  if (!sortCriterion) {
    return moviesResult;
  } else {
    return moviesResult.sort((a, b) => {
      if (sortCriterion === "popularity") {
        return b.popularity - a.popularity;
      } else if (sortCriterion === "release_date") {
        return new Date(b.release_date) - new Date(a.release_date);
      } else if (sortCriterion === "rating") {
        return b.vote_average - a.vote_average;
      }
    });
  }
};

// Render GenreList
const renderGenreList = (genres) => {
  const genreList = document.getElementById("sort-dropdown");

  genres.forEach((genre) => {
    const genreItem = document.createElement("li");
    genreItem.classList.add(
      "dropdown-item",
      "expanded",
      "small-text",
      "genre-list"
    );
    genreItem.setAttribute("data-value", genre.id);
    genreItem.innerText = genre.name;

    genreList.appendChild(genreItem);
  });
};

// Filter movies by genre
const filterbyGenre = (moviesResult, selectedGenre) => {
  if (!selectedGenre) {
    return moviesResult;
  } else {
    const filteredByGenreMovies = moviesResult.filter((movie) => {
      return movie.genre_ids.includes(Number(selectedGenre));
    });
    return filteredByGenreMovies;
  }
};

//Search by movie name
const filterbySearch = (moviesResult, searchInput) => {
  if (searchInput === "") {
    return moviesResult;
  } else {
    return moviesResult.filter((movie) => {
      return movie.title.toLowerCase().includes(searchInput.toLowerCase());
    });
  }
};

// Combined Filters
const combinedFilters = (moviesResult) => {
  const selectedGenreId = STATE.selectedGenreId;
  console.log("selectedGenreId :>> ", selectedGenreId);
  const selectedSort = STATE.selectedSort;
  console.log("selectedSort :>> ", selectedSort);
  const searchInput = STATE.searchInput;
  console.log("searchInput :>> ", searchInput);

  const filteredSearchMovies = filterbySearch(moviesResult, searchInput);
  const filteredByGenreMovies = filterbyGenre(
    filteredSearchMovies,
    selectedGenreId
  );
  const sortedMovies = sortMovies(filteredByGenreMovies, selectedSort);

  renderMovieCards(sortedMovies);
};

//! Setting up event listeners
function setEventListeners(movies, genres) {
  // Sorting
  const sortingOptions = document.querySelectorAll(".sort-item");
  const sortButton = document.getElementById("sort-button");
  // console.log("sortButton.innerText :>> ", sortButton.innerText);
  sortingOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      sortButton.innerText = e.target.innerText;
      STATE.selectedSort = e.target.dataset.sort;
      combinedFilters(movies);
    });
  });

  // Genre filtering
  const genreElements = document.querySelectorAll(".genre-list");
  genreElements.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      const genreButton = document.getElementById("genre-button");
      genreButton.innerText = e.target.innerText;

      STATE.selectedGenreId = e.target.dataset.value;
      combinedFilters(movies);
    });
  });

  // Search-input
  const searchMovies = document
    .getElementById("search-input")
    .addEventListener("input", (a) => {
      STATE.searchInput = a.target.value;
      combinedFilters(movies);
    });
}

// Pagination to move between pages of movies
function pagination() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.setAttribute("class", "pagination-container");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const pageButton = document.createElement("button");

    pageButton.innerText = i;
    pageButton.setAttribute("class", "page-button btn btn-sm");
    pageButton.disabled = i === currentPage;

    pageButton.addEventListener("click", () => {
      currentPage = i;
      fetchMovies(currentPage);
    });

    paginationContainer.appendChild(pageButton);
  }
}

// Function to initiate the page
function initPage() {
  fetchMovies();
}

// Initiate Page
initPage();
