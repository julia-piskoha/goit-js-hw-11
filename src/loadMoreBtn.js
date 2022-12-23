export class LoadMoreBtn {
  constructor(classsName, onLoadMoreClick) {
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button type="button" class="${classsName}">Load more</button>`
    );
    this.loadMoreBtnRef = document.querySelector(`${classsName}`);
    this.loadMoreBtnRef.addEventListener('click', onLoadMoreClick);
  }
  hide() {
    this.loadMoreBtnRef.style.display = 'none';
  }
  show() {
    this.loadMoreBtnRef.style.display = 'block';
  }
}
