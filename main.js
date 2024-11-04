/* function createCarousel(movies) {
  console.log("movies", movies);
  const moviesResult = movies.results;
  const carouselCon = document.querySelector(".carousel");
  const carouselInner = document.createElement("div");
  carouselInner.setAttribute("class", "carousel-inner");

  for (let i = 0; i < moviesResult.length; i++) {
    const carouselItem = document.createElement("div");
    carouselItem.setAttribute(
      "class",
      i === 0 ? "carousel-item active" : "carousel-item"
    );

    const carouselImage = document.createElement("img");
    const carouselImageUrl =
      "https://image.tmdb.org/t/p/w200" + moviesResult[i].poster_path;
    carouselImage.setAttribute("src", carouselImageUrl);
    carouselImage.setAttribute("alt", "Poster for " + moviesResult[i].title);
    carouselImage.setAttribute("class", "carousel-image d-block w-100");

    carouselItem.appendChild(carouselImage);
    carouselInner.appendChild(carouselItem);
  }
  const previousButton = document.createElement("button");
  previousButton.setAttribute("class", "carousel-control-prev");
  previousButton.setAttribute("type", "button");
  previousButton.setAttribute("data-bs-target", "#carousel");
  previousButton.setAttribute("data-bs-slide", "prev");
  const previousSymbol = document.createElement("span");
  previousSymbol.setAttribute("class", "carousel-control-prev-icon");
  const previousText = document.createElement("span");
  previousText.setAttribute("class", "visually-hidden");
  previousText.innerText = "Previous";

  previousButton.appendChild(previousSymbol);
  previousButton.appendChild(previousText);

  const nextButton = document.createElement("button");
  nextButton.setAttribute("class", "carousel-control-next");
  nextButton.setAttribute("type", "button");
  nextButton.setAttribute("data-bs-target", "#carousel");
  nextButton.setAttribute("data-bs-slide", "next");

  const nextSymbol = document.createElement("span");
  nextSymbol.setAttribute("class", "carousel-control-next-icon");
  const nextText = document.createElement("span");
  nextText.setAttribute("class", "visually-hidden");
  nextText.innerText = "Next";

  nextButton.appendChild(nextSymbol);
  nextButton.appendChild(nextText);

  carouselCon.appendChild(carouselInner);
  carouselCon.appendChild(nextButton);
  carouselCon.appendChild(previousButton);
}

createCarousel(movies);
 */

function readButton(itemId) {
  const carouselItem = document.getElementById(itemId);
  const dots = carouselItem.getElementsByClassName("dots")[0];
  const moreText = carouselItem.getElementsByClassName("more")[0];
  const btnText = carouselItem.getElementsByClassName("readMoreBtn")[0];

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read More";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read Less";
    moreText.style.display = "inline";
  }
}
