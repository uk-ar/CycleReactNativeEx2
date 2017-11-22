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
                .share()

  const searchedBooksResponse$ =
    HTTP.select('search')
        .switch()
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
        .share();

  function createBooksStatusStream(books$, category) {
    const requestStatus$ =
      books$
        .map(books => books.map(book => book.isbn))
        .filter(isbns => isbns.length > 0)
        //.do((e)=>console.log(e))
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
                  .map(result => result.books)
                  .distinctUntilChanged((i,j) =>
                    JSON.stringify(i)==JSON.stringify(j))
          )
          .switch()
    /* .do((e)=>console.log(Object.keys(e).map((isbn)=>
     *   e[isbn][LIBRARY_ID].status)))*/
          .map((bookStatuses)=>
            Object.keys(bookStatuses)
                  .reduce((acc,isbn)=>{
                    let {libkey, reserveurl, status} =
                      bookStatuses[isbn][LIBRARY_ID]
                    libkey = libkey || {}
                    //{xxxx.Tokyo_Fuchu.{libkey,reserveUrl,status}}
                    if(status === "Running"){
                      s="Loading"
                    }else if(Object.keys(libkey).length === 0){
                      s="noCollection"
                    }else if(_.values(libkey)
                              .some(i => i === '貸出可')){
                      s="rentable"
                    }else{
                      s="onLoan"
                    }
                    acc[isbn]={
                      reserveUrl: reserveurl,
                      status: s
                    }
                    return acc
                  },{})
          )
          .distinctUntilChanged((i,j) =>
            JSON.stringify(i)==JSON.stringify(j))
          .shareReplay();

    return ({
      booksStatus$:booksStatusResponse$,
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

  const booksLoadingState$ =
    requestSearchedBooks$
      .map(_ => true)
      .merge(searchedBooksResponse$.map(_ => false))
      .distinctUntilChanged()
      .shareReplay();

  return {
    searchedBooksResponse$,
    searchedBooksStatus$,
    booksLoadingState$,
    request$,
  };
}
function model(actions) {
  const state$ = Rx
    .Observable
    .combineLatest(
      actions.searchedBooksResponse$.startWith([]),
      actions.searchedBooksStatus$.startWith({}),
      actions.booksLoadingState$.startWith(false),
      (searchedBooks, searchedBooksStatus, booksLoadingState ) =>
        ({ searchedBooks, searchedBooksStatus, booksLoadingState }));
  return state$;
}
module.exports = { intent, model }
