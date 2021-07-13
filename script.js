document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

//flash message
const flashContainer = document.querySelector(".flash-message");

//if modal detail clicked close modal detail
const modalNya = document.querySelector(".modal");
const btnClose = document.querySelectorAll(".btn-close");
btnClose.forEach((btn) => {
  btn.addEventListener("click", function () {
    modalNya.classList.toggle("is-active");
  });
});

//event binding if detail clicked show modal box
document.addEventListener("click", async function (el) {
  if (el.target.classList.contains("btn-detail")) {
    modalNya.classList.toggle("is-active");
    const movieDetail = await getDetailMovies(el.target.dataset.imdbid);
    updateDetailUI(movieDetail);
  }
  if (el.target.classList.contains("btn-delete")) {
    flashContainer.innerHTML = ``;
  }
});

//search button clicked show data movies
const btnSearch = document.querySelector(".btn-search");
btnSearch.addEventListener("click", async function () {
  try {
    const inputSearch = document.querySelector(".input-search");
    const movie = await getMovies(inputSearch.value);
    updateUI(movie);
  } catch (err) {
    flashContainer.innerHTML = flashMessage(err);
  }
});

function getMovies(keyWord) {
  return fetch("http://www.omdbapi.com/?&apikey=790c7aa&s=" + keyWord)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => {
      if (res.Response === "False") {
        throw new Error(res.Error);
      }
      return res.Search;
    });
}

function getDetailMovies(imdbId) {
  return fetch("http://www.omdbapi.com/?&apikey=790c7aa&i=" + imdbId)
    .then((res) => res.json())
    .then((res) => res);
}

function updateDetailUI(film) {
  const modalCardBody = document.querySelector(".modal-card-body");
  const movieDetail = getModalDetail(film);
  modalCardBody.innerHTML = movieDetail;
}

function updateUI(film) {
  let isiKartu = ``;
  const movieContainer = document.querySelector(".movie-container");
  film.forEach((film) => {
    isiKartu += getIsiKartu(film);
  });
  movieContainer.innerHTML = isiKartu;
}

function getIsiKartu(film) {
  return `
  <div class="column is-3">
    <div class="card">
      <div class="card-image">
        <figure class="image is-3by4">
          <img src="${film.Poster}" alt="Placeholder image" />
        </figure>
      </div>
      <div class="card-content">
        <h4 class="title is-5">${film.Title}</h4>
        <p class="subtitle">${film.Year}</p>
        <button class="button is-dark btn-detail" data-imdbid="${film.imdbID}">Detail</button>
      </div>
    </div>
  </div>`;
}
function getModalDetail(film) {
  return `<div class="tile is-ancestor">
            <div class="tile is-parent">
              <article class="tile is-child box image is-3by4">
                <img src="${film.Poster}" />
              </article>
            </div>
            <div class="tile is-parent is-8">
              <article class="tile is-child box">
                <p class="title">${film.Title}</p>
                <p class="subtitle"><strong>Released : </strong>${film.Released}</p>
                <div class="content">
                  <strong>Genre : </strong>${film.Genre}
                  <br>
                  <strong>Actors : </strong>${film.Actors}
                  <br>
                  <strong>Plot : </strong>${film.Plot}
                  <br>
                </div>
              </article>
            </div>
          </div>`;
}

// const btnDelete = document.querySelector(".btn-delete");
// btnDelete.addEventListener("click", function () {
//   flashContainer.innerHTML = ``;
// });

function flashMessage(btn) {
  return `
  <article class="message is-danger">
    <div class="message-header">
      <p>Error</p>
      <button class="delete btn-delete" aria-label="delete"></button>
    </div>
    <div class="message-body">
      ${btn}
    </div>
  </article>`;
}
