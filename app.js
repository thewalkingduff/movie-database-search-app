const inputMovieSearch = document.querySelector('#movie-search-input')
const searchButton = document.querySelector('#search-btn')
const showMoviesSection = document.querySelector('#show-movies-section')
const errorSection = document.querySelector('#error-section')
const searchSection = document.querySelector('#search-section')
const movieDiv = document.querySelector('#movie-div')
const detailsSection = document.querySelector('#details-section')
const nextPageBtnDiv = document.querySelector('#next-page-btn-div')
const nextPageBtn = document.querySelector('#next-page-btn')
const prevPageBtn = document.querySelector('#prev-page-btn')

let resultsArray = []
let dataForOneMovie = []
let genres = []

let inputMovieSearchValue
let pageNumber = 1

function clearSections () {
  showMoviesSection.innerHTML = ''
  errorSection.innerHTML = ''
  detailsSection.innerHTML = ''
}

function clearLocalStorageAndArrays() {
  localStorage.clear()
  genres = []
  resultsArray = []
}

function displayMovies(searchWords) {
  if(pageNumber > 1) {
    prevPageBtn.classList.remove('hide')
    nextPageBtnDiv.classList.remove('next-page-btn-div-center')
    nextPageBtnDiv.classList.add('next-page-btn-div-right')
  }
  if(!pageNumber > 1){
    prevPageBtn.classList.add('hide')
  }
    for(let i = 0; i < 20; i++){
      if(resultsArray[i].poster_path){
        let id = resultsArray[i].id
        let moviePoster = resultsArray[i].poster_path
  
        showMoviesSection.innerHTML += `
        <div 
          class="movie-div"
          id="movie-div"
          onclick="showMovieDetails(${id}, '${searchWords}')"
        >
        <img 
          class="movie-list-img"
          src="https://image.tmdb.org/t/p/w500/${moviePoster}"
         />
        </div>
        `
      } 
    }  
}

function getBackDropHTML(photo, keywords) {
  detailsSection.innerHTML += `     
        <div 
          class="details-backdrop-img-div"
          id="details-div"
        >
        <img 
        class="details-backdrop-img"
        src="https://image.tmdb.org/t/p/w500/${photo}"
       />
         <h2
         class="white-smoke-text-h2"
         >
         ${dataForOneMovie.original_title}
         </h2>
         <p
         class="white-smoke-text-p"
         >
         <span style="color: #FECEAB">Overview:</span> ${dataForOneMovie.overview}
         </p>
         <p
         class="white-smoke-text-p"
         id="genresPTag"
         >
         <span style="color: #FECEAB">Genres:</span> 
         </p>
         <p
         class="white-smoke-text-p"
         id="release-date-p-tag"
         >
         <span style="color: #FECEAB">Release Date:</span>
         ${dataForOneMovie.release_date}
         </p>
         <p
         class="white-smoke-text-p"
         id="homepage-p-tag"
         >
         <span style="color: #FECEAB">Homepage:</span>
         <a 
          href="${dataForOneMovie.homepage}"
          class="white-smoke-text-p"
          target="_blank"
        >
         ${dataForOneMovie.homepage}
         </a>
         </p> 
        </div>
        <div class="text-align-center">
        <button 
        type="submit"
        id="go-home-btn"
        class="details-red-btn"
        onclick="goBackToMovieResults('${keywords}')"
        >
        Back to Results
        </button>
        </div>
        `
}
function getPosterHTML(photo, keywords) {
  detailsSection.innerHTML += `     
        <div 
          class="details-div"
          id="details-div"
        >
        <img 
        class="details-poster-img"
        src="https://image.tmdb.org/t/p/w500/${photo}"
       />
         <h2
         class="white-smoke-text-h2"
         >
         ${dataForOneMovie.original_title}
         </h2>
         <p
         class="white-smoke-text-p"
         >
         <span style="color: #FECEAB">Overview:</span> ${dataForOneMovie.overview}
         </p>
         <p
         class="white-smoke-text-p"
         id="genresPTag"
         >
         <span style="color: #FECEAB">Genres:</span> 
         </p>
         <p
         class="white-smoke-text-p"
         id="release-date-p-tag"
         >
         <span style="color: #FECEAB">Release Date:</span>
         ${dataForOneMovie.release_date}
         </p>
         <p
         class="white-smoke-text-p"
         id="homepage-p-tag"
         >
         <span style="color: #FECEAB">Homepage:</span>
         <a 
          href="${dataForOneMovie.homepage}"
          class="white-smoke-text-p"
          target="_blank"
        >
         ${dataForOneMovie.homepage}
         </a>
         </p> 
        </div>
        <div class="text-align-center">
        <button 
        type="submit"
        id="go-home-btn"
        class="details-red-btn"
        onclick="goBackToMovieResults('${keywords}')"
        >
        Back to Results
        </button>
        </div>
        `
}

function showMovieDetails (id, keywords) {
  clearSections()
  nextPageBtn.classList.add('hide')
  prevPageBtn.classList.add('hide')
  searchSection.classList.add('hide')

  axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=48631af2fa021659c6c1b373a03a59e6&language=en-US`)
  .then(function (response) {
    localStorage.setItem('dataForOneMovie', JSON.stringify(response.data)) 
    dataForOneMovie = JSON.parse(localStorage.getItem('dataForOneMovie'))
  
    for(let i = 0; i < response.data.genres.length; i++){ 
      genres.push(response.data.genres[i].name)
    }
  
    if(response.data.backdrop_path){
      getBackDropHTML(response.data.backdrop_path, keywords)
    } else {
      getPosterHTML(response.data.poster_path, keywords)
    }
        
    for(let i = 0; i < response.data.genres.length; i++){ 
    const genresPTag = document.querySelector('#genresPTag')
    genresPTag.innerHTML += `${genres[i]} `
    }

  })
  .catch(function (error) {
    clearLocalStorageAndArrays()
    errorSection.innerHTML += `
      <div class="not-found-div">
      <img 
      class="image404"
      src="images/404 Movies Not Found.png" />
      </div>
      `
    inputMovieSearch.value = ''
 

    console.log(error);
  })
}

function goBackToMovieResults (inputMovieSearchValue) {
  clearSections() 
  displayMovies(inputMovieSearchValue)
  nextPageBtn.classList.remove('hide')
  searchSection.classList.remove('hide')
}

function getMovies () {
  if(inputMovieSearch !== inputMovieSearchValue){
    clearLocalStorageAndArrays()
  }
  localStorage.setItem('inputMovieSearchValue', inputMovieSearch.value) 
  inputMovieSearchValue = localStorage.getItem('inputMovieSearchValue')
    clearSections()
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=48631af2fa021659c6c1b373a03a59e6&page=${pageNumber}&query=${inputMovieSearchValue}`)
  .then(function (response) {
  
      localStorage.setItem('resultsArray', JSON.stringify(response.data.results))
      resultsArrayFromLocalStorage = JSON.parse(localStorage.getItem('resultsArray'))
      resultsArray = resultsArrayFromLocalStorage
      console.log(response.data.results.length);
   
      displayMovies(inputMovieSearchValue)

      nextPageBtn.classList.remove('hide')
    
  })
  .catch(function (error) {
    if(resultsArray.length === 0){
      errorSection.innerHTML += `
      <div class="not-found-div">
      <img 
      class="image404"
      src="images/404 Movies Not Found.png" />
      </div>
      `
      inputMovieSearch.value = ''
      nextPageBtn.classList.add('hide')
      prevPageBtn.classList.add('hide')
      console.log(error);
    }
    
  })
}
  
searchButton.addEventListener('click', () => getMovies())

inputMovieSearch.addEventListener('keypress', (event) => {
  if(event.key === 'Enter') {
    event.preventDefault();
    getMovies()
  }
})

nextPageBtn.addEventListener('click', () => {
  pageNumber++
  getMovies()
})

prevPageBtn.addEventListener('click', () => {
  pageNumber--
  getMovies()
})






