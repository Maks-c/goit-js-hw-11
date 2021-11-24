import './sass/main.scss';
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const galleryRef = document.querySelector('.gallery');
const formRef = document.getElementById('search-form');
const loadBtn = document.querySelector('.load-more');
const KEY = '24468331-2772ee4e74396411a92d27e8c';
let PER_PAGE = 40;
let pageCount = 1;
let inputValue;


loadBtn.style.display="none";

function fetchPictures(searchName, pageCount) {
  axios.get(`https://pixabay.com/api/?key=${KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${pageCount}`)

    .then(function (response) {
      return response.data;
    }).then(({hits, totalHits}) => {
    if (!hits.length) {
       return Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    const result = hits.map(({webformatURL, tags, likes, views, comments, downloads, largeImageURL}) => {

      return ` <li class="photo-card">

    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" data-src="${largeImageURL}" class="gallery__image" width="360" height="250"/>
    </a>

 <div class="info">
   <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
       <b>Downloads</b> ${downloads}
   </p>
</div>
</li>`}).join('');

    galleryRef.insertAdjacentHTML("beforeend", result)

    // if (galleryRef.children.length){
    //   loadBtn.style.display="block";
    // }

    const accessability =  Math.ceil(totalHits / PER_PAGE)

    if(pageCount === accessability) {

      return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    new SimpleLightbox('.gallery a').refresh()

    let lastElement = galleryRef.lastElementChild;


    const options = {
      // rootMargin: '100px 0 100px 0',
      threshold: 1,
    };

    function loadMore (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          pageCount +=1;
          fetchPictures(inputValue,pageCount)
          observer.unobserve(entry.target)
        }
      });
    }

    let observer = new IntersectionObserver(loadMore, options)
    observer.observe(lastElement);
  }).catch(function (error) {
      console.log(error);
    });
};




formRef.addEventListener("submit", getContent)


function getContent(e) {
  e.preventDefault();


  galleryRef.innerHTML = '';
  inputValue = e.target.elements.searchQuery.value;
  fetchPictures(inputValue,pageCount);


}

// loadBtn.addEventListener('click', loadMore)






