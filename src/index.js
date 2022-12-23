import './css/styles.css';
import { Notify } from 'notiflix';
import { PicturesAPI } from './picturesAPI';
import { LoadMoreBtn } from './loadMoreBtn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  imgGallery: document.querySelector('.gallery'),
};
const pictureAPI = new PicturesAPI();

refs.searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  pictureAPI.query = e.target.elements.searchQuery.value.trim();
  if (pictureAPI.query === '') {
    Notify.warning('Enter some value');
    return;
  }

  try {
    const { hits, totalHits } = await pictureAPI.fetchAPI();
    renderPictures(hits);
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
     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
