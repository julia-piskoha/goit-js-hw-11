import './css/styles.css';
import { Notify } from 'notiflix';
import { PicturesAPI } from './picturesAPI';
import { LoadMoreBtn } from './loadMoreBtn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchBtn: document.querySelector('.search-btn'),
  imgGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const pictureAPI = new PicturesAPI();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn);
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  pictureAPI.query = e.target.elements.searchQuery.value.trim();

  if (pictureAPI.query === '') {
    Notify.warning('Enter some value');
    return;
  }
  pictureAPI.resetPage();

  try {
    const { hits, totalHits } = await pictureAPI.fetchAPI();
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.imgGallery.innerHTML = '';
      loadMoreBtn.hide();
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    renderPictures(hits);
    simpleLightbox.refresh();
    loadMoreBtn.show();
  } catch (error) {
    Notify.failure('Oops, something is wrong');
  }
}
function renderPictures(hits) {
  const images = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
       <a href="${largeImageURL}">
     <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
     <div class="info">
     <p class="info-item">
      <b>Likes: </b>"${likes}"
     </p>
     <p class="info-item">
      <b>Views: </b>"${views}"
    </p>
    <p class="info-item">
      <b>Comments: </b>"${comments}"
    </p>
    <p class="info-item">
      <b>Downloads: </b>"${downloads}"
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.imgGallery.insertAdjacentHTML('beforeend', images);
}
async function onLoadMoreBtn() {
  try {
    const { hits } = await pictureAPI.fetchAPI();
    if (hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.hide();
    }

    let restOfPhotos =
      response.data.totalHits - pictureAPI.page * pictureAPI.per_page;
    if (restOfPhotos <= 0) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
    pictureAPI.resetPage();
    renderPictures(hits);
  } catch (error) {
    Notify.failure('Oops, something is wrong');
  }
}
