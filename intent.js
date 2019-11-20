import Rx from 'rxjs/Rx';
import _ from 'lodash';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID,
} from './constants';

import {
  InteractionManager,
} from 'react-native';

function intent(RN, HTTP) {
  // Actions
  const changeQuery$ = RN
    .select('search')
    .events('changeText')
    .do((e)=>console.log(e))
    .share()

  const press$ = RN
    .select('search')
    .events('press')

  const requestSearchedBooks$ =
    changeQuery$.debounceTime(500)
                .filter(query => query.length > 1)
                .map(q => ({
                  category: 'search',
                  url: RAKUTEN_SEARCH_API + encodeURI(q),
                  headers: { 'Content-Type':
                             'application/json; charset=utf-8' },
                  accept: 'Accept-Language:ja,en-US;q=0.8,en;q=0.6'
                }))
                .do((e)=>console.log(e))
                .share()

  const searchedBooksResponse$ =
    HTTP.select('search')
        .switch()
        .do((e)=>console.log(e))
        .map(res => res.body)
        .map(body =>
          body.Items
              .filter(book => book.isbn)
          // reject non book
              .filter(book =>
                book.isbn.startsWith('978') || book.isbn.startsWith('979'))
              .map(({ title, author, isbn, largeImageUrl }) => ({
                title: title.replace(/^【バーゲン本】/, ''),
                author,
                isbn,
                thumbnail: largeImageUrl,
              }))
        )
        .do((e)=>console.log(e))
        .share();

  function createBooksStatusStream(books$, category) {
    const requestStatus$ =
      books$
        .map(books => books.map(book => book.isbn))
        .filter(isbns => isbns.length > 0)
        .map(q => ({
          category,
          url: CALIL_STATUS_API + encodeURI(q)
        }))
        .shareReplay();

    const booksStatusResponse$ =
      HTTP.select(category)
    // should handle as meta stream because of retry
    //switchMap?
          .map(stream =>
            stream.map(res => res.body)
                  .do((e)=>console.log("ret:",e))
            // ok to retry but not output stream
            // .flatMap(result => result.continue === 1 ?
            //                 [result, Observable.throw(error)] : [result])
                  .flatMap(result => [{ ...result, continue: 0 }, result])
                  .map((result) => {
                    if (result.continue === 1) {
                      throw result;
                    }
                    return result;
                  })
                  .retryWhen(errors =>
                    errors.delay(2000)
                  )
                  .distinctUntilChanged((i,j) =>
                    JSON.stringify(i)==JSON.stringify(j))
                  .map(result => result.books))
          .switch()
          .do((e)=>console.log("change:",e))
          .shareReplay();

    function mergeBooksStatus(books, booksStatus) {
      return books.map((book) => {
        let libraryStatus;
        if ((booksStatus[book.isbn] !== undefined) && // not yet retrieve
            // sub library exist?
            (booksStatus[book.isbn][LIBRARY_ID].libkey !== undefined)) {
          const bookStatus = booksStatus[book.isbn][LIBRARY_ID];
          // TODO:support error case
          // if bookStatus.status == "Error"
          libraryStatus = {
            status: bookStatus.libkey,
            reserveUrl: bookStatus.reserveurl,
            //Support multiple library
            rentable: _.values(bookStatus.libkey)
                       .some(i => i === '貸出可'),
            exist: Object.keys(bookStatus.libkey)
                         .length !== 0,
          };
        }
        // TODO:support books from search result
        // TODO:support books from saved result
        // TODO:move to booksStatusResponse$
        return ({
          ...book,
          libraryStatus,
          //active: true,
        });
      }
      );
    }

    const booksStatus$ =
      Rx.Observable
        .combineLatest(
          books$,
          booksStatusResponse$.startWith({}),
          mergeBooksStatus,
        )
        .distinctUntilChanged((i,j) =>
          JSON.stringify(i)==JSON.stringify(j))
        .map(books =>
          books.map(book => ({ ...book, key: `isbn-${book.isbn}` })))
        .shareReplay();
    return ({
      booksStatus$,
      requestStatus$ });
  }

  const { booksStatus$: searchedBooksStatus$,
          requestStatus$: requestSearchedBooksStatus$ } =
            createBooksStatusStream(
              searchedBooksResponse$,
              'searchedBooksStatus');

  const request$ = Rx.Observable
                     .merge(requestSearchedBooks$,
                            requestSearchedBooksStatus$);

  searchedBooksStatus$
    .do((e)=>console.log("sb:",e))
    .subscribe();

  const booksLoadingState$ =
    requestSearchedBooks$
      .map(_ => true)
      .merge(searchedBooksResponse$.map(_ => false))
      .distinctUntilChanged()
      .shareReplay();

  return {
    searchedBooksStatus$,
    booksLoadingState$,
    request$,
  };
}
function model(actions) {
  const state$ = Rx
    .Observable
    .combineLatest(
      actions.searchedBooksStatus$,
      actions.booksLoadingState$.startWith(false),
      (searchedBooks, booksLoadingState ) => ({
        searchedBooks, booksLoadingState }));
  return state$;
}
module.exports = { intent, model }
