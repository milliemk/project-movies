//fetch details and credits from every movie
function fetchMovieDetails(movieId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  // Take the movieId and add it to the get movie details url
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos%2Ccredits%2Ckeywords&language=en-US`,
    options
  )
    .then((response) => {
      return response.json();
    })
    .then((movieDetails) => {
      console.log(movieDetails);
      renderMovieDetails(movieDetails);
      renderCastCards(movieDetails);
    })
    .catch((err) => {
      console.error(err);
    });
}

function renderMovieDetails(movieDetails) {
  const detailsContainer = document.querySelector(".movie-details");
  detailsContainer.innerHTML = "";

  const movieTitle = document.createElement("h1");
  movieTitle.setAttribute("class", "title");
  movieTitle.innerText = movieDetails.title;

  const tagline = document.createElement("h5");
  tagline.setAttribute("class", "tagline");
  tagline.innerText = movieDetails.tagline;

  const boxContainer = document.createElement("div");
  boxContainer.setAttribute("class", "box-container");

  const moviePoster = document.createElement("img");
  moviePoster.setAttribute("class", "poster-img");
  const moviePosterUrl =
    "https://image.tmdb.org/t/p/w1280" + movieDetails.poster_path;
  moviePoster.setAttribute("src", moviePosterUrl);
  moviePoster.setAttribute("alt", "Poster for" + movieDetails.title);

  const rightSideContainer = document.createElement("div");
  rightSideContainer.setAttribute("class", "movie-info");

  const boxTitle = document.createElement("h5");
  boxTitle.setAttribute("class", "box-title");
  boxTitle.innerText = "Overview:";
  rightSideContainer.appendChild(boxTitle);

  const movieOverview = document.createElement("p");
  movieOverview.setAttribute("class", "text-movieDetails");
  movieOverview.innerText = movieDetails.overview;
  rightSideContainer.appendChild(movieOverview);

  const genres = movieDetails.genres;
  const genreNames = genres.map((genre) => genre.name);
  const genreString = genreNames.join(", ");
  const movieGenres = document.createElement("p");
  movieGenres.setAttribute("class", "genres");
  movieGenres.innerText = genreString;
  rightSideContainer.appendChild(movieGenres);

  const quickInfoContainer = document.createElement("div");
  quickInfoContainer.setAttribute("class", "quick-info");

  const releaseDate = document.createElement("p");
  releaseDate.setAttribute("class", "date text-movieDetails");
  releaseDate.innerText = new Date(movieDetails.release_date).toLocaleString(
    "en-EN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  quickInfoContainer.appendChild(releaseDate);

  const cardRank = document.createElement("p");
  cardRank.setAttribute("class", "rating-container expanded");
  const symbol = document.createElement("span");
  symbol.setAttribute("class", "material-symbols-outlined");
  symbol.textContent = "star";
  const voteAverage = document.createElement("text");
  voteAverage.setAttribute("class", "vote-average text-movieDetails");
  voteAverage.innerText = movieDetails.vote_average.toFixed(1);
  cardRank.appendChild(symbol);
  cardRank.appendChild(voteAverage);
  quickInfoContainer.appendChild(cardRank);

  const movieRunTime = document.createElement("p");
  movieRunTime.setAttribute("class", "time text-movieDetails ");
  movieRunTime.innerText = movieDetails.runtime + "min";
  quickInfoContainer.appendChild(movieRunTime);

  const bottomContainer = document.createElement("div");
  bottomContainer.setAttribute("class", "bottom-container");

  const leftField = document.createElement("div");
  leftField.setAttribute("class", "left-field");

  const trailerTitle = document.createElement("h5");
  trailerTitle.setAttribute("class", "text-movieDetails trailer-title");
  trailerTitle.innerText = "Official Trailer";
  leftField.appendChild(trailerTitle);

  // embed trailer
  const movieVideoElements = movieDetails.videos;
  const movieVideoList = movieVideoElements.results;
  const officialTrailer = document.createElement("iframe");
  const lastVideo = movieVideoList[movieVideoList.length - 1];
  const key = lastVideo.key;

  const officialTrailerUrl = "https://www.youtube.com/embed/" + lastVideo.key;
  officialTrailer.setAttribute("type", "video/webm");
  officialTrailer.setAttribute("class", "trailer");
  officialTrailer.setAttribute("src", officialTrailerUrl);
  officialTrailer.setAttribute("width", "560px");
  officialTrailer.setAttribute("height", "315px");
  officialTrailer.setAttribute("frameborder", "0");
  officialTrailer.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  );
  officialTrailer.setAttribute(
    "referrerpolicy",
    "strict-origin-when-cross-origin"
  );
  leftField.appendChild(officialTrailer);

  const rightField = document.createElement("div");
  rightField.setAttribute("class", "right-field");

  const castTitle = document.createElement("h5");
  castTitle.setAttribute("class", "text-movieDetails");
  castTitle.innerText = "Cast";
  rightField.appendChild(castTitle);

  detailsContainer.appendChild(movieTitle);
  detailsContainer.appendChild(tagline);
  boxContainer.appendChild(moviePoster);
  rightSideContainer.appendChild(quickInfoContainer);
  boxContainer.appendChild(rightSideContainer);
  detailsContainer.appendChild(boxContainer);
  detailsContainer.appendChild(bottomContainer);
  bottomContainer.appendChild(leftField);
  bottomContainer.appendChild(rightField);
}

// Cast Cards
function renderCastCards(movieDetails) {
  const rightField = document.querySelector(".right-field");
  const cardListContainer = document.createElement("div");
  cardListContainer.setAttribute("class", "cast-container");

  const castElements = movieDetails.credits;
  const castList = castElements.cast;

  castList.forEach((castMember) => {
    const castCardContainer = document.createElement("div");
    castCardContainer.setAttribute("class", "cast-card-container card mb-3");
    castCardContainer.setAttribute("style", "max-width: 300px;");

    const cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "row g-0");

    const imgBox = document.createElement("div");
    imgBox.setAttribute("class", "col-md-4");

    const castImg = document.createElement("img");
    const castImgUrl = castMember.profile_path
      ? "https://image.tmdb.org/t/p/w1280" + castMember.profile_path
      : "https://media.istockphoto.com/id/653035772/vector/default-female-avatar-profile-picture-icon-grey-woman-photo-placeholder.jpg?s=170667a&w=0&k=20&c=HPjEwXAxkmKL6-PUFvmIKtzuy0Zbt2uis2xPf1uWggA="; // Fallback if no image is available
    castImg.setAttribute("src", castImgUrl);
    castImg.setAttribute("class", "img-fluid");
    castImg.setAttribute("alt", "Poster for " + castMember.name);
    imgBox.appendChild(castImg);

    const textSection = document.createElement("div");
    textSection.setAttribute("class", "col-md-8 text-section");

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    const castName = document.createElement("p");
    castName.setAttribute("class", "card-title");
    castName.innerText = castMember.name;

    const characterName = document.createElement("p");
    characterName.setAttribute("class", "card-text text-cast");
    characterName.innerText = castMember.character;

    cardBody.appendChild(castName);
    cardBody.appendChild(characterName);
    textSection.appendChild(cardBody);

    cardDiv.appendChild(imgBox);
    cardDiv.appendChild(textSection);
    castCardContainer.appendChild(cardDiv);

    cardListContainer.appendChild(castCardContainer);
  });
  rightField.appendChild(cardListContainer);
}

// Function to initiate the page
function initPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movieId");
  fetchMovieDetails(movieId);
}

// Initiate Page
initPage();
